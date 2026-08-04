import {
  ChevronUpIcon,
  KeyRoundIcon,
  LogOutIcon,
  UserRoundIcon,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function UserMenu({ name, isLoggingOut, onChangePassword, onLogout }) {
  const handleValueChange = (value) => {
    if (value === 'change-password') {
      onChangePassword()
    }

    if (value === 'logout') {
      void onLogout()
    }
  }

  return (
    <Select value="" onValueChange={handleValueChange}>
      <SelectTrigger
        icon={ChevronUpIcon}
        className="data-placeholder:text-foreground"
        aria-label={`Abrir menu de ${name ?? 'usuário'}`}
      >
        <SelectValue
          placeholder={
            <>
              <UserRoundIcon aria-hidden="true" />
              {name ?? 'Usuário'}
            </>
          }
        />
      </SelectTrigger>

      <SelectContent side="top" avoidCollisions={false}>
        <SelectItem value="change-password">
          <KeyRoundIcon aria-hidden="true" />
          Alterar senha
        </SelectItem>
        <SelectItem value="logout" disabled={isLoggingOut}>
          <LogOutIcon aria-hidden="true" />
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
