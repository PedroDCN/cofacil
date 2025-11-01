import { getRelatoriosPorEmpresa } from "@/services/relatorioService";
import { Empresa } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useRelatoriosRascunhos(empresa: Empresa) {
  return useQuery({
    queryFn: () => getRelatoriosPorEmpresa(empresa),
    queryKey: ["relatoriosEmpresaData", empresa],
  });
}
