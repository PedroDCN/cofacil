import { Navigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useApp } from "@/contexts/appContext";
import { useQuery } from "@tanstack/react-query";
import {
  criarBanco,
  deletaBanco,
  editarBanco,
  getBancos,
} from "@/services/bancoService";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import AdicionaBancoDialog from "./components/AdicionaBancoDialog";
import EditaBancoDialog from "./components/EditaBancoDialog";
import { toast } from "sonner";

type Banco = {
  id: string;
  nome: string;
  agencia: string;
  conta: string;
};

export default function Bancos() {
  const { empresa } = useApp();

  if (!empresa) {
    return <Navigate to="/" />;
  }

  const {
    isLoading: isBancosLoading,
    data: bancosData,
    error: isBancosError,
    refetch,
  } = useQuery({
    queryKey: ["bancosEmpresa", empresa],
    queryFn: () => getBancos(empresa),
  });

  const [selectedBancos, setSelectedBancos] = useState<any>();
  const [globalFilter, setGlobalFilter] = useState<any>("");
  const dt: any = useRef(null);

  const listBancos = useMemo<Array<Banco>>(
    () =>
      bancosData?.map((banco: Banco) => ({
        ...banco,
        agencia: banco.agencia || "",
        conta: banco.conta || "",
      })) || [],
    [bancosData]
  );

  async function saveBanco(banco: any) {
    if (banco.nome.trim()) {
      try {
        await criarBanco(empresa, banco);
        toast.success("Sucesso", {
          description: "Banco Criado",
        });
        refetch();
      } catch (e: any) {
        toast.error("Erro", {
          description:
            e?.response?.data?.errorMessage ||
            "Não foi possível realizar a criação",
        });
      }
    }
  }

  async function deletarBanco(banco: any) {
    try {
      await deletaBanco(empresa, banco.id);
      refetch();
      toast.success("Sucesso", {
        description: "Banco Excluído",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage ||
          "Não foi possível realizar a exclusão",
      });
    } finally {
      setSelectedBancos(null);
    }
  }

  async function deletarSelectedBancos() {
    try {
      selectedBancos.forEach(
        async (banco: any) => await deletaBanco(empresa, banco.id)
      );

      await refetch();
      toast.success("Sucesso", {
        description: "Bancos Excluídos",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage ||
          "Não foi possível realizar a exclusão",
      });
    } finally {
      refetch();
      setSelectedBancos(null);
    }
  }

  async function editaBanco(banco: any) {
    try {
      await editarBanco(empresa, banco);
      toast.success("Sucesso", {
        description: "Banco Editado",
      });
      await refetch();
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage ||
          "Não foi possível realizar a edição",
      });
    }
  }

  const tableHeader = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h4>Bancos</h4>
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
      <EditaBancoDialog selectedBanco={rowData} handleSubmit={editaBanco} />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir o banco <b>{rowData.nome}</b>?
            </span>
          </span>
        }
        onAction={() => deletarBanco(rowData)}
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
      <AdicionaBancoDialog handleSubmit={saveBanco} />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>Tem certeza que deseja excluir os bancos selecionados?</span>
          </span>
        }
        onAction={deletarSelectedBancos}
      >
        <Button
          disabled={!selectedBancos || !selectedBancos.length}
          className="bg-red-500 hover:bg-red-700 rounded-sm text-md"
        >
          <i className="pi pi-trash mr-2"></i>
          Excluir
        </Button>
      </ConfirmDeleteDialog>
    </div>
  );

  // const endToolbar = (
  //   <React.Fragment>
  //     <Button
  //       label='Exportar'
  //       icon='pi pi-upload'
  //       className='p-button-help'
  //       onClick={exportCSV}
  //     />
  //   </React.Fragment>
  // );

  // function exportCSV() {
  //   dt.current.exportCSV();
  // }

  return (
    <div className="flex-auto flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="px-4 mt-3">
        <div className="min-h-full flex flex-col align-items-center justify-start">
          {isBancosLoading ? (
            <ProgressSpinner />
          ) : isBancosError ? (
            <div>Error</div>
          ) : (
            <>
              <Toolbar
                className="mb-4"
                start={startToolbar}
                // end={endToolbar}
                style={{ width: "100%" }}
              ></Toolbar>
              <DataTable
                ref={dt}
                value={listBancos}
                selection={selectedBancos}
                onSelectionChange={(e) => setSelectedBancos(e.value)}
                // dataKey=""
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} a {last} de {totalRecords} bancos"
                emptyMessage="Sem bancos cadastradas"
                globalFilter={globalFilter}
                header={tableHeader}
                removableSort
                style={{ minWidth: "100%" }}
              >
                <Column selectionMode="multiple" exportable={false}></Column>
                <Column field="nome" header="Nome" className="w-2/5"></Column>
                <Column
                  field="agencia"
                  header="Agência"
                  className="w-1/5"
                  body={(rowData) => <>{rowData.agencia || "sem agência"}</>}
                ></Column>
                <Column
                  field="conta"
                  header="Conta"
                  className="w-1/5"
                  body={(rowData) => <>{rowData.conta || "sem conta"}</>}
                ></Column>
                <Column body={actionBodyTemplate} exportable={false}></Column>
              </DataTable>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
