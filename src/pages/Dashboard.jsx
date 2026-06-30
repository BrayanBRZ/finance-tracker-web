import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'

export function DashboardPage() {
  const { session } = useSession()
  const { currentWallet, hasWallets, isLoading } = useWallet()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-900">
          Sessão autenticada
        </p>
        <h1 className="mt-2 text-3xl text-zinc-950">
          Olá, {session?.user.name}
        </h1>

        {isLoading ? (
          <p className="mt-3 max-w-2xl text-zinc-600">
            Carregando carteiras...
          </p>
        ) : null}

        {!isLoading && hasWallets ? (
          <p className="mt-3 max-w-2xl text-zinc-600">
            A carteira atual é {currentWallet?.name}. A estrutura financeira do
            dashboard será implementada na próxima etapa.
          </p>
        ) : null}

        {!isLoading && !hasWallets ? (
          <p className="mt-3 max-w-2xl text-zinc-600">
            Você ainda não possui uma carteira. Crie a primeira para começar a
            organizar seus dados financeiros.
          </p>
        ) : null}
      </section>

      <CreateWalletForm
        title={hasWallets ? 'Criar outra carteira' : 'Criar primeira carteira'}
      />
    </div>
  )
}
