import { Navigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useApp } from "@/contexts/appContext";
import { useQuery } from "@tanstack/react-query";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
} from "@/services/categoriaService";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputText } from "primereact/inputtext";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import AdicionaCategoriaDialog from "./components/AdicionaCategoriaDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Categorias(props: any) {
  const { empresa } = useApp();

  if (!empresa) {
    return <Navigate to="/" />;
  }

  const {
    isLoading: isCategoriasLoading,
    data: categoriasData,
    error: isCategoriasError,
    refetch,
  } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  const [selectedCategorias, setSelectedCategorias] = useState<any>();
  const [globalFilter, setGlobalFilter] = useState<any>("");
  const [tipoFilter, setTipoFilter] = useState("todas");
  const dt: any = useRef(null);

  const listCategorias = categoriasData?.filter((categoria: any) => {
    if (tipoFilter === "todas") return true;
    if (tipoFilter === "entrada") return categoria.tipo === "ENTRADA";
    return (
      categoria.tipo === "CUSTO_FIXO" || categoria.tipo === "CUSTO_VARIAVEL"
    );
  });

  async function saveCategoria(categoria: any) {
    if (categoria.nome.trim()) {
      try {
        await createCategoria({
          nome: categoria.nome,
          tipo: categoria.tipo,
        });
        toast.success("Sucesso", {
          description: "Categoria Criada",
        });
        refetch();
      } catch (e: any) {
        toast.error("Erro", {
          description: e?.response?.data?.errorMessage,
        });
      }
    }
  }

  async function deletarCategoria(categoria: any) {
    try {
      await deleteCategoria(categoria.id);
      refetch();
      toast.success("Sucesso", {
        description: "Categoria Excluída",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description: e?.response?.data?.errorMessage,
      });
    } finally {
      setSelectedCategorias(null);
    }
  }

  function deletarSelectedCategorias() {
    try {
      selectedCategorias.forEach(
        async (categoria: any) => await deleteCategoria(categoria.id)
      );
      refetch();
      toast.success("Sucesso", {
        description: "Categorias Excluídas",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description: e?.response?.data?.errorMessage,
      });
    } finally {
      refetch();
      setSelectedCategorias(null);
    }
  }

  const options = [
    {
      label: "Todas",
      value: "todas",
    },
    {
      label: "Entrada",
      value: "entrada",
    },
    {
      label: "Saída",
      value: "saida",
    },
  ];

  const tableHeader = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <div className="shrink-0 flex items-center gap-6">
        <h4>Categorias</h4>
        <Select
          onValueChange={(value) => {
            setTipoFilter(value);
          }}
          defaultValue={options[0].value}
        >
          <SelectTrigger className="w-[130px] font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options &&
              options.map((opcao: any) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

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
      {/* <Button
        icon='pi pi-pencil'
        rounded
        outlined
        className='mr-2'
        onClick={() => editCategoria(rowData)}
      /> */}
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir a categoria <b>{rowData.nome}</b>?
            </span>
          </span>
        }
        onCancel={() => setSelectedCategorias(null)}
        onAction={() => deletarCategoria(rowData)}
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
      <AdicionaCategoriaDialog handleSubmit={saveCategoria} />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir as categorias selecionadas?
            </span>
          </span>
        }
        onCancel={() => setSelectedCategorias(null)}
        onAction={deletarSelectedCategorias}
      >
        <Button
          disabled={!selectedCategorias || !selectedCategorias.length}
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
        <div className="min-h-full flex flex-col items-center justify-start">
          {isCategoriasLoading ? (
            <ProgressSpinner />
          ) : isCategoriasError ? (
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
                value={listCategorias}
                selection={selectedCategorias}
                onSelectionChange={(e) => setSelectedCategorias(e.value)}
                // dataKey=""
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} a {last} de {totalRecords} categorias"
                emptyMessage="Sem categorias cadastradas"
                globalFilter={globalFilter}
                header={tableHeader}
                removableSort
                style={{ minWidth: "100%" }}
              >
                <Column selectionMode="multiple" exportable={false}></Column>
                <Column
                  field="nome"
                  header="Nome"
                  // style={{ width: "50%" }}
                ></Column>
                <Column
                  field="tipo"
                  header="Tipo da Categoria"
                  // style={{ width: "50%" }}
                  sortable
                ></Column>
                <Column
                  body={actionBodyTemplate}
                  exportable={false}
                  // style={{ minWidth: "12rem" }}
                ></Column>
              </DataTable>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
