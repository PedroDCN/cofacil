import { z } from "zod";

export const lancamentoFormSchema = z
  .object({
    valor: z.string().regex(/^(-?(?!0+(\.0*)?$)\d+(\.\d+)?)$/, {
      message: "Valor deve ser numérico e diferente de 0.",
    }),
    tipo: z.enum(["DEBITO", "CREDITO"], {
      invalid_type_error: "Tipo inválido",
    }),
    data: z
      .date({
        required_error: "Uma data para o lancamento é necessária.",
      })
      .min(new Date("2000-01-01"), { message: "Data muito antiga." }),
    descricao: z
      .string()
      .max(300, {
        message: "Descrição deve ser menor que 300 caracteres.",
      })
      .optional(),
    comentarios: z
      .string()
      .max(500, {
        message: "Comentário deve ser menor que 500 caracteres.",
      })
      .optional(),
    idCategoria: z.string(),
    bancoId: z.string(),
  })
  .required({
    valor: true,
    tipo: true,
    data: true,
    idCategoria: true,
    bancoId: true,
  });

export type LancamentoFormSchemaType = z.infer<typeof lancamentoFormSchema>;
