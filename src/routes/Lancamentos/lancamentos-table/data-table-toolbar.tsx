import { Table as ITable } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CogIcon,
  FileInputIcon,
  FileOutputIcon,
  LucidePlusCircle,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import AdicionaLancamentoDialog from "../components/AdicionaLancamentoDialog";
import ImportaLancamentoDialog from "../components/ImportaLancamentoDialog";
import { DataTableViewOptions } from "./data-table-view-options";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { getLancamentosByEmpresaCSV } from "@/services/lancamentoService";
import { downloadCSV } from "@/utils/dataUtil";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { LancamentoRascunho } from "@/utils/types";
import { useLancamentosRascunhos } from "../queries";

interface DataTableToolbarProps<TData> {
  table: ITable<TData>;
  categorias: any[];
  bancos: any[];
  handleSubmit: any;
  handleDelete: any;
}

export function DataTableToolbar<TData>({
  table,
  categorias,
  bancos,
  handleSubmit,
  handleDelete,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const navigate = useNavigate();
  const { empresa, setItems, setBancoId } = useApp();
  const { data: rascunhoItems } = useLancamentosRascunhos();

  async function openImportSelection(
    data: LancamentoRascunho[],
    bancoId: string
  ) {
    data = data.map((d: LancamentoRascunho) => {
      return {
        ...d,
        tipo: d.valor > 0 ? "CREDITO" : "DEBITO",
      };
    });
    setItems(data);
    setBancoId(bancoId);
    navigate("import");
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        <Input
          placeholder="Pesquisar descrição..."
          value={
            // (table.getState().globalFilter as string) ?? ""
            (table.getColumn("descricao")?.getFilterValue() as string) ?? ""
          }
          onChange={
            (event) =>
              table.getColumn("descricao")?.setFilterValue(event.target.value)
            // table.setGlobalFilter(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("nomeCategoria") && (
          <DataTableFacetedFilter
            column={table.getColumn("nomeCategoria")}
            title="Categoria"
            options={categorias.map((c) => ({ value: c.nome, label: c.nome }))}
            onChange={() => table.firstPage()}
          />
        )}
        {table.getColumn("nomeBanco") && (
          <DataTableFacetedFilter
            column={table.getColumn("nomeBanco")}
            title="Banco"
            options={bancos.map((c) => ({ value: c.nome, label: c.nome }))}
            onChange={() => table.firstPage()}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.firstPage();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Resetar
            <LucidePlusCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
        {table.getSelectedRowModel().rows.length > 0 && (
          <ConfirmDeleteDialog
            title="Confirmar"
            description={
              <span className="my-2 confirmation-content flex items-center justify-center">
                <i
                  className="pi pi-exclamation-triangle mr-3 text-red-600"
                  style={{ fontSize: "2rem" }}
                />
                <span>
                  Tem certeza que deseja excluir{" "}
                  {table.getSelectedRowModel().rows.length} lançamentos?{" "}
                </span>
              </span>
            }
            onAction={() => {
              handleDelete(
                table.getSelectedRowModel().rows.map((r: any) => r.original?.id)
              );
              table.toggleAllRowsSelected(false);
              table.firstPage();
            }}
          >
            <Button size="sm" variant="destructive" className="h-8 flex">
              Deletar Lançamentos
              <Trash2Icon className="ml-2 h-4 w-4" />
            </Button>
          </ConfirmDeleteDialog>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {rascunhoItems && rascunhoItems.length > 0 && (
          <Button
            variant="link"
            size="sm"
            className="h-8 flex text-orange-600 hover:text-orange-800"
            onClick={() => {
              navigate("import/edit");
            }}
          >
            <FileInputIcon className="mr-2 h-4 w-4" /> Lançamentos Pendentes -{" "}
            {rascunhoItems.length}
          </Button>
        )}
        <Button
          variant="link"
          size="sm"
          className="h-8"
          onClick={() => navigate("import/rules")}
        >
          <CogIcon className="mr-2 h-4 w-4" />
          Regras
        </Button>
        <Button
          variant="default"
          size="sm"
          className="h-8"
          onClick={async () => {
            try {
              const csvContent = await getLancamentosByEmpresaCSV(empresa);
              downloadCSV(csvContent, empresa.value);
            } catch (e: any) {
              toast.error("Erro", {
                description:
                  e?.response?.data?.errorMessage || "Erro no download do CSV",
              });
            }
          }}
        >
          <FileOutputIcon className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        {rascunhoItems && rascunhoItems.length == 0 && (
          <ImportaLancamentoDialog
            bancos={bancos}
            openImportSelection={openImportSelection}
          >
            <Button variant="default" size="sm" className="h-8">
              <FileInputIcon className="mr-2 h-4 w-4" />
              Importar
            </Button>
          </ImportaLancamentoDialog>
        )}
        <AdicionaLancamentoDialog
          bancos={bancos}
          categorias={categorias}
          handleSubmit={(v: any) => {
            handleSubmit(v);
            table.firstPage();
          }}
        >
          <Button variant="default" size="sm" className="h-8 flex">
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </AdicionaLancamentoDialog>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
