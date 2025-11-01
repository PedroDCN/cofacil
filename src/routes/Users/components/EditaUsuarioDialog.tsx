import { useEffect, useRef } from "react";
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
import { useAuth } from "@/contexts/authContext";
import { getEmpresas } from "@/services/empresaService";
import { useQuery } from "@tanstack/react-query";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Empresa } from "@/utils/types";

enum Role {
  ADMIN = "ADMIN",
  GERENTE = "GERENTE",
  FUNCIONARIO = "FUNCIONARIO",
  CLIENTE = "CLIENTE",
}

type UsuarioDTO = {
  nome: string;
  email: string;
  role: Role;
  empresas: Array<string>;
};

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z
  .object({
    id: z.string(),
    nome: z.string().min(1, "nome não pode ser vazio."),
    email: z.string().email("não é um formato de email válido."),
    role: z.enum([Role.ADMIN, Role.GERENTE, Role.FUNCIONARIO, Role.CLIENTE], {
      required_error: "você precisa selecionar um tipo.",
    }),
    empresas: z.array(optionSchema),
  })
  .refine(
    (data) => [Role.ADMIN].includes(data?.role) || data.empresas.length > 0,
    {
      message: "Selecione pelo menos uma empresa.",
      path: ["empresas"],
    }
  );

type Props = {
  selectedUser: any;
  handleSubmit: any;
  variant?: "button" | "icon";
};

export default function EditaUsuarioDialog({
  selectedUser,
  handleSubmit,
  variant,
}: Props) {
  const { session } = useAuth();
  const usuarioVazio = {
    nome: "",
    email: "",
    role: Role.CLIENTE,
    empresas: [],
  };
  const closeBtnRef = useRef<any>(null);

  const options = [
    { label: "Admin", value: Role.ADMIN },
    { label: "Gerente", value: Role.GERENTE },
    { label: "Funcionario", value: Role.FUNCIONARIO },
    { label: "Cliente", value: Role.CLIENTE },
  ].filter(
    (opt) => !(opt.label === "Admin" && session.user.role !== Role.ADMIN)
  );

  const { data } = useQuery({
    queryKey: ["empresasData"],
    queryFn: getEmpresas,
  });

  const empresasList =
    data?.map((emp: Empresa) => ({ label: emp.nome, value: emp.id })) || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: usuarioVazio,
  });
  const roleField = form.watch("role");

  useEffect(() => {
    if (roleField === Role.ADMIN) {
      form.resetField("empresas");
    }
  }, [roleField]);

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
    if (values.role === Role.ADMIN) {
      values.empresas = [];
    }
    const newValues: UsuarioDTO = {
      ...values,
      empresas: values.empresas.map((v) => v.value),
    };
    handleSubmit(newValues);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {variant === "icon" ? (
            <Button
              variant="outline"
              className="rounded-full p-2 aspect-square hover:text-white hover:bg-purple-700 mr-2"
              onClick={() => {
                //   form.reset();
                form.setValue("id", selectedUser.id);
                form.setValue("nome", selectedUser.nome);
                form.setValue("email", selectedUser.email);
                form.setValue("role", selectedUser.role);
                form.setValue(
                  "empresas",
                  empresasList
                    .filter((e: any) =>
                      selectedUser.empresas.find((id: string) => id === e.id)
                    )
                    .filter(
                      (e: any) =>
                        !((selectedUser.role as string) === Role.ADMIN)
                    )
                );
              }}
              disabled={!selectedUser}
            >
              <i className="pi pi-pencil"></i>
            </Button>
          ) : (
            <Button
              className="bg-purple-500 hover:bg-purple-700 rounded-sm text-md"
              onClick={() => {
                //   form.reset();
                form.setValue("id", selectedUser.id);
                form.setValue("nome", selectedUser.nome);
                form.setValue("email", selectedUser.email);
                form.setValue("role", selectedUser.role);
                form.setValue("empresas", selectedUser.empresas);
              }}
              disabled={!selectedUser}
            >
              <i className="pi pi-cog mr-2"></i>Editar
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-[500px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
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
                      <Input {...field} placeholder="Nome" />
                    </FormControl>
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
                      <Input {...field} placeholder="email@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Cargo</FormLabel>
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
                        {options &&
                          options.map((opcao: any) => (
                            <SelectItem key={opcao.value} value={opcao.value}>
                              {opcao.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresas</FormLabel>
                    <MultipleSelector
                      {...field}
                      value={field.value}
                      defaultOptions={empresasList}
                      placeholder="Empresas"
                      hidePlaceholderWhenSelected
                      // Desabilitar se ADMIN estivar cadastrando outro ADMIN
                      disabled={roleField === Role.ADMIN}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          nenhuma empresa encontrada.
                        </p>
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-md">
                <i className="pi pi-check mr-2"></i>
                Editar
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
