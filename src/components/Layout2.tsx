import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Toaster } from "./ui/sonner";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Layout2() {
  const [isMenuFechado, setIsMenuFechado] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 860px)");
  return (
    <>
      <div className="h-screen relative flex items-stretch">
        <Sidebar
          isMenuFechado={isMenuFechado}
          setIsMenuFechado={setIsMenuFechado}
        />
        <div
          className={cn(
            "min-h-screen flex flex-col flex-grow relative overflow-y-auto bg-slate-200/70 dark:bg-transparent"
          )}
        >
          {isSmallScreen && (
            <div className="flex justify-end w-full px-4 py-1.5">
              <Button
                size={"icon"}
                variant={"secondary"}
                onClick={() => setIsMenuFechado((prev) => !prev)}
              >
                <MenuIcon />
              </Button>
            </div>
          )}

          <Outlet />
        </div>
      </div>
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
    </>
  );
}
