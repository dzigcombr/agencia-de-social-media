import {
  Gauge,
  Camera,
  FileText,
  Download,
  TrendingUp,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Megaphone,
  Flag,
  ClipboardList,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { useApp } from "@/context/app-context"
import { getBaseline, getCurrentProfile, getTimeline } from "@/data/mock"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatNumber, formatFull, formatDate, delta, formatDelta, relativeDays } from "@/lib/format"
import type { TimelineEvent } from "@/types"
import { cn } from "@/lib/utils"

const timelineIcons: Record<TimelineEvent["type"], LucideIcon> = {
  baseline: Gauge,
  milestone: Flag,
  campaign: Megaphone,
  snapshot: Camera,
  contract: ClipboardList,
}

const timelineColors: Record<TimelineEvent["type"], string> = {
  baseline: "bg-primary/10 text-primary",
  milestone: "bg-success/10 text-success",
  campaign: "bg-warning/10 text-warning-foreground",
  snapshot: "bg-muted text-muted-foreground",
  contract: "bg-chart-2/10 text-chart-2",
}

export function BaselineScreen() {
  const { client } = useApp()
  if (!client) return null

  const baseline = getBaseline(client.id)
  const current = getCurrentProfile(client.id)
  const timeline = getTimeline(client.id)
  const growthFollowers = delta(current.followers, baseline.followers)

  const comparisons = [
    { label: "Seguidores", baseline: baseline.followers, current: current.followers, format: "number" as const },
    { label: "Posts", baseline: baseline.postsCount, current: current.postsCount, format: "number" as const },
    { label: "Engajamento", baseline: 1.8, current: current.engagementRate, format: "percent" as const },
    { label: "Cliques na bio", baseline: 120, current: current.bioClicks, format: "number" as const },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Baseline do Perfil"
        description={`O registro inicial de ${client.name} e sua evolução desde ${formatDate(baseline.capturedAt)}`}
        action={
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Exportar relatório
          </Button>
        }
      />

      {/* Before / After hero comparison */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Before */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 text-xs">
                <Calendar className="size-3" />
                {formatDate(baseline.capturedAt)}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">Estado inicial</span>
            </div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="size-5 text-muted-foreground" />
              Antes do contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ProfileSnapshot
              displayName={baseline.displayName}
              handle={baseline.handle}
              bio={baseline.bio}
              bioLink={baseline.bioLink}
              isVerified={baseline.isVerified}
              category={baseline.category}
              avatarInitials={client.logoInitials}
              avatarColor={client.brandColor}
              followers={baseline.followers}
              postsCount={baseline.postsCount}
              following={baseline.following}
            />
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
              <span className="text-xs font-semibold text-muted-foreground">Observações do baseline</span>
              <p className="mt-1 text-sm text-foreground">{baseline.notes}</p>
            </div>
          </CardContent>
        </Card>

        {/* After */}
        <Card className="overflow-hidden border-primary/30">
          <CardHeader className="border-b border-border/60 bg-primary/[0.04]">
            <div className="flex items-center gap-2">
              <Badge className="gap-1 text-xs">
                <TrendingUp className="size-3" />
                Hoje · {relativeDays(timeline[timeline.length - 1].date)}
              </Badge>
              <span className="text-xs font-medium text-primary">Estado atual</span>
            </div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="size-5 text-primary" />
              Resultado atual
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ProfileSnapshot
              displayName={baseline.displayName}
              handle={baseline.handle}
              bio={baseline.bio}
              bioLink={baseline.bioLink}
              isVerified={baseline.isVerified}
              category={baseline.category}
              avatarInitials={client.logoInitials}
              avatarColor={client.brandColor}
              followers={current.followers}
              postsCount={current.postsCount}
              following={baseline.following}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-success/20 bg-success/[0.06] p-3.5">
                <span className="text-xs font-semibold text-success">Crescimento em seguidores</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular text-success">{formatDelta(growthFollowers)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatFull(baseline.followers)} → {formatFull(current.followers)}
                </span>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/[0.06] p-3.5">
                <span className="text-xs font-semibold text-primary">Novos seguidores</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular text-primary">+{formatNumber(current.followers - baseline.followers)}</span>
                </div>
                <span className="text-xs text-muted-foreground">desde o baseline</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric comparison table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparativo de métricas</CardTitle>
          <CardDescription>Antes vs. atual — a prova da evolução</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {comparisons.map((c) => {
              const pct = delta(c.current, c.baseline)
              const positive = pct >= 0
              const fmt = (n: number) => (c.format === "percent" ? `${n}%` : formatNumber(n))
              return (
                <div key={c.label} className="rounded-lg border border-border/60 p-4">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{c.label}</span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground tabular line-through/0">{fmt(c.baseline)}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                    <span className="text-lg font-bold tabular text-foreground">{fmt(c.current)}</span>
                  </div>
                  <span className={cn("mt-1.5 inline-flex items-center gap-0.5 text-xs font-semibold tabular", positive ? "text-success" : "text-destructive")}>
                    <TrendingUp className={cn("size-3", !positive && "rotate-180")} />
                    {formatDelta(Math.abs(pct))}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Evolution Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Linha do tempo da evolução</CardTitle>
          <CardDescription>Cada marco registrado desde o início do contrato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {timeline.map((event, i) => {
              const Icon = timelineIcons[event.type]
              const isLast = i === timeline.length - 1
              return (
                <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", timelineColors[event.type], isLast && "ring-4 ring-primary/10")}>
                      <Icon className="size-4.5" />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{event.label}</span>
                      {event.value && (
                        <Badge variant="secondary" className="text-[10px] gap-1">
                          <CheckCircle2 className="size-2.5" />
                          {event.metric}: {event.value}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                    <span className="mt-0.5 text-sm text-muted-foreground">{event.description}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Evidence files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evidências do baseline</CardTitle>
          <CardDescription>Documentos e screenshots que comprovam o estado inicial</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {baseline.evidenceFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {file.type === "pdf" ? <FileText className="size-5" /> : <Camera className="size-5" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
                <span className="text-xs text-muted-foreground">{file.size} · {formatDate(file.uploadedAt)}</span>
              </div>
              <Button variant="ghost" size="icon-sm">
                <Download className="size-4" />
              </Button>
            </div>
          ))}
          <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
            <Upload className="size-4" />
            Adicionar evidência
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileSnapshot({
  displayName,
  handle,
  bio,
  bioLink,
  isVerified,
  category,
  avatarInitials,
  avatarColor,
  followers,
  postsCount,
  following,
}: {
  displayName: string
  handle: string
  bio: string
  bioLink: string
  isVerified: boolean
  category: string
  avatarInitials: string
  avatarColor: string
  followers: number
  postsCount: number
  following: number
}) {
  return (
    <div className="flex gap-4">
      <Avatar className="size-16 shrink-0 rounded-xl">
        <AvatarFallback className="rounded-xl text-lg font-bold text-white" style={{ backgroundColor: avatarColor }}>
          {avatarInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold text-foreground">{displayName}</span>
          {isVerified && (
            <svg viewBox="0 0 24 24" className="size-4 text-primary" fill="currentColor">
              <path d="M12 2l2.4 1.8 3-.2 1 2.8 2.8 1-.2 3L22 12l-1.8 2.4.2 3-2.8 1-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8-2.8-1 .2-3L2 12l1.8-2.4-.2-3 2.8-1 1-2.8 3 .2L12 2z" />
              <path d="M9.5 12.5l1.8 1.8 3.2-3.2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{handle}</span>
        <span className="text-xs text-muted-foreground">{category}</span>
        <p className="mt-1 whitespace-pre-line text-sm text-foreground">{bio}</p>
        <a className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-primary">
          🔗 {bioLink}
        </a>
      </div>
      <div className="flex shrink-0 flex-col justify-start gap-3 text-right">
        <div className="flex flex-col">
          <span className="text-lg font-bold tabular text-foreground">{formatNumber(followers)}</span>
          <span className="text-[10px] text-muted-foreground">seguidores</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tabular text-foreground">{formatNumber(postsCount)}</span>
          <span className="text-[10px] text-muted-foreground">posts</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tabular text-foreground">{formatNumber(following)}</span>
          <span className="text-[10px] text-muted-foreground">seguindo</span>
        </div>
      </div>
    </div>
  )
}
