import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PenIcon,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import EditaLancamentoDialog from "../components/EditaLancamentoDialog";
import { useState } from "react";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { dateFormatter } from "@/utils/dateUtil";
import { Lancamento, Banco, Categoria } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

export function useColumns(
  onDelete: (row: Lancamento) => Promise<void>,
  onEdit: (row: Row<Lancamento>) => Promise<void>,
  categoriasData: Array<Categoria>,
  bancosData: Array<Banco>
) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="h-full flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent"
              >
                <ChevronDownIcon className="w-4 h-4 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 ml-36">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    table.toggleAllRowsSelected(!table.getIsAllRowsSelected())
                  }
                >
                  <span>Selecionar todos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <span>Limpar seleção</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div className="h-full flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("tipo") === "CREDITO" ? "credito" : "debito"}
        >
          {row.getValue("tipo")}
        </Badge>
      ),
    },
    {
      accessorKey: "valor",
      header: ({ column }) => {
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
            Valor
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("valor"));
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount);
        return <>{formatted}</>;
      },
    },
    {
      accessorKey: "data",
      header: ({ column }) => {
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
      },
      cell: ({ row }) => {
        return dateFormatter(row.original.data as unknown as string);
      },
    },
    {
      accessorKey: "nomeCategoria",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:"
            onClick={() => {
              if (column.getIsSorted()) {
                if (column.getIsSorted() === "asc") column.toggleSorting(true);
                else column.clearSorting();
              } else {
                column.toggleSorting(column.getIsSorted() === "asc");
              }
            }}
          >
            Categoria
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "nomeBanco",
      header: ({ column }) => {
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
            Banco
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ getValue }) => {
        return (
          <div className="max-w-[45ch]">
            <p className="truncate" title={getValue() as string}>
              {getValue() as string}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "comentarios",
      header: "Comentários",
      cell: ({ getValue }) => {
        return (
          <div className="max-w-[45ch]">
            <p className="truncate" title={getValue() as string}>
              {getValue() as string}
            </p>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        // const lancamento = row.original;
        const [isMenuOpen, setIsMenuOpen] = useState(false);

        return (
          <DropdownMenu
            open={isMenuOpen}
            onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Ações</DropdownMenuLabel> */}
              <EditaLancamentoDialog
                handleSubmit={(lancamento: any) => {
                  onEdit({
                    ...lancamento,
                    id: row.original.id,
                    data: lancamento.data.toISOString().substr(0, 10),
                  });
                }}
                categorias={categoriasData}
                bancos={bancosData}
                selectedLancamento={row.original}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Editar
                  <PenIcon className="ml-auto w-3.5 h-3.5 text-muted-foreground/70" />
                </DropdownMenuItem>
              </EditaLancamentoDialog>
              <ConfirmDeleteDialog
                title="Confirmar"
                description={
                  <span className="my-2 confirmation-content flex items-center justify-center">
                    <i
                      className="pi pi-exclamation-triangle mr-3 text-red-600"
                      style={{ fontSize: "2rem" }}
                    />
                    <span>
                      Tem certeza que deseja excluir o lançamento{" "}
                      <b>{row.original.descricao}</b>?
                    </span>
                  </span>
                }
                onAction={async () => {
                  await onDelete(row.original);
                  if (table.getPaginationRowModel().rows.length == 1) {
                    table.previousPage();
                  }
                }}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Deletar
                  <Trash2Icon className="ml-auto w-3.5 h-3.5 text-muted-foreground/70" />
                </DropdownMenuItem>
              </ConfirmDeleteDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] as ColumnDef<Lancamento>[];
}
