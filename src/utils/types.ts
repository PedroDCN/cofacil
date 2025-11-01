type CategoriaBase = {
  id: string;
  nome: string;
};

export type CategoriaSaida = CategoriaBase & {
  tipo: "CUSTO_FIXO" | "CUSTO_VARIAVEL";
};

export type CategoriaEntrada = CategoriaBase & {
  tipo: "ENTRADA";
};

export type Categoria = CategoriaSaida | CategoriaEntrada;

export type Banco = {
  id: string;
  nome: string;
  empresa: string;
  conta: string;
  agencia: string;
};

export type Lancamento = {
  id: string;
  descricao: string;
  comentarios: string;
  valor: number;
  data: Date;
  tipo: "DEBITO" | "CREDITO";
  nomeCategoria: string;
  nomeEmpresa: string;
  nomeBanco: string;
};

export type LancamentoRascunho = {
  id: string;
  fitid: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: "DEBITO" | "CREDITO";
  idBanco?: string;
  idCategoria?: string;
};

export type Condition = {
  id: string;
  campo: "valor" | "descricao" | "data";
  condicao: string;
  valor: string | number | Date;
};

export type Rule = {
  id: string;
  nome: string;
  conditions: Array<Condition>;
  idCategoria: string;
};

export type RuleDTO = {
  nome: string;
  conditions: Array<Condition>;
  categoria: string;
};

export type Empresa = {
  id: string;
  nome: string;
  ramo: string;
  email: string;
};

export type EmpresaDTO = {
  nome: string;
  ramo: string;
  email: string;
};

export type Relatorio = {
  nome: string;
  data: string;
  url: string;
};
