import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Menu,
  Tags,
  WalletCards,
} from "lucide-react";
import { useSession } from "@/context/sessionContext";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { WalletSelector } from "@/components/wallets/WalletSelector";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { to: "/categorias", label: "Categorias", icon: Tags },
  { to: "/carteiras", label: "Carteiras", icon: WalletCards },
];

export function AppLayout() {
  const { session, handleLogout } = useSession();
  const { pathname } = useLocation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    await handleLogout();
  };

  const columnWidth = "w-50";
  const currentPage =
    navigationItems.find((item) => item.to === pathname)?.label ?? "Perfil";

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-30 flex justify-start bg-foreground/10 opacity-0 transition-opacity md:pointer-events-auto md:static md:w-50 md:shrink-0 md:opacity-100 md:bg-transparent",
          isMenuVisible && "pointer-events-auto opacity-100",
        )}
        onClick={() => setIsMenuVisible(false)}
      >
        <aside
          className={cn(
            columnWidth,
            "flex h-full -translate-x-full flex-col border-r border-sidebar-border/60 bg-sidebar/60 p-3 pt-15 backdrop-blur-md transition-transform md:w-full md:translate-x-0",
            isMenuVisible && "translate-x-0 shadow-xl md:shadow-none",
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <nav
            aria-label="Navegação principal"
            className="flex min-h-0 flex-1 flex-col justify-between"
          >
            <div>
              <Label className="mb-2 ml-2 text-xs font-bold text-muted-foreground">
                Navegação
              </Label>

              <ul className="flex flex-col gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setIsMenuVisible(false)}
                        className={({ isActive }) =>
                          [
                            "flex h-8 items-center gap-3 rounded-(--radius) px-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/70",
                          ].join(" ")
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
                  );
                })}
              </ul>

              <div className="mt-3 border-t border-sidebar-border pt-3">
                <Label
                  htmlFor="wallet-selector"
                  className="mb-2 ml-1 text-xs font-bold text-muted-foreground"
                >
                  Carteira
                </Label>
                <WalletSelector />
              </div>
            </div>

            <div className="border-t border-sidebar-border pt-3">
              <UserMenu
                name={session?.user?.name}
                isLoggingOut={isLoggingOut}
                onLogout={logout}
              />
            </div>
          </nav>
        </aside>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="relative z-20 flex h-12 shrink-0 items-center border-b border-sidebar-border/60 bg-sidebar/60 backdrop-blur-md">
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

        <main className="scrollbar-minimal min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
