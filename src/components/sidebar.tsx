import { Dispatch, SetStateAction } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { Role } from "@/models/User";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import { ProfileButtonNav } from "./ProfileButton";
import { EmpresaSwitcher } from "./empresa-switcher";
import {
  BarChart4Icon,
  FilterIcon,
  HomeIcon,
  LineChartIcon,
  LucideIcon,
  MenuIcon,
  Table2Icon,
  TagIcon,
  UserCogIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import NameLogo from "@/assets/torresfintech_logo2_nobg.png";
import { useApp } from "@/contexts/appContext";

const getMenuItemsByRole = (role: Role, items: any[]): any => {
  return (
    {
      [Role.ADMIN]: [
        "geral",
        "lancamentos",
        "fluxo-de-caixa",
        "relatorios",
        "bancos",
        "categorias",
        "empresas",
        "usuarios",
      ],
      [Role.GERENTE]: [
        "geral",
        "lancamentos",
        "fluxo-de-caixa",
        "relatorios",
        "bancos",
        "categorias",
        "empresas",
        "usuarios",
      ],
      [Role.FUNCIONARIO]: ["lancamentos", "bancos", "categorias"],
      [Role.CLIENTE]: ["geral", "fluxo-de-caixa"],
    }[role]?.map((item) => items[item as any]) || []
  );
};

const links = {
  geral: {
    title: "Geral",
    label: "",
    icon: BarChart4Icon,
    to: "./",
  },
  lancamentos: {
    title: "Lançamentos",
    label: "",
    icon: LineChartIcon,
    to: "lancamentos",
  },
  "fluxo-de-caixa": {
    title: "Fluxo de Caixa",
    label: "",
    icon: FilterIcon,
    to: "fluxo-de-caixa",
  },
  relatorios: {
    title: "Relatórios",
    label: "",
    icon: Table2Icon,
    to: "relatorios",
  },
  bancos: {
    title: "Bancos",
    label: "",
    icon: WalletIcon,
    to: "bancos",
  },
  empresas: {
    title: "Empresas",
    label: "",
    icon: HomeIcon,
    to: "empresas",
  },
  categorias: {
    title: "Categorias",
    label: "",
    icon: TagIcon,
    to: "categorias",
  },
  usuarios: {
    title: "Usuários",
    label: "",
    icon: UsersIcon,
    to: "users",
  },
};

type SidebarProps = {
  isMenuFechado: boolean;
  setIsMenuFechado: Dispatch<SetStateAction<boolean>>;
};

export function Sidebar({ isMenuFechado, setIsMenuFechado }: SidebarProps) {
  const { setEmpresa } = useApp();
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 860px)");

  const mainMenuItems = getMenuItemsByRole(session?.user?.role, links as any);

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 max-w-[200px] dark:bg-black/40 ",
        isSmallScreen && isMenuFechado && "w-0 h-0 hidden flex-shrink",
        isSmallScreen &&
          !isMenuFechado &&
          "absolute left-0 right-0 bottom-0 top-0 z-10 max-w-full bg-white dark:bg-black"
      )}
    >
      {isSmallScreen && (
        <div className="flex justify-end px-4 py-1.5">
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={() => setIsMenuFechado((prev: any) => !prev)}
          >
            <MenuIcon />
          </Button>
        </div>
      )}
      <div className={cn("flex h-[52px] items-center justify-center")}>
        <Link to="selecao">
          <img
            src={NameLogo}
            className={cn("object-contain", isSmallScreen && "h-[50px]")}
          />
        </Link>
      </div>
      <Separator />
      <div className={cn("flex h-[52px] items-center justify-center p-2")}>
        <EmpresaSwitcher />
      </div>
      <Separator />
      <Nav links={mainMenuItems} />
      <Separator />
      <div className="w-full mt-auto flex flex-col gap-2">
        {/* <NavLink
            to={"configuracao"}
            className={({ isActive }) =>
              cn(
                buttonVariants({
                  variant: isActive ? "default" : "ghost",
                  size: "sm",
                }),
                isActive &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start p-2 mx-2"
              )
            }
          >
            <UserCogIcon className="mr-2 h-4 w-4" />
            Configuração
          </NavLink> */}
        <Button
          disabled
          className={"justify-start p-2 mx-2"}
          size={"sm"}
          variant={"ghost"}
        >
          <UserCogIcon className="mr-2 h-4 w-4" />
          Configuração
        </Button>
        <div className="flex items-center p-2 bg-slate-200/50 dark:bg-transparent">
          <ProfileButtonNav
            onLogout={() => {
              setEmpresa(null);
              logout(() => navigate("/", { replace: true }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

type NavProps = {
  links: {
    title: string;
    icon: LucideIcon;
    to: string;
  }[];
};

function Nav({ links }: NavProps) {
  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              cn(
                buttonVariants({
                  variant: isActive ? "default" : "ghost",
                  size: "sm",
                }),
                isActive &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )
            }
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
