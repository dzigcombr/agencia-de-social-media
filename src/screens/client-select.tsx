import { ArrowRight, Plus, TrendingUp, Users } from "lucide-react"
import { useApp } from "@/context/app-context"
import { getCurrentProfile, getBaseline, getTimeline } from "@/data/mock"
import { BrandLogo, ClientAvatar } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber, formatDate, delta } from "@/lib/format"
import type { Client } from "@/types"

export function ClientSelectScreen() {
  const { clients, selectClient, navigate, currentUser, logout } = useApp()

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:block">{currentUser.name}</span>
          <Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Users className="size-3.5" />
            {clients.length} clientes ativos
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Selecione um cliente</h1>
          <p className="max-w-xl text-muted-foreground">
            Escolha qual cliente você deseja gerenciar. Cada cliente possui seu próprio portal com métricas,
            baseline e histórico de evolução.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} onSelect={() => selectClient(client)} />
          ))}

          {/* Onboarding card */}
          <button
            onClick={() => navigate("onboarding")}
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/80 p-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.02]"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Plus className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">Adicionar novo cliente</span>
              <span className="text-xs text-muted-foreground">Inicie o onboarding e capture o baseline</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  )
}

function ClientCard({ client, onSelect }: { client: Client; onSelect: () => void }) {
  const baseline = getBaseline(client.id)
  const current = getCurrentProfile(client.id)
  const growth = delta(current.followers, baseline.followers)
  const timeline = getTimeline(client.id)

  return (
    <Card className="group cursor-pointer gap-0 overflow-hidden py-0 transition-all hover:border-primary/30 hover:shadow-premium" onClick={onSelect}>
      <div className="flex items-start gap-4 p-5">
        <ClientAvatar initials={client.logoInitials} color={client.brandColor} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-foreground">{client.name}</h3>
            <Badge variant="outline" className="text-[10px] font-medium">{client.planTier}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">{client.primaryAccount.handle}</span>
          <span className="text-xs text-muted-foreground">{client.industry}</span>
        </div>
        <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <div className="flex items-center gap-4 border-t border-border/60 bg-muted/30 px-5 py-3.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Seguidores</span>
          <span className="text-sm font-bold tabular text-foreground">{formatNumber(current.followers)}</span>
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Crescimento</span>
          <span className="flex items-center gap-1 text-sm font-bold tabular text-success">
            <TrendingUp className="size-3.5" />
            +{growth.toFixed(0)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Baseline</span>
          <span className="text-xs font-medium text-foreground">{formatDate(baseline.capturedAt, { day: "2-digit", month: "short" })}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Eventos</span>
          <span className="text-sm font-bold tabular text-foreground">{timeline.length}</span>
        </div>
      </div>
    </Card>
  )
}
