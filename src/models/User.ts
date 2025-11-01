export enum Role {
  ADMIN = "ADMIN",
  GERENTE = "GERENTE",
  FUNCIONARIO = "FUNCIONARIO",
  CLIENTE = "CLIENTE",
}

export type User = {
  id: string;
  role: Role;
  nome: string;
  email: string;
  image?: string;
  empresas: Array<string>;
};

export type UserDTO = {
  // nome: string;
  email: string;
  role: string;
  // empresas: Array<string>;
};
