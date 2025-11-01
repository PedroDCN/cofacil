import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { useApp } from "@/contexts/appContext";
import { getEmpresas } from "@/services/empresaService";
import { useQuery } from "@tanstack/react-query";

export function EmpresaSwitcher() {
  const { empresa, setEmpresa } = useApp();

  const { isLoading, data: empresas } = useQuery({
    queryKey: ["empresasData"],
    queryFn: getEmpresas,
  });

  if (isLoading) {
    return (
      <Button variant={"outline"} size={"sm"} disabled>
        Selecione uma Empresa...
      </Button>
    );
  }

  return (
    <>
      <Select
        defaultValue={empresa?.id}
        onValueChange={(id) => {
          setEmpresa(empresas?.find((emp: any) => emp.id === id));
        }}
      >
        <SelectTrigger
          className={cn(
            "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 min-w-full"
          )}
          aria-label="Selecione uma Empresa..."
        >
          <SelectValue
            className="min-w-full"
            placeholder="Selecione uma Empresa..."
          >
            <span className="max-w-[calc(150px-1rem)] overflow-hidden text-ellipsis">
              {empresa && empresas?.find((v: any) => v.id === empresa.id)?.nome}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {empresas?.map((emp: any) => (
            <SelectItem key={emp.id} value={emp.id}>
              <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                <span className="max-w-[calc(150px-1rem)] overflow-hidden text-ellipsis">
                  {emp.nome}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
