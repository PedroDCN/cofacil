import { useState } from "react";
import { useApp } from "@/contexts/appContext";
import { getEmpresas } from "@/services/empresaService";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import { Role } from "@/models/User";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProfileButton from "../ProfileButton";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@/hooks/useMediaQuery";

type Empresa = {
  id: string;
  nome: string;
};

export default function TopBar() {
  const { toggleSidebar, empresa, setEmpresa, printMode } = useApp();
  const isSmallScreen = useMediaQuery("(max-width: 860px)");
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["empresasData"],
    queryFn: getEmpresas,
  });

  return (
    <div
      id="top-bar"
      className={cn(
        `h-[60px] flex-none justify-between items-center px-5 
        bg-white border-b-[1px] border-b-slate-300/80 sticky top-0 w-full z-5
        `,
        printMode ? "hidden" : "flex"
      )}
    >
      <div className="flex items-center justify-center gap-4">
        <Button
          className="bg-white cursor-pointer inline-flex"
          onClick={toggleSidebar}
          variant="secondary"
        >
          <i className="pi pi-bars text-3xl"></i>
        </Button>

        {session?.user?.role != Role.CLIENTE && (
          <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {empresa && !isLoading
                    ? data?.find((v: any) => v.id === empresa.id)?.nome
                    : "Selecione uma Empresa..."}
                  <i className="pi pi-chevron-down text-3xl"></i>
                  {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Procure uma Empresa..." />
                  <CommandEmpty className="text-center break-words text-sm p-4">
                    Nenhuma empresa encontrada.
                  </CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    {!isLoading &&
                      data?.map((v: any) => (
                        <CommandItem
                          key={v.id}
                          value={v.id}
                          onSelect={(currentValue) => {
                            if (currentValue !== empresa.id.toLowerCase()) {
                              const newEmp = data.find(
                                (v: any) => v.id.toLowerCase() === currentValue
                              );
                              setEmpresa(newEmp);
                            }
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <i
                            className={cn(
                              "pi pi-check mr-2",
                              v?.id === empresa?.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          ></i>
                          {v.nome}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </>
        )}

        {!isSmallScreen &&
          (session?.user?.role === Role.ADMIN ||
            session?.user?.role === Role.GERENTE) && (
            <div className="flex items-center gap-2">
              <NavLink
                to={"empresas"}
                className={({ isActive }) =>
                  cn(
                    "h-auto text-base no-underline flex items-center cursor-pointer p-4 transition duration-150 w-full",
                    isActive
                      ? "text-purple-500"
                      : "text-slate-500 hover:text-purple-400"
                  )
                }
              >
                <span className="font-medium">Empresas</span>
              </NavLink>
              <NavLink
                to={"users"}
                className={({ isActive }) =>
                  cn(
                    "h-auto text-base no-underline flex items-center cursor-pointer p-4 transition duration-150 w-full",
                    isActive
                      ? "text-purple-500"
                      : "text-slate-500 hover:text-purple-400"
                  )
                }
              >
                <span className="font-medium">Usuários</span>
              </NavLink>
            </div>
          )}
      </div>

      <div className="flex items-center mr-2">
        <ProfileButton
          onLogout={() => {
            setEmpresa(null);
            logout(() => navigate("/", { replace: true }));
          }}
        />
      </div>
    </div>
  );
}
