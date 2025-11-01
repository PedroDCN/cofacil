import { useQuery } from "@tanstack/react-query";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { getGraficoData } from "@/services/graficoService";
import { useChartInfo } from "@/contexts/chartcontext";
import { useApp } from "@/contexts/appContext";
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { moneyFormatter } from "@/utils/moneyUtil";
import { Spinner } from "../ui/spinner";

type Props = {};

const chartConfig = {
  value: {
    label: "",
    color: "#2563eb",
  },
  label: {
    label: "",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function GraficoDespesaFatura({}: Props) {
  const { timeContext } = useChartInfo();
  const { empresa, banco } = useApp();
  const {
    isLoading,
    data: chartData,
    error,
  } = useQuery({
    queryKey: ["despesaFaturaData", timeContext, empresa, banco],
    queryFn: async () =>
      getGraficoData("/graficos/visao-geral", {
        empresa,
        timeContext,
        banco: banco,
      }),
  });

  const transformedData = [
    {
      value: chartData?.vendas || 0,
      label: "Entrada",
      color: "hsl(340 75% 55%)",
    },
    {
      value: chartData?.despesas || 0,
      label: "Saída",
      color: "hsl(220 70% 50%)",
    },
  ];

  return (
    <>
      <h3 className="w-full text-center font-semibold text-lg">
        Despesas e Vendas
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px] max-h-[500px] w-full">
          <Spinner />
        </div>
      ) : (
        <>
          <h4>Lucro: {moneyFormatter(chartData?.lucro)}</h4>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] max-h-[500px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={transformedData}
              layout="vertical"
            >
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: ValueType) => (
                      <>{moneyFormatter(value as number)} </>
                    )}
                  />
                }
              />
              <YAxis dataKey={"label"} type="category" tickLine={false} />
              <XAxis dataKey={"value"} type="number" hide />
              <Bar dataKey="value">
                <LabelList
                  dataKey="value"
                  position="insideRight"
                  fillOpacity={1}
                  fill="#000"
                  offset={10}
                  formatter={(value: number) => moneyFormatter(value)}
                />
                {transformedData?.map((item: any, index: number) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </>
      )}
    </>
  );
}
