type DataListAbsolute = { data: string; valor: number }[] | any;
type DataListRelative =
  | { data: string; absolute: number; relativo: number }[]
  | any;
export type FluxoSemanalData = {
  data: string;
  valor1: number;
  valor2: number;
}[];
export type FluxoMomentumData = {
  data: string;
  valor1: number;
  valor2: number;
}[];

export function getTransformedFluxoSemanalChartData(data: FluxoSemanalData) {
  let datas: string[] = [],
    creditos: number[] = [],
    debitos: number[] = [];
  data.forEach((value: any) => {
    datas.push(value.data);
    creditos.push(value.valor1);
    debitos.push(-value.valor2);
  });
  return { datas, creditos, debitos };
}

export function getTransformedFluxoMomentumChartData(data: FluxoSemanalData) {
  let datas: string[] = [],
    creditos: number[] = [],
    debitos: number[] = [];
  data.forEach((value: any) => {
    datas.push(value.data);
    creditos.push(value.valor1);
    debitos.push(value.valor2);
  });
  return { datas, creditos, debitos };
}

export function getTransformedChartDataFromPercentages(data: DataListRelative) {
  let labels: string[] = [],
    values: number[][] = [];
  data.forEach((value: any) => {
    labels.push(value.data);
    values.push([value.absolute, value.relativo]);
  });
  return { labels, values };
}

export function getTransformedChartDataFromAbsolute(data: DataListAbsolute) {
  let labels: string[] = [],
    values: number[] = [];
  data.forEach((value: any) => {
    labels.push(value.data);
    values.push(value.valor);
  });
  return { labels, values };
}

export function downloadCSV(csvContent: string, filename: string = "data") {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
