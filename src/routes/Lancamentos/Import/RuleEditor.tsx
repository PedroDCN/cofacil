import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/appContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toolbar } from "primereact/toolbar";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditaRuleDialog from "../components/EditaRuleDialog";
import AdicionaRuleDialog from "../components/AdicionaRuleDialog";
import { getCategorias } from "@/services/categoriaService";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import {
  cadastraRule,
  deleteRule,
  editaRule,
  getRules,
} from "@/services/lancamentoService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Rule, RuleDTO } from "@/utils/types";

type Props = {};

export default function RuleEditor({}: Props) {
  const { empresa } = useApp();
  const navigate = useNavigate();
  const [selectedRules, setSelectedRules] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState<any>("");

  // @ts-ignore
  const { data: rulesData, refetch } = useQuery({
    queryKey: ["importRules", empresa],
    queryFn: getRules,
  });

  // @ts-ignore
  const { data: categoriasData } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  // @ts-ignore
  const ruleValues: any = useMemo(
    () =>
      rulesData?.map((rule: Rule) => ({
        nome: rule.nome,
        id: rule.id,
        conditions: rule.conditions,
        idCategoria: rule.idCategoria,
      })) || [],
    [rulesData]
  );

  const handleAddRule = async (rule: RuleDTO) => {
    try {
      await cadastraRule(rule);
      toast.success("Sucesso", {
        description: "Regra Criada",
      });
      refetch();
    } catch (e: any) {
      toast.error("Não foi possível cadastrar a regra", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Criação",
      });
    }
  };

  const handleDeleteRule = async (rule: Rule) => {
    try {
      await deleteRule(rule.id);
      toast.success("Sucesso", {
        description: "Regra Excluída",
      });
      refetch();
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Exclusão",
      });
    } finally {
      setSelectedRules(null);
    }
  };

  function excluirSelectedRules() {
    try {
      selectedRules.forEach(async (rule: Rule) => await deleteRule(rule.id));
      // bug: refetch deveria funcionar, problema com o forEach de cima que não
      // funciona para loops com await, utilizar Promises.all ou outro método
      // refetch();
      toast.success("Sucesso", {
        description: "Regras Excluídas",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Exclusão",
      });
    } finally {
      setTimeout(() => refetch(), 10);
      setSelectedRules(null);
    }
  }

  const handleEditRule = async (rule: Rule) => {
    try {
      await editaRule(rule);
      toast.success("Sucesso", {
        description: "Regra Editada",
      });
      refetch();
    } catch (e: any) {
      toast.error("Não foi possível editar a regra", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Edição",
      });
    }
  };

  const startToolbar = (
    <div className="flex flex-wrap gap-2">
      <Button
        className="bg-blue-600 hover:bg-blue-800 rounded-sm text-md"
        onClick={() => navigate("..")}
      >
        <i className="pi pi-chevron-left mr-2"></i>
        Voltar
      </Button>
      <AdicionaRuleDialog
        handleSubmit={handleAddRule}
        categorias={categoriasData}
      />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>Tem certeza que deseja excluir as regras selecionadas?</span>
          </span>
        }
        onAction={excluirSelectedRules}
      >
        <Button
          disabled={!selectedRules || !selectedRules?.length}
          className="bg-red-500 hover:bg-red-700 rounded-sm text-md"
        >
          <i className="pi pi-trash mr-2"></i>
          Excluir
        </Button>
      </ConfirmDeleteDialog>
    </div>
  );

  const tableHeader = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h4>Regras</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search"></i>
        <InputText
          type="search"
          placeholder="Pesquisar..."
          onInput={(e: any) => setGlobalFilter(e.target.value)}
        />
      </span>
    </div>
  );

  const actionBodyTemplate = (rowData: Rule) => (
    <>
      <EditaRuleDialog
        handleSubmit={handleEditRule}
        selectedRule={rowData}
        categorias={categoriasData}
      >
        <Button
          variant="outline"
          className="rounded-full p-2 aspect-square hover:text-white hover:bg-purple-700 mr-2"
        >
          <i className="pi pi-pencil"></i>
        </Button>
      </EditaRuleDialog>
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir a regra <b>{rowData?.nome}</b>?
            </span>
          </span>
        }
        onAction={() => handleDeleteRule(rowData)}
      >
        <Button
          variant="outline"
          className="rounded-full p-2 aspect-square hover:bg-red-500 hover:text-white"
        >
          <i className="pi pi-trash"></i>
        </Button>
      </ConfirmDeleteDialog>
    </>
  );

  return (
    <>
      <Toolbar className="" start={startToolbar} />

      <DataTable
        value={ruleValues}
        selection={selectedRules}
        onSelectionChange={(e) => setSelectedRules(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} a {last} de {totalRecords} Regras"
        emptyMessage="Sem Regras Cadastradas"
        globalFilter={globalFilter}
        header={tableHeader}
        removableSort
        className="mt-3 w-full"
      >
        <Column
          className="w-[5%]"
          selectionMode="multiple"
          exportable={false}
        ></Column>
        <Column className="w-2/5" field="nome" header="Nome"></Column>
        <Column
          className="w-2/5"
          header="Categoria"
          body={(rowData: Rule) => {
            const categoria = categoriasData.find(
              (categoria: any) => categoria.id === rowData.idCategoria
            );
            return <>{categoria.nome}</>;
          }}
        ></Column>
        <Column
          header="action"
          className="w-[15%]"
          body={actionBodyTemplate}
          exportable={false}
        ></Column>
      </DataTable>
    </>
  );
}
