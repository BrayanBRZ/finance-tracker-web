import { useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  const { session, handleLogout } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)
    await handleLogout()
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-zinc-50 p-6">
      <section className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-900">Sessão autenticada</p>
        <h1 className="mt-2 text-3xl text-zinc-950">
          Olá, {session?.user.name}
        </h1>
        <p className="mt-3 text-zinc-600">
          A estrutura financeira do dashboard será implementada na próxima
          etapa.
        </p>
        <Button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          className="mt-6 bg-blue-900 px-5 py-5 text-white hover:opacity-80"
        >
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </Button>
      </section>
    </main>
  )
}
