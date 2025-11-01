import { useRef } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmpresaDTO } from "@/utils/types";

const formSchema = z.object({
  nome: z.string().min(1, "nome não pode ser vazio."),
  ramo: z.string().min(1, "ramo não pode ser vazio."),
  email: z
    .string()
    .min(1, "email não pode ser vazio")
    .email("formato de email inválido"),
});

const ramoFieldOptions = [{ label: "Alimentício", value: "ALIMENTICIO" }];
// .filter(
//   (opt) => !(opt.label === "Admin" && session.user.role !== Role.ADMIN)
// );

type Props = {
  handleSubmit: any;
};

export default function AdicionaEmpresaDialog({ handleSubmit }: Props) {
  const empresaVazio: EmpresaDTO = {
    nome: "",
    ramo: ramoFieldOptions[0]?.value ?? "",
    email: "",
  };
  const closeBtnRef = useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: empresaVazio,
  });

  function onSubmitForm(values: z.infer<typeof formSchema>) {
    // debug values on toast
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    if (closeBtnRef.current) {
      closeBtnRef.current.click();
    }
    handleSubmit(values);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-green-500 hover:bg-green-700 rounded-sm text-md"
            onClick={() => {
              form.reset();
            }}
          >
            <i className="pi pi-plus mr-2"></i>Adicionar
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[500px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro de Empresa</DialogTitle>
            <DialogDescription>
              Cadastrar uma empresa manualmente.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitForm)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Nome da empresa</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ramo"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Ramo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full font-semibold">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ramoFieldOptions &&
                          ramoFieldOptions.map((opcao: any) => (
                            <SelectItem key={opcao.value} value={opcao.value}>
                              {opcao.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Ramo de atuação da empresa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Email do responsável</FormDescription>
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
