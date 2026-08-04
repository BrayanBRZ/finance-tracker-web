import { z } from 'zod'
import {
  isStrongPassword,
  STRONG_PASSWORD_MESSAGE,
} from '@/domain/passwordPolicy'

export const strongPasswordSchema = z
  .string()
  .min(1, 'Senha é obrigatória')
  .refine(isStrongPassword, STRONG_PASSWORD_MESSAGE)
