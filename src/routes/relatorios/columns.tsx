import { Button } from "@/components/ui/button";
import { Relatorio } from "@/utils/types";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CopyIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function copyToClipboard(content: string) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    toast.success("Sucesso", {
      description: "url copiada com sucesso",
    });
    return navigator.clipboard.writeText(content);
  }
  return Promise.reject("Clipboard API não está disponível.");
}

function UrlCell(cell: CellContext<Relatorio, string>) {
  const link = cell.getValue();
  return (
    <div className="flex items-center gap-2">
      <Link
        to={link}
        target="_blank"
        className="underline
      text-blue-800 hover:text-blue-600"
      >
        {link}
      </Link>

      <Button
        variant="ghost"
        className="w-8 h-8"
        onClick={() => copyToClipboard(link)}
      >
        <CopyIcon className="w-[0.875rem] h-[0.875rem] flex-shrink-0" />
      </Button>
    </div>
  );
}

function DataHeaderButton({ column }: HeaderContext<Relatorio, unknown>) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (column.getIsSorted()) {
          if (column.getIsSorted() === "asc") column.toggleSorting(true);
          else column.clearSorting();
        } else {
          column.toggleSorting(column.getIsSorted() === "asc");
        }
      }}
    >
      Data
      {column.getIsSorted() === "asc" ? (
        <ArrowUpIcon className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDownIcon className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

export function useColumns() {
  return [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "url",
      header: "Url",
      cell: UrlCell,
    },
    {
      accessorKey: "data",
      header: DataHeaderButton,
    },
  ] as ColumnDef<Relatorio>[];
}
