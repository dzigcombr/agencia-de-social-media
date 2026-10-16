import { Search, Bell, ChevronDown } from "lucide-react"
import { useApp } from "@/context/app-context"
import { ClientAvatar } from "@/components/brand"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppTopbar() {
  const { client, navigate, logout } = useApp()
  if (!client) return null

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="hidden flex-col sm:flex">
        <span className="text-sm font-semibold text-foreground">{client.name}</span>
        <span className="text-xs text-muted-foreground">{client.industry} · {client.planTier}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="h-9 w-56 border-border/60 bg-muted/40 pl-9 text-sm"
          />
        </div>

        <Button variant="ghost" size="icon-sm" className="relative text-muted-foreground">
          <Bell className="size-4.5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5">
              <ClientAvatar initials={client.logoInitials} color={client.brandColor} size="sm" />
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Cliente atual</DropdownMenuLabel>
            <DropdownMenuItem className="font-medium">{client.name}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("client-select")}>Trocar cliente</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("settings")}>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>Sair da conta</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export { Badge }
