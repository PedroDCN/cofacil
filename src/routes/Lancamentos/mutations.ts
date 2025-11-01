import { useApp } from "@/contexts/appContext";
import {
  cadastraLancamento,
  cadastrarListaLancamentoRascunho,
  deletaLancamento,
  deletaLancamentosRascunho,
  deleteLancamentos,
  editaLancamento,
} from "@/services/lancamentoService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationDeletaLancamentos() {
  const { empresa } = useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      idEmpresa,
      lancamentosIds,
    }: {
      idEmpresa: string;
      lancamentosIds: string[];
    }) => deleteLancamentos(idEmpresa, lancamentosIds),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["lancamentosData", empresa],
      }),
  });
}

export function useMutationDeletaLancamento() {
  const { empresa } = useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idLancamento }: { idLancamento: string }) =>
      deletaLancamento(idLancamento),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["lancamentosData", empresa],
      }),
  });
}

export function useMutationCriaLancamento() {
  const { empresa } = useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bancoId,
      lancamentoDTO,
    }: {
      bancoId: string;
      lancamentoDTO: any;
    }) => cadastraLancamento(empresa.id, bancoId, lancamentoDTO),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["lancamentosData", empresa],
      }),
  });
}

export function useMutationEditaLancamento() {
  const { empresa } = useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bancoId,
      lancamentoDTO,
    }: {
      bancoId: string;
      lancamentoDTO: any;
    }) => editaLancamento(empresa.id, bancoId, lancamentoDTO),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["lancamentosData", empresa] }),
  });
}

export function useMutationDeletaLancamentosRascunhos() {
  const { empresa } = useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletaLancamentosRascunho,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lancamentosRascunhosData", empresa],
      });
    },
  });
}

export function useMutationCriaLancamentosRascunhos() {
  const { empresa } = useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lancamentos,
      idEmpresa,
      idBanco,
    }: {
      lancamentos: any[];
      idEmpresa: string;
      idBanco: string;
    }) => {
      return cadastrarListaLancamentoRascunho(lancamentos, idEmpresa, idBanco);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lancamentosRascunhosData", empresa],
      });
    },
  });
}
