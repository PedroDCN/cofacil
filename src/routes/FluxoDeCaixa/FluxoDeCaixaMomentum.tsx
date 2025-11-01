import { Navigate } from "react-router-dom";
import { useApp } from "../../contexts/appContext";
import FluxoMomentumChart from "../../components/charts/FluxoMomentumChart";

export default function FluxoDeCaixaMomentum(props: any) {
  const { empresa } = useApp();
  if (!empresa) {
    return <Navigate to='/' />;
  }

  return (
    <div className='px-6 py-4'>
      <FluxoMomentumChart
        banco={props.filtro.banco}
        categoria={props.filtro.categorias}
      />
    </div>
  );
}
