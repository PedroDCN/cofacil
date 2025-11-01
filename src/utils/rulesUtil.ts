import { Condition } from "./types";

export function generateId() {
  return String(Math.floor(Math.random() * 10000));
}

export const numericCondtList = [
  { value: "equals", label: "Igual a" },
  { value: "notEquals", label: "Diferente de" },
  { value: "greaterThan", label: "Maior que" },
  { value: "lessThan", label: "Menor que" },
  { value: "greaterThanOrEqual", label: "Maior ou igual a" },
  { value: "lessThanOrEqual", label: "Menor ou igual a" },
] as const;

export const stringCondtList = [
  { value: "equals", label: "Igual a" },
  { value: "startsWith", label: "Começa com" },
  { value: "endsWith", label: "Termina com" },
  { value: "contains", label: "Contém" },
  { value: "notContains", label: "Não contém" },
] as const;

export const dateCondtList = [
  { value: "equals", label: "Igual a" },
  { value: "notEquals", label: "Diferente de" },
  { value: "before", label: "Antes de" },
  { value: "after", label: "Depois de" },
] as const;

export const fieldList = [
  { label: "Valor", value: "valor" },
  { label: "Descrição", value: "descricao" },
  { label: "Data", value: "data" },
] as const;

export function genericCondition(): Condition {
  return { id: generateId(), campo: "valor", condicao: "", valor: 0 };
}
