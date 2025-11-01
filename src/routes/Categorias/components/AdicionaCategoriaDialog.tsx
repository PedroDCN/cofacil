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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

enum Tipo {
  CUSTO_FIXO = "CUSTO_FIXO",
  CUSTO_VARIAVEL = "CUSTO_VARIAVEL",
  ENTRADA = "ENTRADA",
}

type CategoriaDTO = {
  nome: string;
  tipo: Tipo;
};

const formSchema = z.object({
  nome: z.string().min(1, "nome não pode ser vazio."),
  tipo: z.enum([Tipo.CUSTO_FIXO, Tipo.CUSTO_VARIAVEL, Tipo.ENTRADA], {
    required_error: "Você precisa selecionar um tipo.",
  }),
});

type Props = {
  handleSubmit: any;
};

export default function AdicionaCategoriaDialog({ handleSubmit }: Props) {
  const categoriaVazia: CategoriaDTO = {
    nome: "",
    tipo: Tipo.CUSTO_FIXO,
  };
  const closeBtnRef = useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: categoriaVazia,
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
            <DialogTitle>Cadastro de Categoria</DialogTitle>
            <DialogDescription>
              Cadastrar uma categoria manualmente.
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
                    <FormDescription>Nome da categoria</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo da Categoria</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={Tipo.CUSTO_FIXO} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Custo Fixo
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={Tipo.CUSTO_VARIAVEL} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Custo Variável
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={Tipo.ENTRADA} />
                          </FormControl>
                          <FormLabel className="font-normal">Entrada</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>Tipo da categoria</FormDescription>
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
