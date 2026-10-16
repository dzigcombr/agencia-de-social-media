import { createContext, useContext, useState, type ReactNode } from "react"
import type { Client, ScreenId } from "@/types"
import { clients, currentUser } from "@/data/mock"

interface AppState {
  screen: ScreenId
  navigate: (screen: ScreenId) => void
  client: Client | null
  selectClient: (client: Client) => void
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  clients: Client[]
  currentUser: typeof currentUser
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenId>("login")
  const [client, setClient] = useState<Client | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const navigate = (s: ScreenId) => {
    if (!isAuthenticated && s !== "login") return
    setScreen(s)
  }

  const login = () => {
    setIsAuthenticated(true)
    setScreen("client-select")
  }

  const logout = () => {
    setIsAuthenticated(false)
    setClient(null)
    setScreen("login")
  }

  const selectClient = (c: Client) => {
    setClient(c)
    setScreen("dashboard")
  }

  return (
    <AppContext.Provider
      value={{ screen, navigate, client, selectClient, isAuthenticated, login, logout, clients, currentUser }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
