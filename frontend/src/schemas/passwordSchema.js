import { z } from 'zod'
import {
  isValidPassword,
  PASSWORD_MIN_MESSAGE,
  hasValidPasswordByteLength,
  PASSWORD_MAX_MESSAGE,
} from '@/domain/passwordPolicy'

export const strongPasswordSchema = z
  .string()
  .min(1, 'Senha é obrigatória')
  .refine(isValidPassword, PASSWORD_MIN_MESSAGE)
  .refine(hasValidPasswordByteLength, PASSWORD_MAX_MESSAGE)
