import { useAuth } from "@/contexts/authContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ComputerIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Theme, useTheme } from "./theme-provider";

type Props = {
  onLogout: VoidFunction;
};

export default function ProfileButton({ onLogout }: Props) {
  const [isOpen, setisOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    session: { user },
  } = useAuth();

  function getThemeName(theme: string) {
    return {
      system: "sistema",
      dark: "escuro",
      light: "claro",
    }[theme];
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setisOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "rounded-full transition-shadow overflow-hidden cursor-pointer",
            isOpen ? "ring-2 ring-slate-800" : "hover:ring-1 ring-slate-500"
          )}
        >
          <div>
            <Avatar>
              <AvatarImage src={user?.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium">Minha Conta</p>
          <p className="mt-1 leading-none text-xs text-muted-foreground">
            {user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Perfil</span>
            {/* <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunIcon className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Aparência: {getThemeName(theme)}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(v) => setTheme(v as Theme)}
              >
                <DropdownMenuRadioItem value="system" disabled>
                  <ComputerIcon className="mr-2 h-4 w-4" />
                  <span>Tema do Sistema</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <SunIcon className="mr-2 h-4 w-4" />
                  <span>Tema Claro</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" disabled>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  <span>Tema Escuro</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProfileButtonNav({ onLogout }: Props) {
  const [isOpen, setisOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    session: { user },
  } = useAuth();

  function getThemeName(theme: string) {
    return {
      system: "sistema",
      dark: "escuro",
      light: "claro",
    }[theme];
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setisOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "transition-shadow overflow-hidden cursor-pointer p-2 w-full justify-start"
          )}
        >
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={user?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-ellipsis overflow-hidden">
            {user?.name || user?.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mb-2 ml-2">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium">Minha Conta</p>
          <p className="mt-1 leading-none text-xs text-muted-foreground">
            {user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunIcon className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span>Aparência: {getThemeName(theme)}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
            >
              <DropdownMenuRadioItem value="system" disabled>
                <ComputerIcon className="mr-2 h-4 w-4" />
                <span>Tema do Sistema</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">
                <SunIcon className="mr-2 h-4 w-4" />
                <span>Tema Claro</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <MoonIcon className="mr-2 h-4 w-4" />
                <span>Tema Escuro</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
