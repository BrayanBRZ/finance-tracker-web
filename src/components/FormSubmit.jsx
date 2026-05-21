import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

const FormSubmit = ({ buttonText, isSubmitting }) => {

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={`h-13 w-full mt-6 transition-all shadow-md border-0 text-lg ${isSubmitting
        ? 'cursor-not-allowed bg-zinc-400 opacity-70'
        : 'cursor-pointer bg-blue-900 hover:opacity-70'
        }`}
    >
      {isSubmitting
        ? <Loader className="animate-spin text-zinc-950" size={24} />
        : buttonText}
    </Button>
  )
}

export { FormSubmit }