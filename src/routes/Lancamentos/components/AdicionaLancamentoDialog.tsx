import { PropsWithChildren, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { lancamentoFormSchema, LancamentoFormSchemaType } from "../schemas";

type Props = PropsWithChildren<{
  categorias: any;
  bancos: any;
  handleSubmit: any;
}>;

let tipos = ["CREDITO", "DEBITO"];

export default function AdicionaLancamentoDialog({
  categorias,
  bancos,
  handleSubmit,
  children,
}: Props) {
  const lancamentoVazio: LancamentoFormSchemaType = {
    valor: "0",
    tipo: "CREDITO",
    data: new Date(),
    descricao: "",
    comentarios: "",
    idCategoria: categorias[0]?.id,
    bancoId: bancos[0]?.id,
  };
  const closeBtnRef = useRef<any>(null);

  const form = useForm<z.infer<typeof lancamentoFormSchema>>({
    resolver: zodResolver(lancamentoFormSchema),
    defaultValues: lancamentoVazio,
  });

  function onSubmitForm(values: z.infer<typeof lancamentoFormSchema>) {
    // if (closeBtnRef.current) {
    //   closeBtnRef.current.click();
    // }

    form.resetField("valor");
    form.resetField("tipo");
    form.resetField("descricao");
    form.resetField("comentarios");
    form.setFocus("valor");

    handleSubmit(values);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger
          asChild
          onClick={() => {
            form.reset();
          }}
        >
          {children || (
            <Button className="bg-green-500 hover:bg-green-700 rounded-sm text-md">
              <i className="pi pi-plus mr-2"></i>Adicionar
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-[500px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro de Lançamento</DialogTitle>
            <DialogDescription>
              Cadastrar um lançamento manualmente.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitForm)}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-3/5">
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="R$0.00" {...field} />
                      </FormControl>
                      <FormDescription>Valor do lançamento</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as string}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[200px] font-semibold">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tipos &&
                            tipos.map((tipo: any) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Tipo do lançamento</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              ;
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 z-[100]" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Data do lançamento</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="bancoId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Banco</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as string}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[200px] font-semibold">
                            <SelectValue placeholder="Banco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bancos &&
                            bancos.map((banco: any) => (
                              <SelectItem key={banco.id} value={banco.id}>
                                {banco.nome}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Banco do lançamento</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCategoria"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as string}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[200px] font-semibold">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias &&
                            categorias.map((categoria: any) => (
                              <SelectItem
                                key={categoria.id}
                                value={categoria.id}
                              >
                                {categoria.nome}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Categoria do lançamento</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Descrição sobre o lançamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comentarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentário</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-md">
                <i className="pi pi-check mr-2"></i>
                Cadastrar
              </Button>
            </form>
          </Form>
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
    </>
  );
}
