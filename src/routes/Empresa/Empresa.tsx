import { useApp } from "@/contexts/appContext";
import { useQuery } from "@tanstack/react-query";
import { criaEmpresa, getEmpresas } from "@/services/empresaService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@/models/User";
import AdicionaEmpresaDialog from "./components/AdicionaEmpresaDialog";
import { toast, Toaster } from "sonner";
import ProfileButton from "@/components/ProfileButton";
import { EmpresaDTO } from "@/utils/types";

const empresa_mock = {
  id: "1",
  nome: "Empresa Mock",
  ramo: "ALIMENTICIO",
  email: "email@email.com",
};

export default function Empresa() {
  const { empresa, setEmpresa } = useApp();
  const {
    session: { user },
    logout,
  } = useAuth();
  const navigate = useNavigate();

  const { data, refetch } = useQuery({
    queryKey: ["empresasData"],
    queryFn: getEmpresas,
    initialData: [empresa_mock],
  });

  async function criarEmpresa(empresa: EmpresaDTO) {
    if (empresa.nome.trim()) {
      try {
        await criaEmpresa(empresa);
        toast.success("Sucesso", {
          description: "Empresa Criada",
        });
      } catch (e: any) {
        toast.error("Erro", {
          description:
            e?.response?.data?.errorMessage || "Erro na adição de empresa",
        });
      } finally {
        refetch();
      }
    }
  }

  function enterApp() {
    if (!empresa) return;
    navigate("/dashboard/", { replace: true });
  }

  return (
    <div className="min-h-screen w-full bg-slate-200 relative">
      <div
        className={cn(
          "flex flex-col gap-4 container py-4",
          empresa ? "h-[calc(100vh-8rem)]" : "h-screen"
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-4xl">Empresas</h1>
          <ProfileButton
            onLogout={() => {
              setEmpresa(null);
              logout(() => navigate("/"));
            }}
          />
        </div>

        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-sm:grid-cols-1 gap-2 w-full p-4 overflow-y-auto">
          {data && data?.length > 0 ? (
            data?.map((empresaValue: any) => (
              <Card
                key={empresaValue.id}
                onClick={() => {
                  if (empresaValue.id === empresa?.id) {
                    setEmpresa(null);
                  } else {
                    setEmpresa(empresaValue);
                  }
                }}
                className={cn(
                  "w-[280px] hover:shadow-md transition-shadow cursor-pointer",
                  empresaValue.id === empresa?.id
                    ? // ? "ring-2 ring-purple-400 hover:shadow-none"
                      "bg-purple-800 text-white transition-colors duration-200 hover:shadow-none"
                    : ""
                )}
              >
                <CardHeader>
                  <CardTitle>{empresaValue.nome}</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            ))
          ) : !(user?.role === Role.GERENTE || user?.role === Role.ADMIN) ? (
            <div className="flex gap-2 flex-wrap w-full py-6 px-4">
              <p className="font-semibold text-xl mb-4">
                Sem empresas disponiveis para acesso.
              </p>
            </div>
          ) : null}

          {(user?.role === Role.GERENTE || user?.role === Role.ADMIN) && (
            <AdicionaEmpresaDialog handleSubmit={criarEmpresa}>
              <Card
                className={
                  "w-[280px] bg-transparent border border-dashed border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                }
              >
                <CardHeader>
                  <CardTitle>+ Nova Empresa</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </AdicionaEmpresaDialog>
          )}
        </div>
      </div>

      {empresa ? (
        <div className="flex items-center justify-end absolute z-10 bottom-0 left-0 right-0 px-6 h-32 bg-white">
          {/* Depois de selecionar empresa, aparece botão para entrar -> */}
          <Button
            disabled={!empresa}
            className="flex w-36 h-14 items-center justify-evenly text-xl"
            onClick={enterApp}
          >
            Entrar
            <ChevronRightIcon className="" />
          </Button>
        </div>
      ) : null}

      <Toaster
        richColors
        closeButton
        duration={10000}
        toastOptions={{
          classNames: {
            closeButton: "right-0 left-[calc(100%-10px)]",
          },
        }}
      />
    </div>
  );
}
