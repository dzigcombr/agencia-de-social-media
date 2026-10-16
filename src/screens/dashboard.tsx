import { useMemo } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  Users,
  Eye,
  MousePointerClick,
  Heart,
  TrendingUp,
  ArrowUpRight,
  Trophy,
  Sparkles,
} from "lucide-react"
import { PlatformIcon } from "@/components/social-icons"
import { useApp } from "@/context/app-context"
import { getMetricSeries, getPublications, getBaseline, getCurrentProfile, getTimeline } from "@/data/mock"
import { MetricCard, SectionHeader } from "@/components/shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatNumber, formatPercent, delta, formatDelta, formatDate, formatDateShort } from "@/lib/format"
import type { Publication } from "@/types"

const chartConfig = {
  followers: { label: "Seguidores", color: "var(--chart-1)" },
  reach: { label: "Alcance", color: "var(--chart-2)" },
  engagement: { label: "Engajamento", color: "var(--chart-3)" },
} satisfies ChartConfig



export function DashboardScreen() {
  const { client, navigate } = useApp()
  if (!client) return null

  const series = getMetricSeries(client.id)
  const pubs = getPublications(client.id)
  const baseline = getBaseline(client.id)
  const current = getCurrentProfile(client.id)
  const timeline = getTimeline(client.id)

  const lastPoint = series[series.length - 1]
  const prevPoint = series[series.length - 2] ?? series[0]
  const growthPct = delta(current.followers, baseline.followers)

  const topContent = useMemo(
    () => [...pubs].sort((a, b) => b.reach - a.reach).slice(0, 5),
    [pubs]
  )

  const monthlyData = series.map((p) => ({
    month: formatDateShort(p.date).replace(".", ""),
    followers: p.followers,
    reach: Math.round(p.reach / 1000),
    engagement: p.engagement,
  }))

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Dashboard"
        description={`Visão executiva de ${client.name} · ${client.primaryAccount.handle}`}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate("baseline")}>
            <TrendingUp className="size-4" />
            Ver evolução completa
          </Button>
        }
      />

      {/* Baseline evolution hero band */}
      <BaselineEvolutionBand
        baselineDate={baseline.capturedAt}
        baselineFollowers={baseline.followers}
        currentFollowers={current.followers}
        growthPct={growthPct}
        onSeeDetails={() => navigate("baseline")}
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Seguidores" value={lastPoint.followers} format="compact" previousValue={prevPoint.followers} icon={Users} accent />
        <MetricCard label="Alcance (30d)" value={lastPoint.reach} format="compact" previousValue={prevPoint.reach} icon={Eye} />
        <MetricCard label="Engajamento" value={lastPoint.engagement} format="compact" previousValue={prevPoint.engagement} icon={Heart} />
        <MetricCard label="Cliques na bio" value={lastPoint.bioClicks} format="compact" previousValue={prevPoint.bioClicks} icon={MousePointerClick} />
      </div>

      {/* Growth chart + Platform split */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Crescimento de seguidores e alcance</CardTitle>
            <CardDescription>Evolução desde o baseline em {formatDate(baseline.capturedAt)}</CardDescription>
            <CardAction>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="size-3 text-success" />
                {formatDelta(growthPct)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={monthlyData} accessibilityLayer margin={{ left: 4, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="fillFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-followers)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-followers)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-reach)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--color-reach)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="reach" stroke="var(--color-reach)" strokeWidth={2} fill="url(#fillReach)" />
                <Area type="monotone" dataKey="followers" stroke="var(--color-followers)" strokeWidth={2.5} fill="url(#fillFollowers)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engajamento mensal</CardTitle>
            <CardDescription>Interações totais por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={monthlyData} accessibilityLayer margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top content ranking + Timeline mini */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="size-4.5 text-warning" />
              Melhores conteúdos
            </CardTitle>
            <CardDescription>Ranking por alcance nos últimos 90 dias</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {topContent.map((pub, i) => (
              <ContentRow key={pub.id} pub={pub} rank={i + 1} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linha do tempo</CardTitle>
            <CardDescription>Eventos recentes</CardDescription>
            <CardAction>
              <Button variant="ghost" size="xs" onClick={() => navigate("baseline")}>
                Ver tudo
                <ArrowUpRight className="size-3" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              {timeline.slice(-4).reverse().map((event, i) => (
                <div key={event.id} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`size-2.5 rounded-full ${i === 0 ? "bg-primary" : "bg-border"}`} />
                    {i < timeline.slice(-4).length - 1 && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{event.label}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                    {event.value && (
                      <Badge variant="outline" className="mt-0.5 w-fit text-[10px]">{event.metric}: {event.value}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI prompt CTA */}
      <Card className="overflow-hidden border-primary/20 bg-primary/[0.02]">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">Precisa de inspiração?</span>
              <span className="text-sm text-muted-foreground">
                Gere legendas, roteiros e ideias de conteúdo com IA assistiva.
              </span>
            </div>
          </div>
          <Button onClick={() => navigate("ai")} className="shrink-0">
            <Sparkles className="size-4" />
            Abrir IA
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function BaselineEvolutionBand({
  baselineDate,
  baselineFollowers,
  currentFollowers,
  growthPct,
  onSeeDetails,
}: {
  baselineDate: string
  baselineFollowers: number
  currentFollowers: number
  growthPct: number
  onSeeDetails: () => void
}) {
  return (
    <Card className="overflow-hidden border-primary/20 py-0">
      <div className="flex flex-col gap-0 sm:flex-row">
        <div className="flex flex-1 items-center gap-4 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold tracking-wide text-primary uppercase">Baseline do perfil</span>
            <span className="text-sm text-muted-foreground">
              De <span className="font-bold text-foreground tabular">{formatNumber(baselineFollowers)}</span> em{" "}
              {formatDate(baselineDate, { day: "2-digit", month: "short" })} para{" "}
              <span className="font-bold text-foreground tabular">{formatNumber(currentFollowers)}</span> hoje
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 border-t border-border/60 px-5 py-4 sm:border-l sm:border-t-0">
          <div className="flex flex-col">
            <span className="text-2xl font-bold tabular text-success">{formatDelta(growthPct)}</span>
            <span className="text-xs text-muted-foreground">crescimento total</span>
          </div>
          <Button variant="outline" size="sm" onClick={onSeeDetails} className="ml-auto sm:ml-0">
            Ver antes e depois
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function ContentRow({ pub, rank }: { pub: Publication; rank: number }) {
  const renderPlatformIcon = () => <PlatformIcon platform={pub.accountPlatform} className="size-3" />
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/40">
      <div className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${rank === 1 ? "bg-warning/15 text-warning-foreground" : "bg-muted text-muted-foreground"}`}>
        {rank}
      </div>
      <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        {pub.contentType === "reel" ? "▶" : pub.contentType === "story" ? "○" : "□"}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">{pub.caption}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {renderPlatformIcon()}
          <span className="capitalize">{pub.contentType}</span>
          <span>·</span>
          <span>{formatDateShort(pub.postedAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-right">
        <div className="flex flex-col">
          <span className="text-sm font-bold tabular text-foreground">{formatNumber(pub.reach)}</span>
          <span className="text-[10px] text-muted-foreground">alcance</span>
        </div>
        <div className="hidden flex-col sm:flex">
          <span className="text-sm font-bold tabular text-foreground">{formatPercent(pub.engagementRate)}</span>
          <span className="text-[10px] text-muted-foreground">engaj.</span>
        </div>
      </div>
    </div>
  )
}
