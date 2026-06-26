import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Formato de e-mail inválido")
    .trim()
    .min(1, "O e-mail é obrigatório")
    .toLowerCase(),
  password: z.string().min(1, "A senha é obrigatória"),
  rememberMe: z.boolean(),
});
