import { Label } from '@/components/ui/label'
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
    <div className="min-w-52">
      <Label
        htmlFor="wallet-selector"
        className="text-muted-foreground text-xs"
      >
        Carteira atual
      </Label>

      <Select
        value={currentWallet?.id ?? undefined}
        onValueChange={(walletId) => void selectWallet(walletId)}
        disabled={isLoading || !hasWallets}
      >
        <SelectTrigger
          id="wallet-selector"
          className="mt-1 w-full"
          aria-describedby={errorMessage ? 'wallet-selector-error' : undefined}
          aria-invalid={errorMessage ? true : undefined}
        >
          <SelectValue
            placeholder={isLoading ? 'Carregando...' : 'Nenhuma carteira'}
          />
        </SelectTrigger>

        <SelectContent>
          {wallets.map((wallet) => (
            <SelectItem key={wallet.id} value={wallet.id}>
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
