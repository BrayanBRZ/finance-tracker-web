import {
  readPasswordResetTokens,
  writePasswordResetTokens,
} from '@/mocks/data/passwordResetTokenData'

export function appendPasswordResetToken(token) {
  writePasswordResetTokens([...readPasswordResetTokens(), token])
}

export function findPasswordResetToken(token) {
  return readPasswordResetTokens().find((record) => record.token === token)
}

export function replacePasswordResetToken(nextToken) {
  writePasswordResetTokens(
    readPasswordResetTokens().map((token) =>
      token.id === nextToken.id ? nextToken : token,
    ),
  )
}
