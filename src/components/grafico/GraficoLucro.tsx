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
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { moneyFormatter, percentFormatter } from "@/utils/moneyUtil";
import { Spinner } from "../ui/spinner";
import { addDays } from "date-fns";

type Props = {};

const chartConfig = {
  absolute: {
    label: "Lucro",
    color: "#2563eb",
  },
  relativo: {
    label: "Lucro",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function GraficoLucro({}: Props) {
  const { timeContext } = useChartInfo();
  const { empresa, banco } = useApp();
  const {
    isLoading,
    data: chartData,
    error,
  } = useQuery({
    queryKey: ["lucroData", timeContext, empresa, banco],
    queryFn: async () =>
      getGraficoData("/graficos/lucro", {
        empresa,
        timeContext,
        banco: banco,
      }),
  });

  return (
    <>
      <h3 className="w-full text-center font-semibold text-lg">Lucros</h3>
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
                  formatter={(value: ValueType, _, item) => (
                    <>
                      Rendimento Mensal: {moneyFormatter(value as number)} //{" "}
                      {percentFormatter(item.payload.relativo)}
                    </>
                  )}
                />
              }
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Bar dataKey="absolute">
              {/* <LabelList position="top" dataKey="data" fillOpacity={1} /> */}
              <LabelList
                dataKey="absolute"
                position="top"
                fillOpacity={1}
                fill="#000"
                offset={10}
                formatter={(value: number) => moneyFormatter(value)}
              />
              {chartData?.map((item: any) => (
                <Cell
                  key={item.data}
                  fill={item.absolute > 0 ? "#348850" : "#aa2525"}
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
