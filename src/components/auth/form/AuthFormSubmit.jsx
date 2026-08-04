import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AuthFormSubmit({ buttonText, isSubmitting, disabled = false }) {
  return (
    <Button
      disabled={isSubmitting || disabled}
      className="mt-3 h-10 w-full text-sm shadow-sm"
    >
      {isSubmitting ? (
        <Loader className="text-primary-foreground size-4 animate-spin" />
      ) : (
        buttonText
      )}
    </Button>
  )
}
