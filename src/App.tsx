import { AppProvider, useApp } from "@/context/app-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { LoginScreen } from "@/screens/login"
import { ClientSelectScreen } from "@/screens/client-select"
import { OnboardingScreen } from "@/screens/onboarding"
import { DashboardScreen } from "@/screens/dashboard"
import { BaselineScreen } from "@/screens/baseline"
import { PublicationsScreen } from "@/screens/publications"
import { CalendarScreen } from "@/screens/calendar"
import { ApprovalsScreen } from "@/screens/approvals"
import { LibraryScreen } from "@/screens/library"
import { AIScreen } from "@/screens/ai"
import { SettingsScreen } from "@/screens/settings"
import type { ScreenId } from "@/types"

const appScreens: ScreenId[] = [
  "dashboard",
  "baseline",
  "publications",
  "calendar",
  "approvals",
  "library",
  "ai",
  "settings",
]

function ScreenRouter() {
  const { screen, isAuthenticated, client } = useApp()

  if (!isAuthenticated || screen === "login") {
    return <LoginScreen />
  }

  if (screen === "client-select") {
    return <ClientSelectScreen />
  }

  if (screen === "onboarding") {
    return <OnboardingScreen />
  }

  // App screens require a selected client
  if (client && appScreens.includes(screen)) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppTopbar />
          <div className="flex-1">
            {screen === "dashboard" && <DashboardScreen />}
            {screen === "baseline" && <BaselineScreen />}
            {screen === "publications" && <PublicationsScreen />}
            {screen === "calendar" && <CalendarScreen />}
            {screen === "approvals" && <ApprovalsScreen />}
            {screen === "library" && <LibraryScreen />}
            {screen === "ai" && <AIScreen />}
            {screen === "settings" && <SettingsScreen />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return <ClientSelectScreen />
}

export function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  )
}

export default App
