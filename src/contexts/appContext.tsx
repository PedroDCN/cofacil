import { LancamentoRascunho } from "@/utils/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type AppContextType = {
  empresa: any;
  setEmpresa: React.Dispatch<React.SetStateAction<string>> | any;
  sidebarVisible: boolean;
  toggleSidebar: any;
  printMode: boolean;
  setPrintMode: React.Dispatch<React.SetStateAction<boolean>>;
  banco: any;
  setBanco: React.Dispatch<React.SetStateAction<any>>;
  items: Array<LancamentoRascunho>;
  setItems: Dispatch<SetStateAction<Array<LancamentoRascunho>>>;
  bancoId: string;
  setBancoId: Dispatch<SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
};

const appContext = createContext<AppContextType>({
  printMode: false,
  setPrintMode: () => {},
  empresa: {},
  setEmpresa: () => {},
  sidebarVisible: true,
  toggleSidebar: () => {},
  banco: {},
  setBanco: () => {},
  items: [],
  setItems: () => {},
  bancoId: "",
  setBancoId: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
});

const empresa_mock = {
  id: "1",
  nome: "Empresa Mock",
  ramo: "ALIMENTICIO",
  email: "email@email.com",
};

export function AppContextProvider(props: any) {
  const [empresa, setEmpresa] = useState<any>(empresa_mock);
  const [sidebarVisible, setSidebarVisible] = useState<any>(true);
  const [printMode, setPrintMode] = useState<boolean>(false);
  const [banco, setBanco] = useState(null);
  const [itemsOFX, setItemsOFX] = useState<Array<LancamentoRascunho>>([]);
  const [bancoId, setBancoId] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);

  function toggleSidebar() {
    setSidebarVisible((currVisibility: boolean) => {
      return !currVisibility;
    });
  }

  useLayoutEffect(() => {
    if (window.matchMedia("(max-width: 860px)").matches) {
      setSidebarVisible(false);
    }
  }, []);

  return (
    <appContext.Provider
      value={{
        sidebarVisible,
        toggleSidebar,
        empresa,
        setEmpresa,
        printMode,
        setPrintMode,
        banco,
        setBanco,
        items: itemsOFX,
        setItems: setItemsOFX,
        bancoId,
        setBancoId,
        activeIndex,
        setActiveIndex,
      }}
    >
      {props.children}
    </appContext.Provider>
  );
}

export function useApp(): AppContextType {
  return useContext(appContext);
}
