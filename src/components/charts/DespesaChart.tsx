import ChartContainer from "@/components/ChartContainer";
import { getTransformedChartDataFromAbsolute } from "@/utils/dataUtil";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "@/contexts/chartcontext";
import { getGraficoData } from "@/services/graficoService";
import { PieChart } from "@/components/genericCharts/PieChart";
import { useApp } from "@/contexts/appContext";
import { useMemo } from "react";
import { Spinner } from "../ui/spinner";
import { SettingsIcon } from "lucide-react";

let chartData: any;

export default function DespesaChart(props: any) {
  const { timeContext } = useChartInfo();
  const { empresa } = useApp();

  const { isLoading, data, error } = useQuery({
    queryKey: ["despesasData", timeContext, empresa, props.banco],
    queryFn: async () =>
      getGraficoData("/graficos/despesa", {
        empresa,
        timeContext,
        banco: props.banco,
      }),
  });

  chartData = useMemo(
    () =>
      data
        ? data?.sort((a: any, b: any) => b.valor - a.valor)
        : chartData || [],
    [data]
  );

  return (
    <ChartContainer className={props.className}>
      {error ? (
        <>
          <p>
            Erro ao carregar o gráfico:
            <br />
            {/* @ts-ignore  */}
            {error?.message}
          </p>
          <SettingsIcon className='mt-4 w-16 h-16 animate-spin' />
        </>
      ) : (
        <>
          <h3 className='w-full text-center font-semibold text-lg'>Despesas</h3>
          <div className='w-[350px] h-[250px] flex justify-center items-center'>
            <PieChart
              label={"Despesa"}
              data={getTransformedChartDataFromAbsolute(chartData)}
              // data={getTransformedChartDataFromAbsolute(data)}
              dispatchCallback={props.dispatchCallback}
            />
          </div>
          {isLoading && (
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-slate-800/10 flex items-center justify-center'>
              <Spinner size='large' className='mt-4' />
            </div>
          )}
        </>
      )}
    </ChartContainer>
  );
}
