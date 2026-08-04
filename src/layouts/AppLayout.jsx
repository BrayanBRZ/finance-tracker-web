import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  LayoutDashboard,
  Menu,
  Tags,
  WalletCards,
} from 'lucide-react'
import { useSession } from '@/context/sessionContext'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/layout/UserMenu'
import { WalletSelector } from '@/components/wallets/WalletSelector'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const navigationItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { to: '/app/categorias', label: 'Categorias', icon: Tags },
  { to: '/app/carteira', label: 'Carteira', icon: WalletCards },
]

const pageNames = {
  '/app/perfil/senha': 'Alterar senha',
}

export function AppLayout() {
  const { session, handleLogout } = useSession()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)
    await handleLogout()
  }

  const columnWidth = 'w-50'
  const isDashboard = pathname === '/app/dashboard'
  const currentPage =
    navigationItems.find((item) => item.to === pathname)?.label ??
    pageNames[pathname] ??
    'Finance Tracker'

  return (
    <div className="bg-background text-foreground flex h-dvh overflow-hidden">
      <div
        className={cn(
          'bg-foreground/10 pointer-events-none absolute inset-0 z-30 flex justify-start opacity-0 transition-opacity md:pointer-events-auto md:static md:w-50 md:shrink-0 md:bg-transparent md:opacity-100',
          isMenuVisible && 'pointer-events-auto opacity-100',
        )}
        onClick={() => setIsMenuVisible(false)}
      >
        <aside
          className={cn(
            columnWidth,
            "bg-sidebar/60 after:bg-sidebar-border/60 relative flex h-full -translate-x-full flex-col p-3 pt-15 backdrop-blur-md transition-transform after:absolute after:top-12 after:right-0 after:bottom-0 after:w-px after:content-[''] md:w-full md:translate-x-0",
            isMenuVisible && 'translate-x-0 shadow-xl md:shadow-none',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <nav
            aria-label="Navegação principal"
            className="flex min-h-0 flex-1 flex-col justify-between"
          >
            <div>
              <Label className="text-muted-foreground mb-2 ml-2 text-xs font-bold">
                Navegação
              </Label>

              <ul className="flex flex-col gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setIsMenuVisible(false)}
                        className={({ isActive }) =>
                          [
                            'flex h-8 items-center gap-3 rounded-(--radius) px-3 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary ring-primary ring-1'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent/70',
                          ].join(' ')
                        }
                      >
                        <Icon
                          className="size-4 shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>

              <div className="border-sidebar-border mt-3 border-t pt-3">
                <Label
                  htmlFor="wallet-selector"
                  className="text-muted-foreground mb-2 ml-1 text-xs font-bold"
                >
                  Carteira
                </Label>
                <WalletSelector />
              </div>
            </div>

            <div className="border-sidebar-border border-t pt-3">
              <UserMenu
                name={session?.user?.name}
                isLoggingOut={isLoggingOut}
                onChangePassword={() => navigate('/app/perfil/senha')}
                onLogout={logout}
              />
            </div>
          </nav>
        </aside>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="border-sidebar-border/60 bg-sidebar/60 relative z-20 flex h-12 shrink-0 items-center border-b backdrop-blur-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-2 md:hidden"
            onClick={() => setIsMenuVisible((isVisible) => !isVisible)}
            aria-label="Abrir navegação"
          >
            <Menu aria-hidden="true" />
          </Button>

          <p className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center justify-center text-sm font-semibold md:-left-50">
            {currentPage}
          </p>
        </header>

        <main
          className={cn(
            'scrollbar-minimal min-h-0 min-w-0 flex-1',
            isDashboard
              ? 'overflow-y-auto'
              : 'overflow-y-auto lg:overflow-hidden',
          )}
        >
          <div className={cn('p-3 sm:p-4 md:p-6', !isDashboard && 'lg:h-full')}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
