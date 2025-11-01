import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "./contexts/authContext";
import { AppContextProvider } from "./contexts/appContext";
import { ChartContextProvider } from "./contexts/chartcontext";

// import Layout from "./components/Layout";
import {
  PrivateRoute,
  Login,
  Empresa,
  Geral,
  Lancamentos,
  LancamentosIndex,
  ImportSelection,
  RuleEditor,
  FluxoDeCaixa,
  FluxoDeCaixaCategoria,
  FluxoDeCaixaMes,
  FluxoDeCaixaDia,
  Categorias,
  Profile,
  Bancos,
  Empresas,
  Users,
} from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { Layout2 } from "./components/Layout2";
import Relatorios from "./routes/relatorios";
import ImportEdit from "./routes/Lancamentos/Import/import-edit";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
    },
  },
});

const clientId = `896603876422-1o25lisbv1a5du4v141cadp6upio4tvq.apps.googleusercontent.com`;

const router = createBrowserRouter([
  {
    index: true,
    element: <Login />,
  },
  {
    path: "/selecao",
    element: <PrivateRoute to={<Empresa />} />,
  },
  {
    path: "/dashboard",
    element: <Layout2 />,
    children: [
      {
        index: true,
        // path: "",
        element: <PrivateRoute to={<Geral />} />,
      },
      {
        path: "lancamentos",
        element: <PrivateRoute to={<Lancamentos />} />,
        children: [
          {
            index: true,
            element: <LancamentosIndex />,
          },
          {
            path: "import",
            element: <ImportSelection />,
          },
          {
            path: "import/edit",
            element: <ImportEdit />,
          },
          {
            path: "import/rules",
            element: <RuleEditor />,
          },
        ],
      },
      {
        path: "fluxo-de-caixa",
        element: <PrivateRoute to={<FluxoDeCaixa />} />,
      },
      {
        path: "fluxo-de-caixa/:idCategoria",
        element: <PrivateRoute to={<FluxoDeCaixaCategoria />} />,
      },
      {
        path: "fluxo-de-caixa/:idCategoria/:mes",
        element: <PrivateRoute to={<FluxoDeCaixaMes />} />,
      },
      {
        path: "fluxo-de-caixa/:idCategoria/:mes/:dia",
        element: <PrivateRoute to={<FluxoDeCaixaDia />} />,
      },
      {
        path: "relatorios",
        element: <PrivateRoute to={<Relatorios />} />,
      },
      {
        path: "categorias",
        element: <PrivateRoute to={<Categorias />} />,
      },
      {
        path: "perfil",
        element: <PrivateRoute to={<Profile />} />,
      },
      {
        path: "bancos",
        element: <PrivateRoute to={<Bancos />} />,
      },
      {
        path: "empresas",
        element: <PrivateRoute to={<Empresas />} />,
      },
      {
        path: "users",
        element: <PrivateRoute to={<Users />} />,
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
      },
    ],
  },
]);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppContextProvider>
            <ChartContextProvider>
              <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <RouterProvider router={router} />
              </ThemeProvider>
            </ChartContextProvider>
          </AppContextProvider>
        </QueryClientProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
