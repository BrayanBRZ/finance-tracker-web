import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FormSubmit({ buttonText, isSubmitting }) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="mt-6 h-13 w-full text-lg shadow-md"
    >
      {isSubmitting ? (
        <Loader className="animate-spin text-primary-foreground" size={24} />
      ) : (
        buttonText
      )}
    </Button>
  )
}
