import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { moneyFormatter } from "@/utils/moneyUtil";
import { useQuery } from "@tanstack/react-query";
import { getFluxoMes } from "@/services/fluxoService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { dateFormatter } from "@/utils/dateUtil";

export default function FluxoDeCaixaMes() {
  const { empresa } = useApp();
  if (!empresa) {
    return <Navigate to='/' />;
  }

  const navigate = useNavigate();
  const { idCategoria, mes } = useParams();

  const onRowSelectToDia = (row: any) => {
    navigate(`/fluxo-de-caixa/${idCategoria}/${mes}/${row.data.data}`);
  };

  const priceBodyTemplate = (item: { valor: number }) => {
    return moneyFormatter(item.valor);
  };

  const {
    isLoading: isFluxoLoading,
    data: fluxoData,
    isError: isFluxoError,
  } = useQuery({
    queryKey: ["fluxoMesData"],
    queryFn: () => getFluxoMes(empresa, mes, idCategoria),
  });

  const dateBodyTemplate = (item: { data: string }) => {
    return dateFormatter(item.data);
  };

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
                value={fluxoData}
                tableStyle={{ minHeight: "27rem" }}
                emptyMessage={"Não foram encontrados dados"}
                removableSort
                size='small'
                paginator
                rows={10}
                dataKey='data'
                selectionMode='single'
                onRowSelect={onRowSelectToDia}
                style={{ minWidth: "100%" }}
              >
                <Column headerStyle={{ width: "3rem" }}></Column>
                <Column
                  key={"data"}
                  field={"data"}
                  header={"Data"}
                  body={dateBodyTemplate}
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
