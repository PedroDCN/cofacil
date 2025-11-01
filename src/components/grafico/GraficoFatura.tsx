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
  XAxis,
  YAxis,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { moneyFormatter } from "@/utils/moneyUtil";
import { Spinner } from "../ui/spinner";
import { dateFormatter } from "@/utils/dateUtil";
import { addDays, setDate } from "date-fns";

type Props = {};

const chartConfig = {
  valor: {
    label: "Fatura",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function GraficoFatura({}: Props) {
  const { timeContext } = useChartInfo();
  const { empresa, banco } = useApp();
  const {
    isLoading,
    data: chartData,
    error,
  } = useQuery({
    queryKey: ["receitaData", { periodo: timeContext, empresa, banco }],
    queryFn: async () =>
      getGraficoData("/graficos/receita", {
        empresa,
        timeContext,
        banco: banco,
      }),
  });

  return (
    <>
      <h3 className="w-full text-center font-semibold text-lg">Faturamentos</h3>
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
                    <>Faturamento: {moneyFormatter(value as number)}</>
                  )}
                />
              }
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="data"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tickFormatter={(value) =>
                addDays(new Date(value), 1).toLocaleDateString("pt-BR").slice(3)
              }
            />
            <YAxis
              tickFormatter={(value) => moneyFormatter(value)}
              tickLine={false}
              axisLine={false}
              tickMargin={15}
            />

            <Bar dataKey="valor" fill="#2563eb">
              <LabelList
                dataKey="valor"
                position="top"
                offset={10}
                fill="#000"
                formatter={(value: number) => moneyFormatter(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
}
