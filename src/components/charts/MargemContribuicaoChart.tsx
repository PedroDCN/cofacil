import ChartContainer from "../ChartContainer";
import { getTransformedChartDataFromAbsolute } from "../../utils/dataUtil";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "../../contexts/chartcontext";
import { getGraficoData } from "../../services/graficoService";
import { GenericBarChart } from "../genericCharts/GenericBarChart";
import { useApp } from "../../contexts/appContext";
import { Spinner } from "../ui/spinner";
import { useMemo } from "react";
import { SettingsIcon } from "lucide-react";

let chartData: any;

export default function MargemContribuicaoChart(props: any) {
  const { timeContext } = useChartInfo();
  const { empresa } = useApp();

  const { isLoading, data, error } = useQuery({
    queryKey: ["margemContribuicaoData", timeContext, empresa, props.banco],
    queryFn: async () =>
      getGraficoData("/graficos/margem-contribuicao", {
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
            Margem de Contribuição
          </h3>
          <div className='w-[350px] h-[250px] flex justify-center items-center'>
            <GenericBarChart
              label={"Margem de Contribuição"}
              data={getTransformedChartDataFromAbsolute(chartData)}
              type='percentage'
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
