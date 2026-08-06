export function applyApiErrors(form, error) {
  const fieldErrors = error?.fieldErrors ?? {}
  const entries = Object.entries(fieldErrors)
  const values = form.getValues()
  let hasUnknownField = false

  entries.forEach(([field, message]) => {
    if (Object.hasOwn(values, field)) {
      form.setError(field, { type: 'server', message })
    } else {
      hasUnknownField = true
    }
  })

  if (entries.length === 0 || hasUnknownField) {
    form.setError('root.server', {
      type: 'server',
      message:
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir a operação.',
    })
  }
}
