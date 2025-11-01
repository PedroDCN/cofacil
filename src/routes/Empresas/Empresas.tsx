import { useState, useMemo } from "react";
import {
  criaEmpresa,
  deletaEmpresa,
  editaEmpresa,
  getEmpresas,
} from "@/services/empresaService";
import { useQuery } from "@tanstack/react-query";
import { Toolbar } from "primereact/toolbar";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import AdicionaEmpresaDialog from "./components/AdicionaEmpresaDialog";
import EditaEmpresaDialog from "./components/EditaEmpresaDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { toast } from "sonner";
import { Empresa, EmpresaDTO } from "@/utils/types";

const ramoFieldOptions = [{ label: "Alimentício", value: "ALIMENTICIO" }];

function getRamo(ramo: string) {
  return ramoFieldOptions.find((ramoField) => ramoField.value === ramo)?.label;
}

export default function Empresas() {
  const [selectedEmpresas, setSelectedEmpresas] = useState<any>();
  const [globalFilter, setGlobalFilter] = useState<any>("");

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["empresasData"],
    queryFn: getEmpresas,
  });

  const listValues = useMemo(
    () =>
      data?.map((empresa: any) => {
        return {
          nome: empresa.nome,
          id: empresa.id,
          ramo: empresa.ramo || "",
        };
      }) || [],
    data as any
  );

  async function criarEmpresa(empresa: EmpresaDTO) {
    if (empresa.nome.trim()) {
      try {
        await criaEmpresa(empresa);
        refetch();
        toast.success("Sucesso", {
          description: "Empresa Criada",
        });
      } catch (e: any) {
        toast.error("Erro", {
          description:
            e?.response?.data?.errorMessage || "Erro na adição de empresa",
        });
      }
    }
  }

  // async function editaEmpresa(empresa: Empresa) {
  //   if (
  //     empresa.nome.trim() &&
  //     !(empresa.nome.trim() === selectedEmpresa?.nome)
  //   ) {
  //     try {
  //       await editEmpresa(empresa);
  //       refetch();
  //       toast({
  //         title: "Sucesso",
  //         description: "Empresa Editada",
  //         duration: 3000,
  //       });
  //     } catch (e: any) {
  //       toast({
  //         title: "Erro",
  //         variant: "destructive",
  //         description: e?.errorMessage || "Erro na edição da empresa",
  //         duration: 3000,
  //       });
  //     }
  //   } else if (empresa.nome.trim() === selectedEmpresa?.nome) {
  //   }
  // }

  const excluirEmpresa = async (empresa: Empresa) => {
    try {
      await deletaEmpresa(empresa);
      refetch();
      toast.success("Sucesso", {
        description: "Empresa Excluída",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Exclusão",
      });
    } finally {
      setSelectedEmpresas(null);
    }
  };

  function excluirSelectedEmpresas() {
    try {
      selectedEmpresas.forEach(
        async (empresa: Empresa) => await deletaEmpresa(empresa)
      );
      // bug: refetch deveria funcionar, problema com o forEach de cima que não
      // funciona para loops com await, utilizar Promises.all ou outro método
      // refetch();
      toast.success("Sucesso", {
        description: "Empresas Excluídas",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description: e?.response?.data?.errorMessage,
      });
    } finally {
      setTimeout(() => refetch(), 10);
      setSelectedEmpresas(null);
    }
  }

  async function editarEmpresa(empresa: any) {
    try {
      await editaEmpresa(empresa);
      await refetch();
      toast.success("Sucesso", {
        description: "Empresa Editada",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro na edição da empresa",
      });
    }
  }

  const tableHeader = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h4>Empresas</h4>
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

  const actionBodyTemplate = (rowData: any) => (
    <>
      <EditaEmpresaDialog
        handleSubmit={editarEmpresa}
        selectedEmpresa={rowData}
      />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir a empresa <b>{rowData?.nome}</b>?
            </span>
          </span>
        }
        onAction={() => excluirEmpresa(rowData)}
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

  const startToolbar = (
    <div className="flex flex-wrap gap-2">
      <AdicionaEmpresaDialog handleSubmit={criarEmpresa} />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir as empresas selecionadas?
            </span>
          </span>
        }
        onCancel={() => setSelectedEmpresas(null)}
        onAction={excluirSelectedEmpresas}
      >
        <Button
          disabled={!selectedEmpresas || !selectedEmpresas.length}
          className="bg-red-500 hover:bg-red-700 rounded-sm text-md"
        >
          <i className="pi pi-trash mr-2"></i>
          Excluir
        </Button>
      </ConfirmDeleteDialog>
    </div>
  );

  return (
    <div className="flex-auto flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="px-4 mt-3">
        <Toolbar
          className="mb-4"
          start={startToolbar}
          style={{ width: "100%" }}
        ></Toolbar>

        <DataTable
          value={listValues}
          selection={selectedEmpresas}
          onSelectionChange={(e) => setSelectedEmpresas(e.value)}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} a {last} de {totalRecords} Empresas"
          emptyMessage="Sem empresas cadastradas"
          globalFilter={globalFilter}
          header={tableHeader}
          removableSort
          style={{ minWidth: "100%" }}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="nome" header="Nome" className="w-2/5"></Column>
          <Column
            field="ramo"
            header="Ramo"
            className="w-2/5"
            body={(rowData) => <>{getRamo(rowData?.ramo) || "sem ramo"}</>}
          ></Column>
          <Column field="email" header="Email" className="w-1/5"></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
    </div>
  );
}
