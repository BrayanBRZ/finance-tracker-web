import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SubmitButton({ buttonText, className, isSubmitting }) {
  return (
    <Button
      disabled={isSubmitting}
      className={cn('h-10 w-10', className)}
    >
      {isSubmitting ? (
        <Loader className="text-primary-foreground size-4 animate-spin" />
      ) : (
        buttonText
      )}
    </Button>
  )
}
