import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table as ITable } from "@tanstack/react-table";
import { SlidersHorizontalIcon } from "lucide-react";

const columnsLabel = {
  tipo: "Tipo",
  // valor: "Valor",
  // data: "Data",
  nomeCategoria: "Categoria",
  nomeBanco: "Banco",
  descricao: "Descrição",
  comentarios: "Comentários",
};
interface DataTableViewOptionsProps<TData> {
  table: ITable<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 flex">
          <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
          Visualização
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Selecionar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .filter((column) => !["valor", "data"].includes(column.id))
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {/* {column.columnDef.header as string} */}
                {/* @ts-ignore */}
                {columnsLabel[column.id]}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
