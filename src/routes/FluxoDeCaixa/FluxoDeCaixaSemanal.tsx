import { Navigate } from "react-router-dom";
import { useApp } from "../../contexts/appContext";
import FluxoSemanalChart from "../../components/charts/FluxoSemanalChart";

export default function FluxoDeCaixaSemanal(props: any) {
  const { empresa } = useApp();
  if (!empresa) {
    return <Navigate to='/' />;
  }

  return (
    <div className='px-6 py-4'>
      <FluxoSemanalChart
        banco={props.filtro.banco}
        categoria={props.filtro.categorias}
      />
    </div>
  );
}
