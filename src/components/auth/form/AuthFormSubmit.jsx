import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AuthFormSubmit({ buttonText, isSubmitting }) {
  return (
    <Button
      disabled={isSubmitting}
      className="mt-3 h-10 w-full text-sm shadow-sm"
    >
      {isSubmitting ? (
        <Loader className="size-4 animate-spin text-primary-foreground" />
      ) : (
        buttonText
      )}
    </Button>
  )
}
