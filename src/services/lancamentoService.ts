import { Empresa, LancamentoRascunho } from "@/utils/types.ts";
import api from "./api.ts";

export async function getLancamentos(empresa: any) {
  return api
    .get(`/lancamentosEmpresas/${empresa.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByBanco(empresa: any, banco: any) {
  return api
    .get(`/lancamentosEmpresas/${empresa.id}/${banco.id}`)
    .then((response) => response.data);
}

export async function getLancamentosById(lancamento: any) {
  return api
    .get(`/lancamento/${lancamento.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByCategoria(categoria: any) {
  return api
    .get(`/lancamentosCategoria/${categoria.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByEmpresa(empresa: any) {
  return api
    .get(`/lancamentosEmpresas/${empresa.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByEmpresaCSV(empresa: any) {
  return api
    .get(`/lancamentosEmpresasCSV/${empresa.id}`)
    .then((response) => response.data);
}

export async function deleteLancamentos(
  idEmpresa: string,
  lancamentosIds: string[]
) {
  return api
    .post(`/lancamentos/${idEmpresa}`, lancamentosIds)
    .then((response) => response.data);
}

export async function getLancamentosRascunhoByEmpresa(
  empresa: Empresa
): Promise<LancamentoRascunho[]> {
  return api
    .get(`/lancamentosRascunhoEmpresas/${empresa.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByCategoriaEmpresa(
  empresa: any,
  categoria: any
) {
  return api
    .get(`/lancamentos/${empresa.id}/${categoria.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByEmpresaBanco(empresa: any, banco: any) {
  return api
    .get(`/lancamentosEmpresas/${empresa.id}/${banco.id}`)
    .then((response) => response.data);
}

export async function getLancamentosByCategoriaEmpresaBanco(
  empresa: any,
  banco: any,
  categoria: any
) {
  return api
    .get(`/lancamentos/${empresa.id}/${banco.id}/${categoria.id}`)
    .then((response) => response.data);
}

export async function cadastraLancamento(
  idEmpresa: string,
  idBanco: string,
  lancamentoDTO: any
) {
  const params = { ...lancamentoDTO };
  return api
    .post(`/lancamento/${idEmpresa}/${idBanco}`, params)
    .then((response) => response.data);
}

export async function editaLancamento(
  idEmpresa: any,
  idBanco: any,
  lancamentoDTO: any
) {
  const params = { ...lancamentoDTO };
  return api
    .put(`/lancamento/${idEmpresa}/${idBanco}/${lancamentoDTO.id}`, params)
    .then((response) => response.data);
}

export async function editaLancamentoRascunho(
  empresa: any,
  bancoId: any,
  lancamento: any
) {
  const params = { ...lancamento };
  return api
    .put(
      `/lancamento-rascunho/${empresa.id}/${bancoId}/${lancamento.id}`,
      params
    )
    .then((response) => response.data);
}

export async function deletaLancamento(idLancamento: any) {
  return api
    .delete(`/lancamento/${idLancamento}`)
    .then((response) => response.data);
}
export async function deletaLancamentosRascunho(
  lancamentosIdRascunho: string[]
) {
  return api
    .post(`/deleta-lista-lancamentos-rascunhos`, lancamentosIdRascunho)
    .then((response) => response.data);
}

export async function cadastrarListaLancamentoRascunho(
  lancamentos: LancamentoRascunho[],
  idEmpresa: string,
  idBanco: string
) {
  return api
    .post(
      `/cria-lista-lancamentos-rascunhos/${idEmpresa}/${idBanco}`,
      lancamentos
    )
    .then((response) => response.data);
}

export async function getRules() {
  return api.get(`/regras/`).then((response) => response.data);
}

export async function getRuleById(ruleId: string) {}

export async function cadastraRule(ruleDTO: any) {
  const params = { ...ruleDTO };
  return api.post(`/regras/`, params).then((response) => response.data);
}

export async function editaRule(rule: any) {
  const params = { ...rule };
  return api.put(`/regras`, params).then((response) => response.data);
}

export async function deleteRule(ruleId: any) {
  const params = { idRegra: ruleId };
  return api.delete(`/regras/`, { params }).then((response) => response.data);
}

export async function enviaRegrasAplicar(
  lancamentos: any,
  ruleIds: any,
  signal: any
) {
  const params = {
    lancamentoDTOList: [...lancamentos],
    idsRegras: [...ruleIds],
  };
  return api
    .post(`/aplicaRegras/`, params, {
      signal,
    })
    .then((response) => response.data);
}
