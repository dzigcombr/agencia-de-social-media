import {
  LayoutDashboard,
  Gauge,
  Newspaper,
  CalendarDays,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  Settings,
  ChevronLeft,
} from "lucide-react"
import { useApp } from "@/context/app-context"
import { BrandLogo, ClientAvatar } from "@/components/brand"
import type { ScreenId } from "@/types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems: { id: ScreenId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "baseline", label: "Baseline do Perfil", icon: Gauge },
  { id: "publications", label: "Publicações", icon: Newspaper },
  { id: "calendar", label: "Calendário", icon: CalendarDays },
  { id: "approvals", label: "Aprovações", icon: CheckCircle2 },
  { id: "library", label: "Biblioteca", icon: FolderOpen },
  { id: "ai", label: "IA Assistiva", icon: Sparkles },
]

export function AppSidebar() {
  const { screen, navigate, client, currentUser, logout } = useApp()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-1.5 py-1 group-data-[collapsible=icon]:justify-center">
          <BrandLogo />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {client && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Cliente selecionado</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent/60 px-2.5 py-2">
                <ClientAvatar initials={client.logoInitials} color={client.brandColor} size="sm" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">{client.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {client.primaryAccount.handle}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1.5 w-full justify-start text-xs text-muted-foreground"
                onClick={() => navigate("client-select")}
              >
                <ChevronLeft className="size-3.5" />
                Trocar cliente
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={screen === item.id}
                    onClick={() => navigate(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={screen === "settings"}
              onClick={() => navigate("settings")}
              tooltip="Configurações"
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5 group-data-[collapsible=icon]:hidden">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold text-sidebar-foreground">{currentUser.name}</span>
                <span className="truncate text-[10px] text-muted-foreground">{currentUser.role}</span>
              </div>
              <Button variant="ghost" size="icon-xs" className="ml-auto text-muted-foreground" onClick={logout}>
                <span className="sr-only">Sair</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
