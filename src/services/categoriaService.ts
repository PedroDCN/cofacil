import api from "./api.ts";

export async function getCategorias() {
  return api.get(`/categorias`).then((response) => response.data);
}

export async function getCategoria(id: string) {
  return api.get(`/categoria/${id}`).then((response) => response.data);
}

export async function createCategoria(categoria: any) {
  const params = { ...categoria };
  return api.post(`/categoria`, params).then((response: any) => response.data);
}

export async function deleteCategoria(id: string) {
  return api.delete(`/categoria/${id}`).then((response) => response.data);
}

export async function getCategoriasEntrada() {
  return api.get(`/categorias/entrada`).then((response) => response.data);
}

export async function getCategoriasSaida() {
  return api.get(`/categorias/saida`).then((response) => response.data);
}