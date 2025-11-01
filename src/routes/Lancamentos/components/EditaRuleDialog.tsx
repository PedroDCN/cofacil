import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Fragment, PropsWithChildren, useRef } from "react";
import { z } from "zod";
import { CalendarIcon, CheckIcon, PenIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format, isEqual } from "date-fns";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Rule } from "@/utils/types";
import {
  dateCondtList,
  fieldList,
  generateId,
  genericCondition,
  numericCondtList,
  stringCondtList,
} from "@/utils/rulesUtil";

const editaFormSchema = z.object({
  id: z.string(),
  nome: z
    .string({ required_error: "nome é obrigatório" })
    .min(1, "nome é obrigatório"),
  conditions: z.array(
    z.object({
      id: z.string(),
      campo: z.enum(["valor", "descricao", "data"]),
      condicao: z.string().min(1, "condição não pode ser vazia"),
      valor: z.any(),
    })
  ),
  idCategoria: z.string({ required_error: "categoria é obrigatório" }),
});

type EditaRuleDialogProps = PropsWithChildren<{
  selectedRule: Rule;
  handleSubmit: (rule: Rule) => Promise<void>;
  categorias: Array<any>;
}>;

export default function EditaRuleDialog({
  selectedRule,
  handleSubmit,
  categorias,
  children,
}: EditaRuleDialogProps) {
  const defaultRule: Rule = {
    id: "",
    nome: "",
    conditions: [genericCondition()],
    idCategoria: categorias[0]?.id,
  };
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof editaFormSchema>>({
    resolver: zodResolver(editaFormSchema),
    defaultValues: defaultRule,
  });

  const {
    fields: conditionsFields,
    append,
    remove,
    update,
    replace,
  } = useFieldArray({
    control: form.control,
    name: "conditions",
  });

  async function onSubmitForm(values: z.infer<typeof editaFormSchema>) {
    const newValues = { ...selectedRule, ...values };
    await handleSubmit(newValues as Rule);
    if (closeBtnRef.current) {
      closeBtnRef.current.click();
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => {
          form.reset();
          form.setValue("id", selectedRule.id);
          form.setValue("nome", selectedRule.nome);
          form.setValue("idCategoria", selectedRule.idCategoria);
          replace(
            selectedRule.conditions.map((c) => ({ ...c, id: generateId() }))
          );
        }}
      >
        {children || (
          <Button>
            <PenIcon className="mr-2" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[500px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Regra</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Regra:</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Regra Pix" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCategoria"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Categoria:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger className="font-semibold">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias &&
                        categorias.map((categoria: any) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Condições: </FormLabel>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => append({ ...genericCondition() })}
                  type="button"
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-col gap-2 w-full max-h-60 p-1 overflow-y-auto">
                {conditionsFields.map((field, index) => {
                  const condtList =
                    field.campo === "valor"
                      ? numericCondtList
                      : field.campo === "descricao"
                      ? stringCondtList
                      : dateCondtList;
                  return (
                    <Fragment key={field.id}>
                      <div className="space-y-0 flex gap-1 w-full items-center">
                        <div className="flex-shrink-0 w-[110px]">
                          <Select
                            onValueChange={(currentValue) => {
                              update(index, {
                                ...field,
                                condicao: "",
                                campo: currentValue as
                                  | "valor"
                                  | "descricao"
                                  | "data",
                                valor:
                                  currentValue === "valor"
                                    ? 0
                                    : currentValue === "data"
                                    ? new Date() // TODO: usar date-fns para setar formato exato da data?
                                    : "",
                              });
                            }}
                            defaultValue={field.campo as string}
                          >
                            <SelectTrigger className="font-semibold">
                              <SelectValue placeholder="Campo" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldList &&
                                fieldList.map((fieldv: any) => (
                                  <SelectItem
                                    key={fieldv.value}
                                    value={fieldv.value}
                                  >
                                    {fieldv.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-shrink-0 w-[150px]">
                          <Select
                            onValueChange={(currentValue) => {
                              update(index, {
                                ...field,
                                valor: form.getValues(
                                  `conditions.${index}.valor`
                                ),
                                condicao: currentValue,
                              });
                            }}
                            defaultValue={field.condicao as string}
                          >
                            <SelectTrigger className="font-semibold">
                              <SelectValue placeholder="Escolha uma condição" />
                            </SelectTrigger>
                            <SelectContent>
                              {condtList &&
                                condtList.map((condt: any) => (
                                  <SelectItem
                                    key={condt.value}
                                    value={condt.value}
                                  >
                                    {condt.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-grow">
                          {field.campo === "descricao" && (
                            <Input
                              type="text"
                              placeholder=""
                              {...form.register(`conditions.${index}.valor`)}
                              onChange={(e) => {
                                form.setValue(
                                  `conditions.${index}.valor`,
                                  e.target.value
                                );
                              }}
                            />
                          )}
                          {field.campo === "valor" && (
                            <Input
                              type="number"
                              {...form.register(`conditions.${index}.valor`)}
                              // onChange={(e: any) => {
                              //   let parsedValue = parseFloat(
                              //     e.target.value
                              //   );
                              //   parsedValue = isNaN(parsedValue)
                              //     ? 0
                              //     : parsedValue;
                              //   form.setValue(
                              //     `conditions.${index}.valor`,
                              //     parsedValue
                              //   );
                              //   // update(index, {
                              //   //   ...field,
                              //   //   valor: parsedValue,
                              //   // });
                              // }}
                            />
                          )}
                          {field.campo === "data" && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[150] justify-start text-left font-normal",
                                    !field?.valor && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                  {field?.valor ? (
                                    format(new Date(field?.valor), "dd/MM/yyyy")
                                  ) : (
                                    <span>Escolha uma Data</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={new Date(field?.valor)}
                                  onSelect={(day) => {
                                    if (
                                      day &&
                                      !isEqual(day, new Date(field?.valor))
                                    ) {
                                      update(index, {
                                        ...field,
                                        valor: day,
                                      });
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 ml-auto w-8 h-8 rounded-sm"
                          type="button"
                          onClick={() => {
                            if (conditionsFields.length > 1) {
                              remove(index);
                            }
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                      {form.getFieldState(`conditions.${index}.condicao`)
                        ?.error && (
                        <p className="text-red-500 dark:text-red-900 text-sm font-medium">
                          {
                            form.getFieldState(`conditions.${index}.condicao`)
                              ?.error?.message
                          }
                        </p>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-md"
              disabled={form.formState.isSubmitting}
            >
              <CheckIcon className="mr-2" />
              Cadastrar
            </Button>
          </form>
        </FormProvider>

        <DialogFooter className="w-full">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              ref={closeBtnRef}
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
