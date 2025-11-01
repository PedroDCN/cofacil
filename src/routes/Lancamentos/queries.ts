import { useApp } from "@/contexts/appContext";
import { getLancamentosRascunhoByEmpresa } from "@/services/lancamentoService";
import { useQuery } from "@tanstack/react-query";

export function useLancamentosRascunhos() {
  const { empresa } = useApp();
  return useQuery({
    queryFn: () => getLancamentosRascunhoByEmpresa(empresa),
    queryKey: ["lancamentosRascunhosData", empresa],
  });
}
