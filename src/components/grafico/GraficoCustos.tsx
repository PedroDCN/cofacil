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
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { moneyFormatter } from "@/utils/moneyUtil";
import { useMemo } from "react";
import { Spinner } from "../ui/spinner";
import { addDays } from "date-fns";

type Props = {};

const chartConfig = {
  fixo: {
    label: "Custo Fixo",
    color: "hsl(220 70% 50%)",
  },
  variavel: {
    label: "Custo Variável",
    color: "hsl(340 75% 55%)",
  },
} satisfies ChartConfig;

export default function GraficoCustos({}: Props) {
  const { timeContext } = useChartInfo();
  const { empresa, banco } = useApp();
  const {
    isLoading: fixoIsLoading,
    data: fixoData,
    error: fixoError,
  } = useQuery({
    queryKey: ["custoFixoData", timeContext, empresa, banco],
    queryFn: async () =>
      getGraficoData("/graficos/custo-fixo", {
        empresa,
        timeContext,
        banco: banco,
      }),
  });
  const {
    isLoading: varIsLoading,
    data: varData,
    error: varError,
  } = useQuery({
    queryKey: ["custoVariavelData", timeContext, empresa, banco],
    queryFn: async () =>
      getGraficoData("/graficos/custo-variavel", {
        empresa,
        timeContext,
        banco: banco,
      }),
  });

  if (varIsLoading || fixoIsLoading) {
    return (
      <>
        <h3 className="w-full text-center font-semibold text-lg">
          Custos Fixo e Variável
        </h3>
        <div className="flex items-center justify-center min-h-[200px] max-h-[500px] w-full">
          <Spinner />
        </div>
      </>
    );
  }

  const chartData = (fixoData as Array<any>)?.map(
    (data: any, index: number) => ({
      ...data,
      fixo: data.valor,
      variavel: varData[index]?.valor,
    })
  );

  return (
    <>
      <h3 className="w-full text-center font-semibold text-lg">
        Custos Fixo e Variável
      </h3>
      {fixoIsLoading || varIsLoading ? (
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
                  className="max-w-[230px]"
                  labelFormatter={(value) => {
                    return addDays(new Date(value), 1).toLocaleDateString(
                      "pt-BR",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    );
                  }}
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {moneyFormatter(value as number)}
                      </div>
                      {index === 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {moneyFormatter(
                              item.payload.fixo + item.payload.variavel
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
              cursor={false}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="data"
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tickFormatter={(value) =>
                addDays(new Date(value), 1).toLocaleDateString("pt-BR").slice(3)
              }
            />
            <YAxis
              tickFormatter={(value) => moneyFormatter(value)}
              tickLine={false}
              axisLine={false}
              tickMargin={5}
            />
            <Bar
              dataKey="fixo"
              fill="var(--color-fixo)"
              // radius={[0, 0, 4, 4]}
              stackId="a"
            >
              <LabelList
                dataKey="fixo"
                position="bottom"
                offset={5}
                fill="#000"
                // className="max-sm:text-[9px]"
                formatter={(value: number) =>
                  value != 0 ? moneyFormatter(value) : ""
                }
              />
            </Bar>
            <Bar
              dataKey="variavel"
              fill="var(--color-variavel)"
              // radius={[4, 4, 0, 0]}
              stackId="a"
            >
              <LabelList
                dataKey="variavel"
                position="top"
                offset={10}
                fill="#000"
                // className="max-sm:text-[9px]"
                formatter={(value: number) =>
                  value != 0 ? moneyFormatter(value) : ""
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
}
