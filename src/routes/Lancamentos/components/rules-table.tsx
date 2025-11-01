import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Table as TableElement,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/contexts/appContext";
import { getCategorias } from "@/services/categoriaService";
import { getRules } from "@/services/lancamentoService";
import {
  dateCondtList,
  fieldList,
  numericCondtList,
  stringCondtList,
} from "@/utils/rulesUtil";
import { Categoria, Rule } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  RowSelectionState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

export const rulesColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        // onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "expander",
    header: () => "",
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
            className: "flex items-center",
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronDownIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      ) : (
        ""
      );
    },
  },
  { accessorKey: "nome", header: "Nome" },
  {
    accessorKey: "idCategoria",
    header: "Categoria",
    cell: ({ getValue, table }) => (
      <>
        {
          // @ts-expect-error
          table.options.meta?.categorias?.find(
            (categoria: any) => categoria.id === (getValue() as string)
          )?.nome
        }
      </>
    ),
  },
] as ColumnDef<Rule>[];

type RulesTableProps = {
  rulesSelection: RowSelectionState;
  setRulesSelection: Dispatch<SetStateAction<RowSelectionState>>;
};

export function RulesTable({
  setRulesSelection,
  rulesSelection,
}: RulesTableProps) {
  const { empresa } = useApp();

  const { data: rulesData, isLoading: isRulesLoading } = useQuery({
    queryKey: ["importRules", empresa],
    queryFn: getRules,
  });

  const { isLoading: isCategoriasLoading, data: categoriasData } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  const table = useReactTable({
    data: rulesData,
    columns: rulesColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.id,
    onRowSelectionChange: setRulesSelection,
    state: {
      rowSelection: rulesSelection,
    },
    meta: {
      categorias: categoriasData,
    },
  });

  useEffect(() => {
    if (rulesData && table.getRowModel().rows?.length > 0)
      table.toggleAllRowsSelected();
  }, [rulesData, isRulesLoading]);

  if (isRulesLoading || isCategoriasLoading) {
    return (
      <div className="w-full h-32 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <TableElement>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="overflow-y-auto">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Fragment key={`${row.id}-Fragment`}>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow key={`${row.id}-expanded`}>
                  <TableCell colSpan={row.getVisibleCells().length}>
                    {renderSubComponent({ row })}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))
        ) : (
          <TableRow key={"empty-row"}>
            <TableCell
              colSpan={rulesColumns?.length}
              className="h-24 text-center"
            >
              Nenhum resultado encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableElement>
  );
}

function renderSubComponent({ row }: { row: Row<Rule> }) {
  const { conditions } = row.original;

  return (
    <Fragment key={`${row.id}-subcomp`}>
      <p className="font-semibold pb-2 -mt-2">Condições:</p>
      <ul className="space-y-2">
        {conditions?.length > 0 &&
          conditions.map((condition) => {
            const condtList =
              condition.campo === "valor"
                ? numericCondtList
                : condition.campo === "descricao"
                ? stringCondtList
                : dateCondtList;

            const campo = fieldList.find(
              (field) => field.value === condition.campo
            )?.label;
            // @ts-ignore
            const cond = condtList.find(
              (cond: any) => cond.value === condition.condicao
            )?.label;
            return (
              <li
                key={condition.id}
                className="py-1 px-2 bg-slate-100 rounded-sm"
              >
                <span>{campo}</span> <span>{cond}</span>{" "}
                <span>
                  "
                  {condition.campo === "data"
                    ? format(new Date(condition.valor), "d/MM/yyyy")
                    : (condition.valor as string)}
                  "
                </span>
              </li>
            );
          })}
      </ul>
    </Fragment>
  );
}
