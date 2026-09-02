import { WalletMinimal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  return (
    <div>
      <Select
        value={currentWallet?.id ?? ''}
        onValueChange={(walletId) => void selectWallet(walletId)}
        disabled={isLoading || !hasWallets}
      >
        <SelectTrigger
          id="wallet-selector"
          aria-describedby={errorMessage ? 'wallet-selector-error' : undefined}
          aria-invalid={errorMessage ? true : undefined}
        >
          <SelectValue
            className="flex-1"
            placeholder={isLoading ? 'Carregando...' : 'Nenhuma carteira'}
          />
        </SelectTrigger>

        <SelectContent>
          {wallets.map((wallet) => (
            <SelectItem key={wallet.id} value={wallet.id}>
              <WalletMinimal aria-hidden="true" />
              {wallet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errorMessage ? (
        <p id="wallet-selector-error" className="text-destructive mt-1 text-xs">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
