import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { useQuery } from "@tanstack/react-query";
import { getFluxoCategoriaPeriodo } from "@/services/fluxoService";
import { useChartInfo } from "@/contexts/chartcontext";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { moneyFormatter } from "@/utils/moneyUtil";

export default function FluxoDeCaixaCategoria() {
  const { empresa } = useApp();
  if (!empresa) {
    return <Navigate to='/' />;
  }

  const navigate = useNavigate();
  const { timeContext } = useChartInfo();
  const { idCategoria } = useParams();

  const onRowSelectToMes = (row: any) => {
    navigate(`/fluxo-de-caixa/${idCategoria}/${row.data.data}-01`);
  };

  const priceBodyTemplate = (item: { valor: number }) => {
    return moneyFormatter(item.valor);
  };

  const {
    isLoading: isFluxoLoading,
    data: fluxoData,
    isError: isFluxoError,
  } = useQuery({
    queryKey: ["fluxoCategoriaData"],
    queryFn: () => {
      const res = getFluxoCategoriaPeriodo(empresa, timeContext, idCategoria);
      return res;
    },
  });

  let newData: { data: string; valor: number }[] = [];

  if (fluxoData) {
    for (let i = 0; i < fluxoData.length; i++) {
      const d = fluxoData[i].data.substr(0, 7);
      const v = fluxoData[i].valor;
      const fd = newData.findIndex((nd: any) => nd.data === d);
      if (fd !== -1) {
        newData[fd].valor += v;
      } else {
        newData.push({ data: d, valor: v });
      }
    }
  }

  return (
    <div className='flex-auto flex flex-col overflow-y-scroll overflow-x-hidden'>
      <div className='px-4 mt-3'>
        <div className='min-h-full flex flex-col items-center justify-start'>
          {isFluxoLoading ? (
            <ProgressSpinner />
          ) : isFluxoError ? (
            <div>Error</div>
          ) : (
            <>
              <DataTable
                value={newData}
                tableStyle={{ minHeight: "27rem" }}
                emptyMessage={"Não foram encontrados dados"}
                removableSort
                size='small'
                paginator
                rows={10}
                dataKey='data'
                selectionMode='single'
                onRowSelect={onRowSelectToMes}
                style={{ minWidth: "100%" }}
              >
                <Column headerStyle={{ width: "3rem" }}></Column>
                <Column
                  key={"data"}
                  field={"data"}
                  header={"Data"}
                  // body={dateBodyTemplateWithoutDay}
                  sortable
                />
                <Column
                  key={"valor"}
                  field={"valor"}
                  header={"Valor"}
                  body={priceBodyTemplate}
                  sortable
                />
              </DataTable>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
