import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
} from "@/services/userService";
import { Toolbar } from "primereact/toolbar";
import { Role, User, UserDTO } from "@/models/User";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import AdicionaUsuarioDialog from "./components/AdicionaUsuarioDialog";
import EditaUsuarioDialog from "./components/EditaUsuarioDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { toast } from "sonner";

export default function Users() {
  const { session } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState<any>("");

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["usuariosData"],
    queryFn: getUsers,
  });
  let listValues =
    data
      ?.map((usuario: any) => {
        return {
          nome: usuario.nome ?? usuario.email,
          id: usuario.id,
          email: usuario.email,
          // role: Role[usuario.tipo],
          role: usuario.tipo,
          empresas: usuario.empresas,
        };
      })
      .filter((usuario: any) => {
        if (session.user.role === Role.GERENTE && usuario.role === Role.ADMIN) {
          return false;
        }
        return true;
      }) || [];

  async function criarUsuario(usuario: UserDTO) {
    if (usuario.email.trim() && usuario.role) {
      try {
        await createUser(usuario);
        await refetch();
        toast.success("Sucesso", {
          description: "Usuário Adicionado",
        });
      } catch (e: any) {
        toast.error("Erro", {
          description:
            e?.response?.data?.errorMessage || "Erro na Adição do Usuário",
        });
      }
    }
  }

  async function editaUsuario(usuario: User) {
    try {
      await editUser(usuario);
      await refetch();
      toast.success("Sucesso", {
        description: "Usuário Editado",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro na Edição do Usuário",
      });
    }
  }

  const excluirUsuario = async (usuario: User) => {
    try {
      await deleteUser(usuario.id);
      refetch();
      toast.success("Sucesso", {
        description: "Usuário Excluído",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Exclusão",
      });
    } finally {
      setSelectedUsers(null);
    }
  };

  function excluirSelectedUsuarios() {
    try {
      selectedUsers.forEach(
        async (usuario: User) => await deleteUser(usuario.id)
      );
      // bug: refetch deveria funcionar, problema com o forEach de cima que não
      // funciona para loops com await, utilizar Promises.all ou outro método
      // refetch();
      toast.success("Sucesso", {
        description: "Usuários Excluídos",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description: e?.response?.data?.errorMessage,
      });
    } finally {
      setTimeout(() => refetch(), 10);
      setSelectedUsers(null);
    }
  }

  const startToolbar = (
    <div className="flex flex-wrap gap-2">
      <AdicionaUsuarioDialog handleSubmit={criarUsuario} />
      <ConfirmDeleteDialog
        title="Confirmar"
        description={
          <span className="my-2 confirmation-content flex items-center justify-center">
            <i
              className="pi pi-exclamation-triangle mr-3 text-red-600"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Tem certeza que deseja excluir os usuários selecionados?
            </span>
          </span>
        }
        onCancel={() => setSelectedUsers(null)}
        onAction={excluirSelectedUsuarios}
      >
        <Button
          disabled={!selectedUsers || !selectedUsers.length}
          className="bg-red-500 hover:bg-red-700 rounded-sm text-md"
        >
          <i className="pi pi-trash mr-2"></i>
          Excluir
        </Button>
      </ConfirmDeleteDialog>
    </div>
  );

  const endToolbar = (
    <div className="flex flex-wrap gap-2">
      {/* <Button
        label='Exportar CSV'
        icon='pi pi-file-export'
        severity='secondary'
        // onClick={() => exportCSV(false)}
      /> */}
      {/* TODO: Possível adicionar export como PDF com outras bibliotecas */}
    </div>
  );

  const tableHeader = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h4>Usuários</h4>
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
      <EditaUsuarioDialog
        handleSubmit={(usuario: User) => {
          if (
            usuario.email.trim() &&
            usuario.nome.trim() &&
            (usuario.role === Role.ADMIN || usuario.role) &&
            !(
              usuario.email.trim() === rowData?.email &&
              usuario.nome.trim() === rowData?.nome &&
              usuario.role === rowData?.role &&
              (usuario.empresas.filter((e) => rowData?.empresas.includes(e))
                .length === 0 ||
                rowData.empresas.filter((e: any) =>
                  usuario?.empresas.includes(e)
                ).length === 0)
            )
          ) {
            editaUsuario(usuario);
          }
        }}
        selectedUser={rowData}
        variant="icon"
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
              Tem certeza que deseja excluir o usuário <b>{rowData?.nome}</b>?
            </span>
          </span>
        }
        onAction={() => excluirUsuario(rowData)}
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
    <div className="flex-auto flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="px-4 mt-3">
        <Toolbar
          className="mb-4"
          start={startToolbar}
          end={endToolbar}
          style={{ width: "100%" }}
        ></Toolbar>

        <DataTable
          value={listValues}
          selection={selectedUsers}
          onSelectionChange={(e) => setSelectedUsers(e.value)}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} a {last} de {totalRecords} Usuários"
          emptyMessage="Sem Usuários Cadastrados"
          globalFilter={globalFilter}
          header={tableHeader}
          removableSort
          style={{ minWidth: "100%" }}
        >
          <Column
            className="w-[5%]"
            selectionMode="multiple"
            exportable={false}
          ></Column>
          <Column className="w-1/5" field="nome" header="Nome"></Column>
          <Column className="w-1/5" field="email" header="Email"></Column>
          <Column className="w-1/5" field="role" header="Cargo"></Column>
          <Column
            className="w-[15%]"
            body={actionBodyTemplate}
            exportable={false}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
