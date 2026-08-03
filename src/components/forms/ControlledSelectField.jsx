import { Controller } from 'react-hook-form'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ControlledSelectField({
  control,
  name,
  id,
  label,
  placeholder,
  options,
  disabled,
  onValueChange,
  renderOption = (option) => option.label,
}) {
  const errorId = `${id}-error`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              if (onValueChange) {
                onValueChange(value, field)
                return
              }

              field.onChange(value)
            }}
            onOpenChange={(isOpen) => {
              if (!isOpen) field.onBlur()
            }}
            disabled={disabled}
          >
            <SelectTrigger
              id={id}
              aria-invalid={fieldState.error ? true : undefined}
              aria-describedby={fieldState.error ? errorId : undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {renderOption(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorSpan id={errorId} error={fieldState.error?.message} />
        </Field>
      )}
    />
  )
}
