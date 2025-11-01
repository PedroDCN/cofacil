import TopBar from "./TopBar/TopBar";
import NavMenu from "./NavMenu";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useApp } from "@/contexts/appContext";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = {};

export default function Layout({}: Props) {
  const { sidebarVisible } = useApp();
  const isSmallScreen = useMediaQuery("(max-width: 680px)");

  return (
    <>
      <div className="h-screen flex relative bg-slate-200/70 overflow-hidden">
        <NavMenu />
        <div
          className={cn(
            "min-h-screen flex flex-col relative flex-auto overflow-y-auto transition-[margin-left] duration-200",
            sidebarVisible && !isSmallScreen ? "ml-[280px]" : ""
          )}
        >
          <TopBar />
          <Outlet />
        </div>
      </div>
      {/* algum conflito na biblioteca faz com que a opção richColors
      não funcione caso não se tenha o className */}
      <Toaster
        richColors
        closeButton
        duration={15000}
        toastOptions={{
          classNames: {
            closeButton: "right-0 left-[calc(100%-10px)]",
          },
        }}
      />
    </>
  );
}
