import { useApp } from "@/contexts/appContext";
import { Navigate } from "react-router-dom";
import PrintPageButton from "@/components/PrintPageButton";
import { cn } from "@/lib/utils";
import DatePickerWithRange from "@/components/date-picker-with-range";
import GraficoFatura from "@/components/grafico/GraficoFatura";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraficoLucro from "@/components/grafico/GraficoLucro";
import GraficoDespesaFatura from "@/components/grafico/GraficoDespesaFatura";
import GraficoPontoDeEquilibrio from "@/components/grafico/GraficoPontoDeEquilibrio";
import GraficoCustos from "@/components/grafico/GraficoCustos";
import GraficoMargemContribuicao from "@/components/grafico/GraficoMargemContribuicao";
import { useState } from "react";

const tabs = [
  { value: "fatura", label: "Fatura", GraficoComponent: GraficoFatura },
  { value: "lucro", label: "Lucros", GraficoComponent: GraficoLucro },
  {
    value: "despesa-fatura",
    label: "Despesas e Vendas",
    GraficoComponent: GraficoDespesaFatura,
  },
  {
    value: "ponto-de-equilibrio",
    label: "Ponto de Equilíbrio",
    GraficoComponent: GraficoPontoDeEquilibrio,
  },
  {
    value: "custo-fixo-var",
    label: "Custo Fixo e variável",
    GraficoComponent: GraficoCustos,
  },
  {
    value: "margem-contribuicao",
    label: "Margem de Contribuição",
    GraficoComponent: GraficoMargemContribuicao,
  },
];

export default function Geral() {
  const { empresa, printMode, setBanco } = useApp();
  const [value, setValue] = useState(tabs?.[0]?.value);

  if (!empresa) {
    return <Navigate to="/selecao" />;
  }

  return (
    <div
      className={cn(
        "flex-auto flex flex-col overflow-x-hidden pb-8",
        printMode ? "overflow-y-hidden max-y-full" : "overflow-y-auto"
      )}
    >
      <div
        className={cn(
          "w-full justify-between flex-wrap gap-4",
          printMode ? "hidden px-4 py-1" : "flex px-4 py-3"
        )}
      >
        <h1 className="text-4xl font-bold">{empresa?.nome}</h1>
        <div className="flex flex-wrap gap-3">
          <DatePickerWithRange />
          {/* <Button
            onClick={() => {
              setBanco(null);
            }}
            className={cn("rounded-sm text-md", printMode ? "hidden" : "")}
            variant="outline"
          >
            Limpar Filtros
          </Button> */}
          <PrintPageButton value={value} />
        </div>
      </div>

      <div className="px-4">
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger value={tab.value} key={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent
              value={tab.value}
              key={tab.value}
              id={`graph-content-${tab.value}`}
            >
              <article
                className={`flex flex-col justify-center items-center gap-3 h-full w-full p-4
        border border-slate-300/80 bg-white`}
              >
                <tab.GraficoComponent />
              </article>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
