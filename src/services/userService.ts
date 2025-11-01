import api from "./api.ts";

export async function getUsers() {
  return api.get(`/usuarios`).then((response) => response.data);
}

export async function getUser(id: string) {
  return api.get(`/usuario/${id}`).then((response) => response.data);
}

export async function createUser(user: any) {
  const params: any = {
    empresas: user.empresas,
    email: user.email,
    tipo: user.role,
  };
  return api.post(`/usuario`, params).then((response: any) => {
    response.data;
  });
}

export async function editUser(user: any) {
  const params = { ...user, tipo: user.role, role: undefined };
  return api.put(`/usuario`, params).then((response: any) => response.data);
}

export async function deleteUser(id: string) {
  return api.delete(`/usuario/${id}`).then((response) => response.data);
}

export async function verifyUser(email: string) {
  const params = { email };
  return api
    .get(`/usuario-por-email`, { params })
    .then((response) => response.data);
}
