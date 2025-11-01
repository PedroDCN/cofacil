import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/contexts/appContext";
import { getCategorias } from "@/services/categoriaService";
import { moneyFormatter } from "@/utils/moneyUtil";
import { dateFormatter } from "@/utils/dateUtil";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdicionaRuleDialog from "../components/AdicionaRuleDialog";
import {
  cadastraRule,
  enviaRegrasAplicar,
  getRules,
} from "@/services/lancamentoService";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  LoaderIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useMutationCriaLancamentosRascunhos } from "../mutations";
import { LancamentoRascunho, Rule, RuleDTO } from "@/utils/types";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { SelectionTable } from "../components/selection-table";
import { RulesTable } from "../components/rules-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ImportSelection() {
  const { empresa, items, setItems, bancoId, setBancoId } = useApp();
  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rulesSelection, setRulesSelection] = useState<RowSelectionState>({});

  const {
    data: rulesData,
    refetch: refetchRules,
    isLoading: isRulesLoading,
  } = useQuery({
    queryKey: ["importRules", empresa],
    queryFn: getRules,
  });

  const { isLoading: isCategoriasLoading, data: categoriasData } = useQuery({
    queryKey: ["categoriasEmpresa", empresa],
    queryFn: getCategorias,
  });

  const criaListaLancamentosRascunhosMutation =
    useMutationCriaLancamentosRascunhos();

  const [isUploading, setIsUploading] = useState(false);

  const uploadRulesRef = useRef<any>(new AbortController());

  const handleAddRule = async (rule: RuleDTO) => {
    try {
      await cadastraRule(rule);
      toast.success("Sucesso", {
        description: "Regra Criada",
      });
      refetchRules();
    } catch (e: any) {
      toast.error("Não foi possível cadastrar a regra", {
        description:
          e?.response?.data?.errorMessage || "Ocorreu um erro na Criação",
      });
    }
  };

  const handleRuleSubmit = async (items: any, rules: any[]) => {
    try {
      uploadRulesRef.current = new AbortController();
      setIsUploading(true);
      const lancamentos = await enviaRegrasAplicar(
        items,
        rules,
        uploadRulesRef.current?.signal
      );

      await criaListaLancamentosRascunhosMutation.mutateAsync({
        lancamentos: lancamentos as LancamentoRascunho[],
        idEmpresa: empresa.id,
        idBanco: bancoId,
      });

      // remover Items e BancoId
      setItems([]);
      setBancoId("");

      toast.success("Sucesso", {
        description: "Lançamentos realizados",
      });

      navigate("edit");
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        console.log("handleRuleSubmit: post request cancelled");
        return;
      }
      toast.error("Não foi possível realizar a importação", {
        description:
          e?.response?.data?.errorMessage ||
          "Ocorreu um erro na importação dos lançamentos",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="h-full flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent"
              >
                <ChevronDownIcon className="w-4 h-4 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 ml-36">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    table.toggleAllRowsSelected(!table.getIsAllRowsSelected())
                  }
                >
                  <span>Selecionar todos</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <span>Limpar seleção</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
  ] as ColumnDef<LancamentoRascunho>[];

  const table = useReactTable({
    data: items as LancamentoRascunho[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  useEffect(() => {
    table.toggleAllRowsSelected();
    return () => {
      setIsUploading(false);
      uploadRulesRef.current?.abort();
    };
  }, []);

  if (isRulesLoading && isCategoriasLoading) {
    return (
      <section className="max-w-full flex flex-col gap-6 max-sm:gap-4">
        <Spinner />
      </section>
    );
  }

  return (
    <>
      <section className="max-w-full flex flex-col gap-4 max-sm:gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-1 items-center flex-wrap gap-2">
            <Button
              variant={"destructive"}
              size={"sm"}
              onClick={() => {
                setBancoId("");
                uploadRulesRef.current?.abort();
                navigate("..");
              }}
            >
              <XIcon className="mr-2 w-[1.125rem] h-[1.125rem]" />
              Cancelar
            </Button>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Button
              key={`submit-btn-0`}
              size={"sm"}
              variant="outline"
              className="rounded-sm text-md"
              onClick={() =>
                handleRuleSubmit(
                  (items as LancamentoRascunho[]).filter(
                    (_, index) => !!rowSelection[index]
                  ),
                  Object.keys(rulesSelection)
                )
              }
              disabled={
                isUploading ||
                (items as LancamentoRascunho[]).filter(
                  (_, index) => !!rowSelection[index]
                )?.length === 0 ||
                (rulesData as Rule[])?.filter(({ id }) => rulesSelection[id])
                  ?.length === 0
              }
            >
              Aplicar
              {!isUploading ? (
                <ArrowRightIcon className="ml-2 w-[1.125rem] h-[1.125rem]" />
              ) : (
                <LoaderIcon className="ml-2 animate-spin" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex max-lg:flex-col flex-row-reverse lg:justify-end gap-10 max-sm:gap-5">
          <div className="w-full flex-col gap-6 max-sm:gap-4">
            <div className="flex items-start max-lg:flex-col-reverse gap-4">
              <div className="flex flex-col gap-4 pb-4 w-full lg:w-4/5 rounded-sm bg-white">
                <SelectionTable table={table} columns={columns} />
              </div>
              <div className="flex flex-col gap-2 w-full lg:w-1/5">
                <h4 className="flex items-center justify-between font-semibold text-lg">
                  regras para aplicar:
                  <AdicionaRuleDialog
                    handleSubmit={(rule: RuleDTO): Promise<void> => {
                      rule = { ...rule, nome: rule.nome.trim() };
                      return handleAddRule(rule);
                    }}
                    categorias={categoriasData}
                  >
                    <Button size="sm" variant="ghost">
                      <PlusIcon className="w-[1.125rem] h-[1.125rem] mr-2" />
                      Adicionar
                    </Button>
                  </AdicionaRuleDialog>
                </h4>
                <div className="bg-white rounded-sm">
                  <RulesTable
                    rulesSelection={rulesSelection}
                    setRulesSelection={setRulesSelection}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
