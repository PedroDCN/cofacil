import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/contexts/appContext";
import { getCategorias } from "@/services/categoriaService";
import { moneyFormatter } from "@/utils/moneyUtil";
import { dateFormatter } from "@/utils/dateUtil";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LoaderIcon,
  PenIcon,
  XIcon,
} from "lucide-react";
import {
  useMutationCriaLancamentosRascunhos,
  useMutationDeletaLancamentosRascunhos,
} from "../mutations";
import { LancamentoRascunho } from "@/utils/types";
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EditTable } from "../components/edit-table";
import { Spinner } from "@/components/ui/spinner";
import { useLancamentosRascunhos } from "../queries";
import api from "@/services/api";

function EditableCategoriaCell({
  getValue,
  row,
  column,
  table,
}: CellContext<LancamentoRascunho, string>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  if (true) {
    return (
      <Select
        onValueChange={(value) => {
          setValue(value);
          // @ts-expect-error
          table.options.meta?.updateData(row.index, column.id, value);
          table.setPageIndex(table.getState().pagination.pageIndex);
        }}
        defaultValue={value as string}
      >
        <SelectTrigger className="w-[200px] font-semibold">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {/* @ts-expect-error */}
          {table.options.meta?.categorias &&
            // @ts-expect-error
            table.options.meta?.categorias.map((categoria: any) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    );
  }
}

function EditableComentarioCell({
  getValue,
  row,
  column,
  table,
}: CellContext<LancamentoRascunho, string>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      (inputRef.current as HTMLTextAreaElement).focus();
    }
  }, [isEditing]);

  const onBlur = () => {
    // @ts-expect-error
    table.options.meta?.updateData(row.index, column.id, value);
    setIsEditing(false);
    table.setPageIndex(table.getState().pagination.pageIndex);
  };

  if (isEditing) {
    return (
      <Textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="resize-none w-[45ch] rounded-none"
      />
    );
  }

  return (
    <div
      className="w-[45ch] h-[18px] hover:cursor-pointer outline outline-1 outline-slate-300 outline-offset-8"
      onClick={() => setIsEditing(true)}
      title={getValue() as string}
    >
      <p className="truncate">{value}</p>
    </div>
  );
}

