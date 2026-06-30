import { useWallet } from '@/context/walletContext'

export function WalletSelector() {
  const {
    wallets,
    currentWallet,
    hasWallets,
    isLoading,
    errorMessage,
    selectWallet,
  } = useWallet()

  const handleChange = (event) => {
    void selectWallet(event.target.value)
  }

  return (
    <div className="min-w-52">
      <label
        htmlFor="wallet-selector"
        className="text-xs font-medium text-zinc-500"
      >
        Carteira atual
      </label>

      <select
        id="wallet-selector"
        value={currentWallet?.id ?? ''}
        onChange={handleChange}
        disabled={isLoading || !hasWallets}
        aria-describedby={errorMessage ? 'wallet-selector-error' : undefined}
        aria-invalid={errorMessage ? true : undefined}
        className="mt-1 h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
      >
        {isLoading ? (
          <option value="">Carregando...</option>
        ) : null}

        {!isLoading && !hasWallets ? (
          <option value="">Nenhuma carteira</option>
        ) : null}

        {wallets.map((wallet) => (
          <option key={wallet.id} value={wallet.id}>
            {wallet.name}
          </option>
        ))}
      </select>

      {errorMessage ? (
        <p id="wallet-selector-error" className="mt-1 text-xs text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
