import { Navigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/appContext";
import { getFluxoDia } from "@/services/fluxoService";
import { useQuery } from "@tanstack/react-query";
import { moneyFormatter } from "@/utils/moneyUtil";
import { dateFormatter } from "@/utils/dateUtil";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

export default function FluxoDeCaixaDia() {
  const { empresa } = useApp();
  if (!empresa) {
    return <Navigate to='/' />;
  }

  const { idCategoria, dia } = useParams();

  const priceBodyTemplate = (item: { valor: number }) => {
    return moneyFormatter(item.valor);
  };

  const {
    isLoading: isFluxoLoading,
    data: fluxoData,
    isError: isFluxoError,
  } = useQuery({
    queryKey: ["fluxoDiaData"],
    queryFn: () => getFluxoDia(empresa, dia, idCategoria),
  });

  const tipoBodyTemplate = (rowData: { tipo: string }) => {
    return <Tag value={rowData.tipo} severity={getSeverity(rowData.tipo)} />;
  };

  const getSeverity = (tipo: string) => {
    switch (tipo) {
      case "CREDITO":
        return "success";

      case "DEBITO":
        return "danger";
    }
  };

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
                style={{ minWidth: "100%" }}
              >
                <Column
                  key={"tipo"}
                  field={"tipo"}
                  header={"Tipo"}
                  body={tipoBodyTemplate}
                />
                <Column
                  key={"valor"}
                  field={"valor"}
                  header={"Valor"}
                  body={priceBodyTemplate}
                  sortable
                />
                <Column
                  key={"data"}
                  field={"data"}
                  header={"Data"}
                  body={dateBodyTemplate}
                  sortable
                />
                <Column
                  key={"descricao"}
                  field={"descricao"}
                  header={"Descrição"}
                />
              </DataTable>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