export default function ImportEdit() {
  const { empresa } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isUploadingOFX, setIsUploadingOFX] = useState(false);
  const uploadRulesOFXRef = useRef<any>(new AbortController());

  const {
    data: items,
    isLoading: isRascunhosLoading,
    isSuccess: isRascunhosSuccess,
  } = useLancamentosRascunhos();
  const bancoId =
    items && items?.length > 0 ? (items?.[0]?.idBanco as string) : "";

  const [selectedItensOFX, setSelectedItensOFX] = useState<
    LancamentoRascunho[]
  >(() => [...(items as LancamentoRascunho[])]);

  const { isLoading: isCategoriasLoading, data: categoriasData } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  const { mutateAsync: deleteListMutateAsync, isLoading: deleteListIsLoading } =
    useMutationDeletaLancamentosRascunhos();
  const { mutateAsync: createListMutateAsync, isLoading: createListIsLoading } =
    useMutationCriaLancamentosRascunhos();

  async function saveLancamentoRascunho() {
    try {
      await createListMutateAsync({
        lancamentos: selectedItensOFX,
        idEmpresa: empresa.id,
        idBanco: bancoId,
      });

      toast.success("Sucesso", {
        description: "Rascunho salvo",
      });
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro ao salvar rascunho",
      });
    }
  }

  async function deleteLancamentosRascunhos() {
    try {
      const temRascunhos =
        (
          queryClient.getQueryData([
            "lancamentosRascunhosData",
            empresa,
          ]) as LancamentoRascunho[]
        )?.length > 0;
      if (temRascunhos) {
        await deleteListMutateAsync(
          (
            queryClient.getQueryData([
              "lancamentosRascunhosData",
              empresa,
            ]) as LancamentoRascunho[]
          ).map((s) => s.id)
        );
      }
      setSelectedItensOFX([]);

      toast.success("Sucesso", {
        description: "Rascunho deletado",
      });
      navigate("..");
    } catch (e: any) {
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage || "Erro ao deletar rascunho",
      });
    }
  }

  async function handleSelectedOFXSubmit() {
    const faltaCategoria = selectedItensOFX.some(
      (lancamento: any) => !lancamento?.idCategoria
    );
    if (faltaCategoria) {
      toast.error("Erro", {
        description:
          "É preciso definir uma categoria para todos os lançamentos",
      });
      return;
    }
    try {
      uploadRulesOFXRef.current = new AbortController();
      setIsUploadingOFX(true);
      const params = [...selectedItensOFX];
      await api.post(
        `/cria-lista-lancamentos/${empresa.id}/${bancoId}`,
        params,
        { signal: uploadRulesOFXRef.current?.signal }
      );
      await deleteListMutateAsync(selectedItensOFX.map((s) => s.id));
      toast.success("Sucesso", {
        description: "Lançamentos importados",
      });
      navigate("/dashboard/lancamentos");
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        console.log("handleSelectedOFXSubmit: post request cancelled");
        return;
      }
      toast.error("Erro", {
        description:
          e?.response?.data?.errorMessage ||
          "Não foi possível realizar a importação",
      });
    } finally {
      setIsUploadingOFX(false);
    }
  }

  const selectColumns = [
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ getValue }) => (
        <Badge
          variant={(getValue() as string).toLowerCase() as "credito" | "debito"}
        >
          {getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: ({ getValue }) => moneyFormatter(getValue() as number),
    },
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ getValue }) => dateFormatter(getValue() as string),
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ getValue }) => (
        <div className="max-w-[45ch]">
          <p className="truncate" title={getValue() as string}>
            {getValue() as string}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "comentarios",
      header: "Comentário",
      cell: EditableComentarioCell,
    },
    {
      accessorKey: "idCategoria",
      header: "Categoria",
      cell: EditableCategoriaCell,
    },
  ] as ColumnDef<LancamentoRascunho>[];

  const selectTable = useReactTable({
    data: selectedItensOFX,
    columns: selectColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    meta: {
      updateData: (rowIndex: any, columnId: any, value: any) => {
        setSelectedItensOFX((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      categorias: categoriasData,
    },
  });

  useEffect(() => {
    let newItems = items?.map((item: LancamentoRascunho) => {
      let newItem = { ...item };
      if (item.tipo === "DEBITO") {
        newItem.valor = item.valor * -1;
      }
      return newItem;
    });
    setSelectedItensOFX(newItems as LancamentoRascunho[]);
  }, [items, isRascunhosSuccess]);

  if (isRascunhosLoading && isCategoriasLoading) {
    return (
      <section className="max-w-full flex flex-col items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="max-w-full flex flex-col gap-4 max-sm:gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-1 items-center flex-wrap gap-2">
          <Button
            key={"return-btn"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              navigate("..");
            }}
          >
            <ArrowLeftIcon className="mr-2 w-[1.125rem] h-[1.125rem]" />
            Retornar
          </Button>
          <Button
            size={"sm"}
            variant={"destructive"}
            onClick={deleteLancamentosRascunhos}
            disabled={
              (
                queryClient.getQueryData([
                  "lancamentosRascunhosData",
                  empresa,
                ]) as Array<any>
              )?.length === 0 || deleteListIsLoading
            }
          >
            {deleteListIsLoading ? (
              <LoaderIcon className="mr-2 animate-spin" />
            ) : (
              <XIcon className="mr-2 w-[1.125rem] h-[1.125rem]" />
            )}
            Cancelar
          </Button>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Button
            size={"sm"}
            onClick={saveLancamentoRascunho}
            disabled={createListIsLoading}
          >
            {createListIsLoading ? (
              <LoaderIcon className="mr-2 animate-spin" />
            ) : (
              <PenIcon className="mr-2 w-[1.125rem] h-[1.125rem]" />
            )}
            Salvar Rascunho
          </Button>
          <Button
            size={"sm"}
            key={`submit-btn-1`}
            onClick={handleSelectedOFXSubmit}
            disabled={isUploadingOFX}
          >
            {!isUploadingOFX ? (
              <ArrowRightIcon className="mr-2 w-[1.125rem] h-[1.125rem]" />
            ) : (
              <LoaderIcon className="mr-2 animate-spin" />
            )}
            Enviar
          </Button>
        </div>
      </div>

      <div className="flex max-lg:flex-col flex-row-reverse lg:justify-end gap-10 max-sm:gap-5">
        <div className="bg-white mb-20 pb-5 w-full space-y-4">
          <EditTable table={selectTable} columns={selectColumns} />
        </div>
      </div>
    </section>
  );
}
