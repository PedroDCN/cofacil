import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { getFluxoGeral } from "@/services/fluxoService";
import { ProgressSpinner } from "primereact/progressspinner";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "@/contexts/chartcontext";
import PeriodSelector from "@/components/PeriodSelector";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import DespesaChart from "../../components/charts/DespesaChart";
import FluxoDeCaixaSemanal from "./FluxoDeCaixaSemanal";
import FluxoDeCaixaMomentum from "./FluxoDeCaixaMomentum";
import { getBancos } from "../../services/bancoService";
import { getCategorias } from "../../services/categoriaService";
import DatePickerWithRange from "@/components/date-picker-with-range";

export default function FluxoDeCaixa() {
  const { empresa } = useApp();

  const { data: categoriasData } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  if (!empresa) {
    return <Navigate to='/' />;
  }

  const listaVazia: string[] = [];

  const filtroVazio = {
    banco: null,
    categorias: listaVazia,
  };

  const [filtro, setFiltro] = useState(filtroVazio);

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _filtro: any = { ...filtro };
    if (name === "categoria") {
      _filtro[`idCategoria`] = val.id;
    } else {
      _filtro[`${name}`] = val;
    }
    setFiltro(_filtro);
  };

  const { data: bancosData } = useQuery({
    queryKey: ["bancosEmpresa", empresa],
    queryFn: () => getBancos(empresa),
  });

  const findBancoById = (bancoId: any) => {
    return bancosData?.find((banco: any) => banco.id === bancoId?.id);
  };

  return (
    <div className='flex-auto flex flex-col overflow-y-auto overflow-x-hidden'>
      <div className='flex gap-3 px-4 mt-3'>
        <DatePickerWithRange />
        <Dropdown
          value={findBancoById(filtro.banco)}
          onChange={(e) => onInputChange(e, "banco")}
          options={bancosData}
          optionLabel='nome'
          placeholder='selecione um banco'
        />
      </div>
      <div className='px-4 mt-3'>
        <div className='min-h-full flex flex-col items-center justify-start'>
          <div className='flex gap-3 px-4 mt-3'>
            <FluxoDeCaixaSemanal filtro={filtro} />
          </div>
          <div className='flex gap-3 px-4 mt-3'>
            <FluxoDeCaixaMomentum filtro={filtro} />
          </div>
          <DespesaChart
            banco={filtro.banco}
            dispatchCallback={(labelCategoria: any) => {
              setFiltro({
                banco: filtro.banco,
                categorias: [
                  (categoriasData?.find(
                    (categoria: any) => categoria.nome === labelCategoria
                  )).id,
                ],
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
