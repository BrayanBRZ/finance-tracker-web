import { z } from 'zod'
import { ASSIGNABLE_WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

export const walletMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .email('Informe um e-mail válido')
    .toLowerCase(),
  role: z.enum(ASSIGNABLE_WALLET_MEMBER_ROLES, {
    message: 'Selecione um papel válido',
  }),
})
