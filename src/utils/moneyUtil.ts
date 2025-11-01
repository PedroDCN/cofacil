export function moneyFormatter(
  value: number,
  sigh?: "auto" | "never" | "always" | "exceptZero" | undefined
) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    signDisplay: sigh,
  }).format(value);
}

export function percentFormatter(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
