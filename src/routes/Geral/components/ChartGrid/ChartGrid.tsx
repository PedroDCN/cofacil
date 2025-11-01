import CustosChart from "@/components/charts/CustosChart";
import DespesaChart from "@/components/charts/DespesaChart";
import DespesaFaturaChart from "@/components/charts/DespesaFaturaChart";
import FaturaChart from "@/components/charts/FaturaChart";
import LucroChart from "@/components/charts/LucroChart";
import MargemContribuicaoChart from "@/components/charts/MargemContribuicaoChart";
import PontoDeEquilibrioChart from "@/components/charts/PontoDeEquilibrioChart";
import { useApp } from "@/contexts/appContext";
import LancamentosBancoChart from "@/components/charts/LancamentosBancoChart";
import { useQuery } from "@tanstack/react-query";
import { getBancos } from "@/services/bancoService";
import { cn } from "@/lib/utils";

export default function ChartGrid() {
  const { printMode, empresa, banco, setBanco, sidebarVisible } = useApp();
  const {
    isLoading: isBancosLoading,
    data: bancosData,
    error: isBancosError,
  } = useQuery({
    queryKey: ["bancosEmpresa", empresa],
    queryFn: () => getBancos(empresa),
  });

  return (
    <div
      id='chart-grid'
      className={cn(
        "grid gap-2",
        printMode ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        sidebarVisible && "md:grid-cols-1"
      )}
    >
      <FaturaChart banco={banco} />
      <LucroChart banco={banco} />
      <DespesaFaturaChart banco={banco} />
      <PontoDeEquilibrioChart banco={banco} />
      <DespesaChart banco={banco} />
      <MargemContribuicaoChart banco={banco} />
      <CustosChart banco={banco} />
      <LancamentosBancoChart
        dispatchCallback={(labelBanco: any) => {
          setBanco(bancosData?.find((banco: any) => banco.nome === labelBanco));
        }}
      />
    </div>
  );
}
