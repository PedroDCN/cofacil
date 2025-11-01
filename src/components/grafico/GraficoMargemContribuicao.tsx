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
import { percentFormatter } from "@/utils/moneyUtil";
import { Spinner } from "../ui/spinner";
import { addDays } from "date-fns";

type Props = {};

const chartConfig = {
  //   absolute: {
  //     label: "Lucro",
  //     color: "#2563eb",
  //   },
  valor: {
    label: "Margem",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function GraficoMargemContribuicao({}: Props) {
  const { timeContext } = useChartInfo();
  const { empresa, banco } = useApp();

  const {
    isLoading,
    data: chartData,
    error,
  } = useQuery({
    queryKey: ["margemContribuicaoData", timeContext, empresa, banco],
    queryFn: async () =>
      getGraficoData("/graficos/margem-contribuicao", {
        empresa,
        timeContext,
        banco: banco,
      }),
  });

  return (
    <>
      <h3 className="w-full text-center font-semibold text-lg">
        Margem de Contribuição
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
            margin={{ top: 20, left: 10, right: 5 }}
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
                    <>Margem: {percentFormatter(value as number)}</>
                  )}
                />
              }
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Bar dataKey="valor">
              <LabelList
                dataKey="valor"
                position="top"
                fillOpacity={1}
                fill="var(--color-fill)"
                offset={10}
                formatter={(value: number) => percentFormatter(value)}
              />
              {chartData?.map((item: any) => (
                <Cell
                  // @ts-ignore
                  // style={{ "--color-fill": item.valor > 0 ? "#000" : "#fff" }}
                  style={{ "--color-fill": "#000" }}
                  key={item.data}
                  fill={item.valor > 0 ? "#348850" : "#aa2525"}
                />
              ))}
            </Bar>
            <YAxis
              tickFormatter={(value) => percentFormatter(value)}
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
