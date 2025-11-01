import { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Steps } from "primereact/steps";
import { Tag } from "primereact/tag";
import { moneyFormatter } from "@/utils/moneyUtil";
import { dateFormatter } from "@/utils/dateUtil";
import api from "@/services/api";
import { Dropdown } from "primereact/dropdown";
import { Button } from "@/components/ui/button";

type Props = {
  visible: boolean;
  onHide: () => void;
  // itensOFX: any
  toast: any;
  empresa: any;
  categorias: any;
  itensOFX: any;
  setItensOFX: any;
  refetchLancamentos: any;
};

export default function AdicionaLancamentoOFXDialog({
  visible,
  onHide,
  toast,
  empresa,
  categorias,
  itensOFX,
  setItensOFX,
  refetchLancamentos,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  // const [itensOFX, setItensOFX] = useState<any>([]);
  const [selectedItensOFX, setSelectedItensOFX] = useState<any>([]);
  const [selectedOFXSubmitted, setSelectedOFXSubmmited] = useState(false);

  const items: any = [
    {
      label: "Filtragem",
    },
    {
      label: "Selecionados",
    },
  ];

  const getTipo = (valor: number) => {
    return valor > 0 ? "CREDITO" : "DEBITO";
  };

  const getSeverity = (tipo: string) => {
    switch (tipo) {
      case "CREDITO":
        return "success";

      case "DEBITO":
        return "danger";
    }
  };

  const priceBodyTemplate = (item: any) => {
    return moneyFormatter(item.valor, "never");
  };

  const dateBodyTemplate = (item: any) => {
    return dateFormatter(item.data);
  };

  const categoriaBodyTemplate = (item: any) => {
    return item.nomeCategoria || "-";
  };

  const tipoBodyTemplate = (rowData: { tipo: string }) => {
    return <Tag value={rowData.tipo} severity={getSeverity(rowData.tipo)} />;
  };

  const tipoImportBodyTemplate = (rowData: any) => {
    const tipo = getTipo(rowData.valor);
    return <Tag value={tipo} severity={getSeverity(tipo)} />;
  };

  const categoryBodyTemplate = (rowData: any) => {
    if (!!rowData.categoria.nome) {
      return <Tag value={rowData.categoria.nome}></Tag>;
    }
    return "";
  };

  const findCategoriaById = (id: any) => {
    return categorias?.find((categoria: any) => categoria.id === id);
  };

  const statusEditor = (options: any) => {
    if (options.rowData?.tipo === "CREDITO") {
      return <></>;
    }
    return (
      <Dropdown
        value={findCategoriaById(options.value?.id)}
        options={categorias}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder='Selecione uma categoria'
        optionLabel='nome'
      />
    );
  };

  const onRowEditCompleteImport = (e: any) => {
    let { data, index, newData, field, originalEvent: event } = e;
    const newItensOFX = [...itensOFX];
    newItensOFX[index] = newData;
    setItensOFX(newItensOFX);
  };

  const footer =
    selectedItensOFX.length > 0
      ? `Foram selecionados ${selectedItensOFX.length} itens.`
      : "";

  async function handleSelectedOFXSubmit() {
    setSelectedOFXSubmmited(true);
    try {
      const dtoList = selectedItensOFX.map((d: any) => {
        let newValues: any = {};
        if (d.categoria.id) {
          newValues["idCategoria"] = d.categoria.id;
        }
        const nd = { ...d, ...newValues };
        return nd;
      });
      const params = [...dtoList];
      await api.post(`/cria-lista-lancamentos/${empresa.id}`, params);
      toast.current?.show({
        severity: "success",
        summary: "Cadastrados",
        detail: "Lançamentos realizados",
        life: 3000,
      });
      refetchLancamentos();
    } catch (e: any) {
      toast.current?.show({
        severity: "error",
        summary: "Não foi possível realizar a importação",
        detail:
          e.errorMessage || "Ocorreu um erro na importação dos lançamentos",
        life: 3000,
      });
    } finally {
      setItensOFX([]);
      setSelectedItensOFX([]);
      setSelectedOFXSubmmited(false);
      onHide();
    }
  }

  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      setSelectedItensOFX([]);
      setSelectedOFXSubmmited(false);
    }
  }, [visible, empresa, categorias, itensOFX]);

  return (
    <>
      <Dialog
        header='Cadastro de Lançamentos via OFX'
        visible={visible}
        style={{ width: "80vw" }}
        onHide={onHide}
      >
        <Steps
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
          readOnly={false}
        />
        <br />
        {activeIndex == 1 ? (
          <>
            <DataTable
              value={selectedItensOFX}
              footer={footer}
              size='small'
              stripedRows
              // paginator
              // rows={100}
              emptyMessage={"Não foram selecionados itens."}
              scrollable
              scrollHeight='30rem'
              dataKey='id'
              tableStyle={{ height: "30rem" }}
            >
              <Column
                key={"tipo"}
                header={"Tipo"}
                body={tipoImportBodyTemplate}
                field={"tipo"}
              />
              <Column
                key={"valor"}
                field={"valor"}
                header={"Valor"}
                body={priceBodyTemplate}
              />
              <Column
                key={"data"}
                field={"data"}
                header={"Data"}
                body={dateBodyTemplate}
              />
              <Column
                key={"descricao"}
                field={"descricao"}
                header={"Descrição"}
              />
              <Column
                key={"categoria"}
                field='categoria'
                header='Categoria'
                body={categoryBodyTemplate}
                style={{ width: "20%" }}
              />
            </DataTable>
            {selectedItensOFX.length > 0 && (
              <div className='flex justify-end mt-4'>
                {/* 
                TODO: criar pequena animação de loading do envio
                loading={selectedOFXSubmitted} */}
                <Button
                  onClick={handleSelectedOFXSubmit}
                  className='bg-green-600 hover:bg-green-700 rounded-sm text-md'
                >
                  <i className='pi pi-check mr-2'></i>Enviar
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <DataTable
              value={itensOFX}
              selection={selectedItensOFX}
              size='small'
              stripedRows
              paginator
              rows={10}
              emptyMessage={"Não foram encontrados dados"}
              onSelectionChange={(e) => setSelectedItensOFX(e.value)}
              dataKey='id'
              tableStyle={{ minWidth: "50rem", height: "20rem" }}
              editMode='row'
              onRowEditComplete={onRowEditCompleteImport}
            >
              <Column
                selectionMode='multiple'
                exportable={false}
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column
                key={"tipo"}
                header={"Tipo"}
                body={tipoBodyTemplate}
                field={"tipo"}
              />
              <Column
                key={"valor"}
                field={"valor"}
                header={"Valor"}
                body={priceBodyTemplate}
              />
              <Column
                key={"data"}
                field={"data"}
                header={"Data"}
                body={dateBodyTemplate}
              />
              <Column
                key={"descricao"}
                field={"descricao"}
                header={"Descrição"}
              />
              <Column
                key={"categoria"}
                field='categoria'
                header='Categoria'
                body={categoryBodyTemplate}
                editor={statusEditor}
                style={{ width: "20%" }}
              />
              <Column
                rowEditor
                headerStyle={{ width: "10%", minWidth: "5rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
            </DataTable>
          </>
        )}
      </Dialog>
    </>
  );
}
