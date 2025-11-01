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

type Banco = {
  id: string;
  nome: string;
  agencia: string;
  conta: string;
};

const formSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "nome não pode ser vazio."),
  agencia: z.string(),
  conta: z.string(),
});

type Props = {
  selectedBanco: any;
  handleSubmit: any;
};

export default function EditaBancoDialog({
  selectedBanco,
  handleSubmit,
}: Props) {
  const bancoVazio: Banco = {
    id: "",
    nome: "",
    agencia: "",
    conta: "",
  };
  const closeBtnRef = useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: bancoVazio,
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

    // form.reset();
    // form.setFocus("nome");

    handleSubmit(values);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full p-2 aspect-square hover:text-white hover:bg-purple-700 mr-2"
            onClick={() => {
              form.reset();
              form.setValue("id", selectedBanco.id);
              form.setValue("nome", selectedBanco.nome);
              form.setValue("agencia", selectedBanco.agencia);
              form.setValue("conta", selectedBanco.conta);
            }}
            disabled={!selectedBanco}
          >
            <i className="pi pi-pencil"></i>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[500px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Banco</DialogTitle>
            <DialogDescription>Editar um banco manualmente.</DialogDescription>
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
                    <FormDescription>Nome do banco</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agência</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Numero da agência</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Numero da conta</FormDescription>
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
