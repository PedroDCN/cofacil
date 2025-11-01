import {
  createContext,
  useEffect,
  useState,
  useContext,
  Fragment,
} from "react";
import { Role, User } from "../models/User";
import { googleLogout } from "@react-oauth/google";
import userIcon from "../assets/user_icon.jpg";
import axios from "axios";
import { verifyUser } from "../services/userService";
import api from "@/services/api";

export const authContext = createContext({
  session: {
    user: {
      id: "",
      role: Role.CLIENTE,
      name: "",
      email: "",
      image: "",
    },
    token: "",
  },
  login: (info: any, callback: VoidFunction, errCallback: any) => {},
  login2: (
    credentials: { email: string; senha: string },
    callback: VoidFunction,
    errCallback: any
  ) => {},
  logout: (callback: VoidFunction) => {},
  loginMock: () => {},
});

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider({ children }: any) {
  let [session, setSession] = useState<any>(null);

  const LOCAL_STORAGE_ACCESS_TOKEN: string = "session-token";

  async function login(info: any, callback: VoidFunction, errCallback: any) {
    try {
      const user = await axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${info.access_token}`,
          {
            headers: {
              Authorization: `${info.token_type} ${info.access_token}`,
              Accept: "Application/json",
            },
          }
        )
        .then((response: any) => response.data);

      api.defaults.headers.common[
        "Authorization"
      ] = `${info.token_type} ${info.access_token}`;
      const verifiedUser = await verifyUser(user.email);

      if (verifiedUser?.id) {
        const sessionObject = {
          user: {
            id: verifiedUser.id,
            name: verifiedUser.nome,
            email: user.email,
            role: verifiedUser.tipo,
            image: user.picture || userIcon,
          },
          token: `${info.token_type} ${info.access_token}`,
        };
        setSession(sessionObject);
        localStorage.setItem(
          LOCAL_STORAGE_ACCESS_TOKEN,
          JSON.stringify(sessionObject)
        );
        callback();
      } else {
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
        api.defaults.headers.common["Authorization"] = "";
        googleLogout();
        throw new Error();
      }
    } catch (e: any) {
      api.defaults.headers.common["Authorization"] = "";
      errCallback(e);
    }
  }

  async function loginMock() {
    setSession({
      user: {
        id: "1",
        role: Role.ADMIN,
        name: "Teste",
        email: "teste@email.com",
        image: "",
      },
      token: "",
    });
  }

  async function login2(
    credentials: { email: string; senha: string },
    callback: VoidFunction,
    errCallback: any
  ) {
    try {
      const response = await api
        .post(`/auth/login`, { ...credentials })
        .then((response) => response.data);
      console.log(response);
      // email, empresas, id, nome, primeiroLogin, tipo, token

      const sessionObject = {
        user: {
          id: response.id,
          nome: response.nome,
          email: response.email,
          role: response.tipo,
          image: userIcon,
          primeiroLogin: response.primeiroLogin,
          empresas: response.empresas,
        },
        token: response.token,
      };

      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      setSession(sessionObject);
      localStorage.setItem(
        LOCAL_STORAGE_ACCESS_TOKEN,
        JSON.stringify(sessionObject)
      );
      callback();
    } catch (e: any) {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
      api.defaults.headers.common["Authorization"] = "";
      errCallback(e);
    }
  }

  function logout(callback: VoidFunction) {
    setSession({});
    api.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    googleLogout();
    callback();
  }

  useEffect(() => {
    let sessionStorage: any = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);

    if (sessionStorage) {
      let sessionObject = JSON.parse(sessionStorage);
      setSession(sessionObject);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${sessionObject.token}`;
    } else {
      setSession({});
      api.defaults.headers.common["Authorization"] = "";
      console.log("Não foi possível recuperar sessão");
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    }
  }, []);

  if (session == null) {
    return (
      <Fragment key="auth-provider">
        <div className="h-screen flex-auto flex pt-5 flex-col justify-center bg-slate-200/70"></div>
      </Fragment>
    );
  }

  return (
    <authContext.Provider
      key="auth-provider"
      value={{ session, login, login2, logout, loginMock }}
    >
      {children}
    </authContext.Provider>
  );
}
