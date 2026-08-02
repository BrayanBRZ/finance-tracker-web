import { useState } from "react";
import { ChevronRight, KeyRound, LogOut, UserRound } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UserMenu({
  name,
  isLoggingOut,
  onChangePassword,
  onLogout,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-8 w-full justify-start gap-3 px-3 text-sidebar-foreground data-[state=open]:bg-sidebar-accent/70"
          aria-label={`Abrir menu de ${name ?? "usuário"}`}
        >
          <UserRound className="size-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-left">
            {name ?? "Usuário"}
          </span>
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "-rotate-90",
            )}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className="z-50 w-(--radix-dropdown-menu-trigger-width) rounded-(--radius) border border-border/60 bg-popover/95 p-1 text-popover-foreground shadow-md backdrop-blur-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=top]:slide-in-from-bottom-2"
        >
          <DropdownMenuPrimitive.Item
            onSelect={onChangePassword}
            className={cn(
              "flex h-8 cursor-pointer items-center gap-3 rounded-(--radius) px-2 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
            )}
          >
            <KeyRound className="size-4 shrink-0" aria-hidden="true" />
            Alterar senha
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />
          <DropdownMenuPrimitive.Item
            disabled={isLoggingOut}
            onSelect={() => void onLogout()}
            className={cn(
              "flex h-8 cursor-pointer items-center gap-3 rounded-(--radius) px-2 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            )}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {isLoggingOut ? "Saindo..." : "Sair"}
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
