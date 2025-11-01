import { DataTable } from "@/components/data-table/data-table";
import { useColumns } from "./columns";
import { useRelatoriosRascunhos } from "./queries";
import { Spinner } from "@/components/ui/spinner";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { LucidePlusCircle } from "lucide-react";
import { Relatorio } from "@/utils/types";
import { useApp } from "@/contexts/appContext";

export default function Relatorios() {
  const { empresa } = useApp();
  const {
    isLoading,
    data: relatorios,
    isError,
    error,
  } = useRelatoriosRascunhos(empresa);
  const columns = useColumns();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: relatorios as Relatorio[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const isFiltered = table.getState().globalFilter;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center px-4 py-3">
        <Spinner />
      </div>
    );
  }

  // if (error) {
  //   throw error;
  // }

  return (
    <div className="px-4 my-3">
      <h1 className="text-2xl font-semibold mb-4">Relatórios</h1>
      <div className="space-y-2">
        {!isError && (
          <>
            <DataTableToolbar
              left={
                <>
                  {
                    <Input
                      placeholder={`Pesquisar...`}
                      value={
                        (table.getState().globalFilter as string) ?? ""
                        // (table.getColumn(columnToFilter)?.getFilterValue() as string) ??
                        // ""
                      }
                      onChange={(event) =>
                        // table
                        //   .getColumn(columnToFilter)
                        //   ?.setFilterValue(event.target.value)
                        table.setGlobalFilter(event.target.value)
                      }
                      className="h-8 w-[200px] lg:w-[250px]"
                    />
                  }
                  {isFiltered && (
                    <Button
                      variant="ghost"
                      onClick={() => table.resetGlobalFilter()}
                      className="h-8 px-2 lg:px-3"
                    >
                      Resetar
                      <LucidePlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </>
              }
              right={<DataTableViewOptions table={table} />}
            />
            <DataTable columns={columns} table={table} />
          </>
        )}
        {isError && (
          <>
            <h1>
              {(error as any)?.response?.data?.errorMessage ||
                "Ocorreu um erro ao carregar esta página"}
            </h1>
          </>
        )}
      </div>
    </div>
  );
}
