import { useId, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { parseDateInputValue, toDateInputValue } from '@/utils/dates'

export function DashboardDatePicker({
  label,
  value,
  minDate,
  maxDate,
  onChange,
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const selectedDate = parseDateInputValue(value)

  const selectDate = (date) => {
    if (!date) return
    const nextValue = toDateInputValue(date)
    if ((minDate && nextValue < minDate) || (maxDate && nextValue > maxDate))
      return
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id}>{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="border-input bg-background hover:bg-muted/50 w-40 justify-between gap-2 px-3 text-left font-normal"
          >
            <span>{selectedDate?.toLocaleDateString('pt-BR')}</span>
            <CalendarDays
              aria-hidden="true"
              className="text-muted-foreground"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={selectDate}
            disabled={(date) => {
              const dateValue = toDateInputValue(date)
              return (
                (minDate && dateValue < minDate) ||
                (maxDate && dateValue > maxDate)
              )
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
