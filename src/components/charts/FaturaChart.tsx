import { ProgressSpinner } from "primereact/progressspinner";
import ChartContainer from "../ChartContainer";
import { getTransformedChartDataFromAbsolute } from "../../utils/dataUtil";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "../../contexts/chartcontext";
import { getGraficoData } from "../../services/graficoService";
import { GenericBarChart } from "../genericCharts/GenericBarChart";
import { useApp } from "../../contexts/appContext";
import { useMemo, useState } from "react";
import { SettingsIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

let chartData: any;

export default function FaturaChart(props: any) {
  const { timeContext } = useChartInfo();
  const { empresa } = useApp();

  const { isLoading, isInitialLoading, data, error } = useQuery({
    queryKey: [
      "receitaData",
      { periodo: timeContext, empresa, banco: props.banco },
    ],
    queryFn: async () =>
      getGraficoData("/graficos/receita", {
        empresa,
        timeContext,
        banco: props.banco,
      }),
  });

  chartData = useMemo(() => {
    return data ?? (chartData || []);
  }, [data]);

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
          <h3 className='w-full text-center font-semibold text-lg'>
            Faturamentos
          </h3>
          <div className='w-[350px] h-[250px] flex justify-center items-center'>
            <GenericBarChart
              label={"Faturamento"}
              data={getTransformedChartDataFromAbsolute(chartData)}
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
