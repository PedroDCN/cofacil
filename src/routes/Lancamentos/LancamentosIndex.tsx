import { Navigate } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { toast } from "sonner";
import { getLancamentos } from "@/services/lancamentoService";
import { getCategorias } from "@/services/categoriaService";
import { useQuery } from "@tanstack/react-query";
import { getBancos } from "@/services/bancoService";
import { formatDate } from "@/utils/dateUtil";
import { DataTable } from "./lancamentos-table/data-table";
import { useColumns } from "./lancamentos-table/columns";
import { Spinner } from "@/components/ui/spinner";
import { LancamentoFormSchemaType } from "./schemas";
import {
  useMutationCriaLancamento,
  useMutationDeletaLancamento,
  useMutationDeletaLancamentos,
  useMutationEditaLancamento,
} from "./mutations";

export default function LancamentosIndex() {
  const { empresa } = useApp();

  if (!empresa) {
    return <Navigate to="/" />;
  }

  const {
    isLoading: isLancamentosLoading,
    data: lancamentosList,
    error: isLancamentosError,
  } = useQuery({
    queryKey: ["lancamentosData", empresa],
    queryFn: () => getLancamentos(empresa),
  });

  const {
    isLoading: isCategoriasLoading,
    data: categoriasData,
    error: isCategoriasError,
  } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  const {
    isLoading: isBancosLoading,
    data: bancosData,
    error: isBancosError,
  } = useQuery({
    queryKey: ["bancosEmpresa", empresa],
    queryFn: () => getBancos(empresa),
  });

  const deleteLancamentosMutation = useMutationDeletaLancamentos();
  const criaLancamentoMutation = useMutationCriaLancamento();
  const editaLancamentoMutation = useMutationEditaLancamento();
  const deletaLancamentoMutation = useMutationDeletaLancamento();

  async function deleteLancamento(rowData: any) {
    try {
      await deletaLancamentoMutation.mutateAsync({ idLancamento: rowData?.id });
      toast.success("Sucesso", {
        description: "Lançamento Deletado",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage ||
          "Não foi possível deletar o Lançamento",
      });
    }
  }

  async function editLancamento(rowData: any) {
    try {
      await editaLancamentoMutation.mutateAsync({
        bancoId: rowData?.bancoId,
        lancamentoDTO: {
          ...rowData,
        },
      });
      toast.success("Sucesso", {
        description: "Lançamento Editado",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro na Edição do Lançamento",
      });
    }
  }

  async function handleSubmit(lancamento: LancamentoFormSchemaType) {
    try {
      await criaLancamentoMutation.mutateAsync({
        bancoId: lancamento.bancoId,
        lancamentoDTO: {
          valor: lancamento.valor,
          data: formatDate(lancamento.data),
          descricao: lancamento.descricao,
          comentarios: lancamento.comentarios,
          idCategoria: lancamento.idCategoria,
          tipo: lancamento.tipo,
        },
      });
      toast.success("Sucesso", {
        description: "Lançamento Cadastrado",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro no Cadastro do Lançamento",
      });
    }
  }

  async function handleDelete(lancamentosIds: string[]) {
    try {
      await deleteLancamentosMutation.mutateAsync({
        idEmpresa: empresa?.id,
        lancamentosIds,
      });
      toast.success("Sucesso", {
        description: "Lançamentos Excluídos",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro na Exclusão dos Lançamentos",
      });
    }
  }

  const columns = useColumns(
    deleteLancamento,
    editLancamento,
    categoriasData,
    bancosData
  );

  return (
    <>
      {isLancamentosLoading || isCategoriasLoading || isBancosLoading ? (
        <Spinner />
      ) : isLancamentosError || isCategoriasError || isBancosError ? (
        <div>Error</div>
      ) : (
        <>
          <div className="relative flex-1 flex flex-col gap-4 pb-4">
            <DataTable
              columns={columns}
              data={lancamentosList}
              empresa={empresa}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
            />
          </div>
        </>
      )}
    </>
  );
}
