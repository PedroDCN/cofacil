import { Empresa, Relatorio } from "@/utils/types";
import api from "./api";

export function getRelatoriosPorEmpresa(
  empresa: Empresa
): Promise<Relatorio[]> {
  return api
    .get("/relatorios/", {
      params: {
        idEmpresa: empresa.id,
      },
    })
    .then((response) => response.data);
}
