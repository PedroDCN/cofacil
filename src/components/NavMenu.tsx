import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { useAuth } from "@/contexts/authContext";
import { useResizeListener } from "primereact/hooks";
import { Role } from "@/models/User";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import NameLogo from "@/assets/torresfintech_logo2_nobg.png";
import { Link } from "react-router-dom";

const menuItems: any = {
  geral: {
    label: "Geral",
    icon: "pi-chart-bar",
    to: "./",
  },
  lancamentos: {
    label: "Lançamentos",
    icon: "pi-chart-line",
    to: "lancamentos",
  },
  "fluxo-de-caixa": {
    label: "Fluxo de Caixa",
    icon: "pi-filter",
    to: "fluxo-de-caixa",
  },
  bancos: {
    label: "Bancos",
    icon: "pi-wallet",
    to: "bancos",
  },
  empresas: {
    label: "Empresas",
    icon: "pi-home",
    to: "empresas",
  },
  categorias: {
    label: "Categorias",
    icon: "pi-tag",
    to: "categorias",
  },
  usuarios: {
    label: "Usuários",
    icon: "pi-user",
    to: "users",
  },
};

const getMenuItemsByRole = (role: Role, items: any[]): any => {
  return (
    {
      [Role.ADMIN]: [
        "geral",
        "lancamentos",
        "fluxo-de-caixa",
        "bancos",
        "categorias",
        "empresas",
        "usuarios",
      ],
      [Role.GERENTE]: [
        "geral",
        "lancamentos",
        "fluxo-de-caixa",
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

export default function NavMenu() {
  const { sidebarVisible, toggleSidebar } = useApp();
  const isSmallScreen = useMediaQuery("(max-width: 860px)");

  const { session } = useAuth();

  const customMenuItem = (item: any): any => {
    return (
      <li key={item.to}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            cn(
              `h-auto text-base no-underline flex items-center cursor-pointer p-4
              rounded border-round bg-transparent text-slate-700 hover:bg-slate-400/20
              transition duration-150 w-full`,
              isActive && "bg-slate-300/60",
              isActive && "text-purple-500"
            )
          }
        >
          <i className={cn(item.icon, "pi mr-2")}></i>
          <span className="font-medium">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  const mainMenuItems = getMenuItemsByRole(session?.user?.role, menuItems);

  const [bindWindowResizeListener, unbindWindowResizeListener] =
    useResizeListener({
      listener: (event: any) => {
        const w = event.currentTarget.innerWidth;
        // Tamanho do breakpoint para aparecer/sumir a navbar
        if (w > 992) {
          if (sidebarVisible) toggleSidebar();
        }
      },
    });

  useEffect(() => {
    bindWindowResizeListener();

    return () => {
      unbindWindowResizeListener();
    };
  }, [bindWindowResizeListener, unbindWindowResizeListener]);

  return (
    <>
      <div
        id="sidebar"
        className={cn(
          `bg-white h-full w-[280px]
          dark:bg-gray-800/90
          flex-shrink-0 absolute left-[-280px]
          border-r-[1px] border-r-slate-300/80
          top-0 z-10  select-none transition-[left] duration-200`,
          sidebarVisible && !isSmallScreen
            ? "left-0"
            : sidebarVisible && isSmallScreen
            ? "left-0 w-full"
            : ""
        )}
      >
        <div className="flex flex-col h-full">
          <NavTitle
            isSmallScreen={isSmallScreen}
            toggleSidebar={toggleSidebar}
          />

          <div className="overflow-y-auto">
            <ul className="list-none p-3 overflow-hidden">
              {mainMenuItems?.map(customMenuItem)}

              {isSmallScreen &&
                (session?.user?.role === Role.ADMIN ||
                  session?.user?.role === Role.GERENTE) && (
                  <>
                    {customMenuItem({
                      label: "Empresas",
                      icon: "pi-building",
                      to: "empresas",
                    })}
                    {customMenuItem({
                      label: "Usuários",
                      icon: "pi-user",
                      to: "users",
                    })}
                  </>
                )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function NavTitle({
  isSmallScreen,
  toggleSidebar,
}: {
  isSmallScreen: boolean;
  toggleSidebar: any;
}) {
  return (
    <div className="max-h-[120px] flex items-center px-3 py-2 flex-shrink-0">
      <span className="max-h-[60px] text-gray-800/90 text-2xl font-bold">
        <Link to={"selecao"}>
          <img
            className={cn(
              `inline-block object-contain max-w-full`,
              isSmallScreen ? "h-[60px]" : "h-[64px]"
            )}
            src={NameLogo}
          />
        </Link>
      </span>

      <button
        className={"border-none ml-auto min-[860px]:hidden bg-transparent p-3"}
        onClick={toggleSidebar}
      >
        <i id="sidebar-close" className="pointer-events-none pi pi-times"></i>
      </button>
    </div>
  );
}
