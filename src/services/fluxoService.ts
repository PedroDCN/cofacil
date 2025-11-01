import { FluxoSemanalData } from "../utils/dataUtil.ts";
import { FluxoMomentumData } from "../utils/dataUtil.ts";
import { formatDate } from "../utils/dateUtil.ts";
import api from "./api.ts";

export async function getFluxoGeral(empresa: any, periodicity: any) {
  const params = {
    from: formatDate(periodicity.from),
    to: formatDate(periodicity.to),
  };
  return api
    .get(`/fluxo-de-caixa/${empresa.id}/geral/`, { params })
    .then((response) => response.data);
}

export async function getFluxoCategoriaPeriodo(
  empresa: any,
  periodicity: any,
  categoria: any
) {
  const params = {
    from: formatDate(periodicity.from),
    to: formatDate(periodicity.to),
    idCategoria: categoria,
  };
  return api
    .get(`/fluxo-de-caixa/${empresa.id}/periodo/`, { params })
    .then((response) => response.data);
}

export async function getFluxoMes(empresa: any, data: any, categoria: any) {
  const params: any = { idCategoria: categoria };
  return api
    .get(`fluxo-de-caixa/${empresa.id}/mes/${data}`, { params })
    .then((response) => response.data);
}

export async function getFluxoSemanal(
  empresa: any,
  banco: any,
  from: string,
  to: string,
  listIdCategoria: string[]
) {
  const data: any = listIdCategoria;

  return api
    .post<FluxoSemanalData>(
      `fluxo-de-caixa/${empresa.id}/${banco.id}/semanal/`,
      data,
      {
        params: { from, to, idEmpresa: empresa.id, idBanco: banco.id },
      }
    )
    .then((response) => response.data);
}

export async function getFluxoMomentum(
  empresa: any,
  banco: any,
  from: string,
  to: string,
  listIdCategoria: string[]
) {
  const data: any = listIdCategoria;

  return api
    .post<FluxoMomentumData>(
      `fluxo-de-caixa/${empresa.id}/${banco.id}/momentum/`,
      data,
      {
        params: { from, to, idEmpresa: empresa.id, idBanco: banco.id },
      }
    )
    .then((response) => response.data);
}

export async function getFluxoDia(empresa: any, dia: any, categoria: any) {
  const params: any = { idCategoria: categoria };
  return api
    .get(`fluxo-de-caixa/${empresa.id}/dia/${dia}`, { params })
    .then((response) => response.data);
}
