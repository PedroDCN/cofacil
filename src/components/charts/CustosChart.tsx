import ChartContainer from "../ChartContainer";
import { getTransformedChartDataFromAbsolute } from "../../utils/dataUtil";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "../../contexts/chartcontext";
import { getGraficoData } from "../../services/graficoService";
import { useApp } from "../../contexts/appContext";
import { TwoDataChart } from "../genericCharts/TwoDataChart";
import { Spinner } from "../ui/spinner";
import { useMemo } from "react";
import { SettingsIcon } from "lucide-react";

let chartVarData: any, chartFixoData: any;

export default function CustosChart(props: any) {
  const { timeContext } = useChartInfo();
  const { empresa } = useApp();

  const {
    isLoading: fixoIsLoading,
    data: fixoData,
    error: fixoError,
  } = useQuery({
    queryKey: ["custoFixoData", timeContext, empresa, props.banco],
    queryFn: async () =>
      getGraficoData("/graficos/custo-fixo", {
        empresa,
        timeContext,
        banco: props.banco,
      }),
  });
  const {
    isLoading: varIsLoading,
    data: varData,
    error: varError,
  } = useQuery({
    queryKey: ["custoVariavelData", timeContext, empresa, props.banco],
    queryFn: async () =>
      getGraficoData("/graficos/custo-variavel", {
        empresa,
        timeContext,
        banco: props.banco,
      }),
  });

  chartVarData = useMemo(() => {
    return varData ?? (chartVarData || []);
  }, [varData]);

  chartFixoData = useMemo(() => {
    return fixoData ?? (chartFixoData || []);
  }, [fixoData]);

  return (
    <ChartContainer className={props.className}>
      {fixoError || varError ? (
        <>
          <p>
            Erro ao carregar o gráfico:
            <br />
            {/* @ts-ignore  */}
            {fixoError?.message || varError?.message}
          </p>
          <SettingsIcon className='mt-4 w-16 h-16 animate-spin' />
        </>
      ) : (
        <>
          <h3 className='w-full text-center font-semibold text-lg'>
            Custos Fixo e Variável
          </h3>
          <div className='w-[350px] h-[250px] flex justify-center items-center'>
            <TwoDataChart
              label={"Custos"}
              data={[
                getTransformedChartDataFromAbsolute(chartFixoData),
                getTransformedChartDataFromAbsolute(chartVarData),
              ]}
            />
          </div>
          {(fixoIsLoading || varIsLoading) && (
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-slate-800/10 flex items-center justify-center'>
              <Spinner size='large' className='mt-4' />
            </div>
          )}
        </>
      )}
    </ChartContainer>
  );
}
