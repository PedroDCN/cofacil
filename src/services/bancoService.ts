import api from "./api.ts";

export async function getBancos(empresa: any) {
  return api.get(`/bancos/${empresa.id}`).then((response) => response.data);
}

export async function getBancoById(empresa: any, banco: any) {
  return api
    .get(`/bancos/${empresa.id}/${banco.id}`)
    .then((response) => response.data);
}

export async function criarBanco(empresa: any, banco: any) {
  const params = {
    nome: banco.nome,
    agencia: banco.agencia,
    conta: banco.conta,
  };
  return api
    .post(`/bancos/${empresa.id}`, { ...params })
    .then((response) => response.data);
}

export async function editarBanco(empresa: any, banco: any) {
  const params = {
    ...banco,
  };
  return api
    .put(`/bancos/${empresa.id}`, { ...params })
    .then((response) => response.data);
}

export async function deletaBanco(empresa: any, banco: any) {
  const params = { idBanco: banco };
  return api
    .delete(`/bancos/${empresa.id}`, { params })
    .then((response) => response.data);
}
