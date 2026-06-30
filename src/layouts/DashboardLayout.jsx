import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSession } from '@/context/sessionContext'
import { Button } from '@/components/ui/button'
import { WalletSelector } from '@/components/wallets/WalletSelector'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
]

export function DashboardLayout() {
  const { session, handleLogout } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)
    await handleLogout()
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Finance Tracker
            </p>
            <p className="text-sm text-muted-foreground">
              Olá, {session?.user.name}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <WalletSelector />

            <nav aria-label="Navegação principal">
              <ul className="flex gap-2">
                {navigationItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          'rounded-lg px-3 py-2 text-sm font-medium transition',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        ].join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <Button
              type="button"
              variant="outline"
              onClick={logout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
