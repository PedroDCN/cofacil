import api from "./api.ts";
import { formatDate } from "../utils/dateUtil.ts";

export async function getGraficoData(
  endpoint: string,
  {
    empresa,
    timeContext: periodicity,
    banco,
  }: {
    empresa: any;
    timeContext: any;
    banco?: any;
  }
) {
  if (!periodicity?.from || !periodicity?.to) {
    throw new Error("Período não definido");
  }

  const params = {
    from: formatDate(periodicity.from),
    to: formatDate(periodicity.to),
  };
  const filterByBanco = banco ? `/${banco.id}` : "";
  return api
    .get(`${endpoint}/${empresa.id}${filterByBanco}`, { params })
    .then((response) => response.data);
}
