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
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Cell,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { moneyFormatter, percentFormatter } from "@/utils/moneyUtil";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Spinner } from "../ui/spinner";
import { addDays } from "date-fns";

type Props = {};

const chartConfig = {
  valor: {
    label: "Ponto de Equilíbrio",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function GraficoPontoDeEquilibrio({}: Props) {
  const { timeContext } = useChartInfo();
  const { empresa, banco } = useApp();
  const {
    isLoading,
    data: chartData,
    error,
  } = useQuery({
    queryKey: ["pontoDeEquilibrioData", timeContext, empresa, banco],
    queryFn: async () => {
      return getGraficoData("/graficos/ponto-de-equilibrio", {
        empresa,
        timeContext,
        banco: banco,
      });
    },
  });

  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  return (
    <>
      <h3 className="w-full text-center font-semibold text-lg">
        Ponto de Equilíbrio (PE)
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px] max-h-[500px] w-full">
          <Spinner />
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[500px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 30, right: 5 }}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return addDays(new Date(value), 1).toLocaleDateString(
                      "pt-BR",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    );
                  }}
                  formatter={(value: ValueType) => (
                    <>Ponto de equilíbrio: {moneyFormatter(value as number)}</>
                  )}
                />
              }
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Bar dataKey="valor">
              {!isSmallScreen && (
                <LabelList
                  dataKey="valor"
                  position="top"
                  fillOpacity={1}
                  fill="var(--color-fill)"
                  offset={10}
                  formatter={(value: number) => moneyFormatter(value)}
                />
              )}
              {chartData?.map((item: any) => (
                <Cell
                  // @ts-ignore
                  style={{ "--color-fill": "#000" }}
                  key={item.data}
                  fill={item.valor > 0 ? "#348850" : "#aa2525"}
                />
              ))}
            </Bar>
            <YAxis
              tickFormatter={(value) => moneyFormatter(value)}
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            />
            <XAxis
              dataKey="data"
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tickFormatter={(value) =>
                addDays(new Date(value), 1).toLocaleDateString("pt-BR").slice(3)
              }
            />
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
}
