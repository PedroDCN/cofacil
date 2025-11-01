import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import bigLogo from "@/assets/torresfintech_logo3_nobg.png";
import GoogleButton from "./components/GoogleButton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

const formSchema = z.object({
  email: z.string().min(1, "fff").email("Must be a valid email"),
  senha: z
    .string()
    .min(4, "Must be at least 4 characters long")
    .max(50, "Maximum length of 50 characters exceded"),
});

export default function Login() {
  const { session, login, login2 } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      navigate("/selecao");
    }
  }, []);

  function handleSuccess(tokenResponse: any) {
    login(
      tokenResponse,
      () => {
        navigate("/selecao", { replace: true });
      },
      handleError
    );
  }

  function handleError(error: any) {
    toast.error("Erro", {
      description: error?.response?.data?.errorMessage || "Erro no Login",
      duration: 10000,
    });
  }

  function handleSubmit(data: any) {
    console.log("dados:", data);

    login(
      data,
      () => {
        navigate("/selecao", { replace: true });
      },
      handleError
    );
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    login2(
      values,
      () => {
        navigate("/selecao", { replace: true });
      },
      handleError
    );
  }

  return (
    <>
      <div
        className="h-screen flex-auto max-[1000px]:flex-col max-[1000px]:gap-10
      flex pt-5 justify-center items-center bg-slate-200/70 relative"
      >
        <div className="mx-auto mb-5 max-[1000px]:h-[124px]">
          <img className="h-full" src={bigLogo} alt="" />
        </div>
        <div className="w-[20rem] my-3 mx-auto">
          <GoogleButton onSuccess={handleSuccess} onError={handleError} />
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="vasco@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="vasco" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form> */}
        </div>
      </div>
      <Toaster
        richColors
        closeButton
        duration={Infinity}
        toastOptions={{
          classNames: {
            closeButton: "right-0 left-[calc(100%-10px)]",
          },
        }}
      />
    </>
  );
}
