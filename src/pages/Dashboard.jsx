import { useSession } from '@/context/sessionContext'

export function DashboardPage() {
  const { session } = useSession()

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-blue-900">Sessão autenticada</p>
      <h1 className="mt-2 text-3xl text-zinc-950">
        Olá, {session?.user.name}
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        A estrutura financeira do dashboard será implementada na próxima etapa.
      </p>
    </section>
  )
}
