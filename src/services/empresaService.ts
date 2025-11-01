import { Empresa, EmpresaDTO } from "@/utils/types.ts";
import api from "./api.ts";

const empresa_mock = {
  id: "1",
  nome: "Empresa Mock",
  ramo: "ALIMENTICIO",
  email: "email@email.com",
};

export async function getEmpresas(): Promise<Empresa[]> {
  const values = await api.get("/empresas").then((response) => response.data);
  values?.push(empresa_mock as Empresa);
  return values;
}

export async function getEmpresaById(empresa: Empresa): Promise<Empresa> {
  return api.get(`/empresa/${empresa.id}`);
}

export async function criaEmpresa(empresa: EmpresaDTO) {
  const params = { ...empresa };
  return api.post("/empresa", { ...params }).then((response) => response.data);
}

export async function editaEmpresa(empresa: Empresa) {
  const params = { ...empresa };
  return api.put("/empresa", { ...params }).then((response) => response.data);
}

export async function deletaEmpresa(empresa: Empresa) {
  return api.delete(`/empresa/${empresa.id}`).then((response) => response.data);
}
