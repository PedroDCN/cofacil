import { useState, useRef, useEffect, PropsWithChildren } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInputIcon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";

type Props = PropsWithChildren<{
  openImportSelection: (data: any, bancoId: string) => void;
  bancos: any;
}>;

const formSchema = z
  .object({
    ofx: z
      .instanceof(FileList)
      .refine((files) => !!files.item(0), "O arquivo OFX é obrigatório")
      // .refine(
      //   (files) => files[0]?.size <= 5 * 1024 * 1024,
      //   "Tamanho máximo de 5MB"
      // )
      .refine((files) => {
        // return ["application/x-ofx"].includes(files[0]?.type);
        return (
          files[0]?.name.toLowerCase().endsWith(".ofx") ||
          files[0]?.name.toLowerCase().endsWith(".csv")
        );
      }, "Formato de arquivo inválido")
      .transform((files) => files?.item(0)!),
    bancoId: z.string(),
  })
  .required({ bancoId: true });

export default function ImportaLancamentoDialog({
  openImportSelection,
  bancos,
  children,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadRequestControllerRef = useRef<any>(new AbortController());
  const closeBtnRef = useRef<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bancoId: bancos[0]?.id,
    },
  });

  async function onSubmitForm(values: z.infer<typeof formSchema>) {
    // debug values on toast
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    // console.log(values);

    uploadRequestControllerRef.current = new AbortController();
    setIsUploading(true);

    const file = new FormData();
    const body = values.ofx;

    // await new Promise((r) => setTimeout(r, 3000));

    file.append("file", body);

    try {
      const res = await api.post("/send-file", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: uploadRequestControllerRef.current?.signal,
      });
      toast.success("Importados", {
        description: "Lançamentos importados",
      });
      if (closeBtnRef.current) {
        closeBtnRef.current.click();
      }
      openImportSelection(res.data, values.bancoId);
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        console.log("post request cancelled");
        return;
      }
      toast.error("Não foi possível realizar a importação", {
        description:
          e?.response?.data?.errorMessage ||
          "Ocorreu um erro na importação dos lançamentos",
      });
    } finally {
      // setTimeout(() => {
      //   event.options.clear();
      // }, 10);
      setIsUploading(false);
    }
  }

  useEffect(() => {
    return () => {
      setIsUploading(false);
      uploadRequestControllerRef.current?.abort();
    };
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger
          asChild
          onClick={() => {
            form.resetField("ofx");
            form.resetField("bancoId");
          }}
        >
          {children || (
            <Button className="bg-purple-500 hover:bg-purple-700 rounded-sm text-md">
              <FileInputIcon className="w-[1.125rem] h-[1.125rem] mr-2" />
              Importar
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md md:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Importar Lançamentos</DialogTitle>
            <DialogDescription>
              Fazer Importação de Lançamentos através do upload de um arquivo
              OFX.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitForm)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="ofx"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arquivo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...form.register("ofx")}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bancoId"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Banco</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                      disabled={isUploading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full font-semibold">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-md"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <LoaderIcon className="animate-spin mr-2" />
                    Enviando
                  </>
                ) : (
                  <>Enviar</>
                )}
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
                onClick={() => {
                  setIsUploading(false);
                  uploadRequestControllerRef.current?.abort();
                }}
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
