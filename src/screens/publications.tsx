import { useMemo, useState } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Trophy,
  Filter,
} from "lucide-react"
import { PlatformIcon } from "@/components/social-icons"
import { useApp } from "@/context/app-context"
import { getPublications } from "@/data/mock"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatNumber, formatPercent, formatDateShort } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ContentType, Platform, Publication } from "@/types"



const typeLabels: Record<ContentType, string> = {
  post: "Post",
  reel: "Reels",
  story: "Story",
}

export function PublicationsScreen() {
  const { client } = useApp()
  if (!client) return null

  const pubs = getPublications(client.id)
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all")
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all")

  const filtered = useMemo(
    () =>
      pubs.filter(
        (p) =>
          (typeFilter === "all" || p.contentType === typeFilter) &&
          (platformFilter === "all" || p.accountPlatform === platformFilter)
      ),
    [pubs, typeFilter, platformFilter]
  )

  const ranked = useMemo(
    () => [...filtered].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 3),
    [filtered]
  )

  const totalReach = filtered.reduce((s, p) => s + p.reach, 0)
  const avgEngagement = filtered.length
    ? filtered.reduce((s, p) => s + p.engagementRate, 0) / filtered.length
    : 0

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Publicações"
        description="Posts, Reels e Stories com métricas de performance"
        action={
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ContentType | "all")}>
              <SelectTrigger className="h-9 w-32 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="reel">Reels</SelectItem>
                <SelectItem value="story">Stories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as Platform | "all")}>
              <SelectTrigger className="h-9 w-36 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plataformas</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="py-0">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Publicações</span>
              <span className="text-2xl font-bold tabular text-foreground">{filtered.length}</span>
            </div>
            <Filter className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Alcance total</span>
              <span className="text-2xl font-bold tabular text-foreground">{formatNumber(totalReach)}</span>
            </div>
            <Eye className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Engaj. médio</span>
              <span className="text-2xl font-bold tabular text-foreground">{formatPercent(avgEngagement)}</span>
            </div>
            <Heart className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Top performers */}
      {ranked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4.5 text-warning" />
              Ranking de performance
            </CardTitle>
            <CardDescription>Conteúdos com maior taxa de engajamento</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {ranked.map((pub, i) => (
              <div key={pub.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3.5">
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-bold", i === 0 ? "bg-warning/15 text-warning-foreground" : "bg-muted text-muted-foreground")}>
                  {i + 1}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-foreground">{pub.caption}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{typeLabels[pub.contentType]}</Badge>
                    <span className="text-xs font-bold text-success">{formatPercent(pub.engagementRate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Publication cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pub) => (
          <PublicationCard key={pub.id} pub={pub} />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Filter className="size-8 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Nenhuma publicação encontrada</span>
            <span className="text-xs text-muted-foreground">Ajuste os filtros para ver mais resultados.</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PublicationCard({ pub }: { pub: Publication }) {
  const renderPlatformIcon = () => <PlatformIcon platform={pub.accountPlatform} className="size-3.5" />
  return (
    <Card className="gap-0 overflow-hidden py-0 transition-all hover:shadow-premium">
      {/* Thumbnail */}
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-muted/60 to-muted/30">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {pub.contentType === "reel" ? (
            <div className="flex size-12 items-center justify-center rounded-full bg-background/80">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6"><path d="M8 5v14l11-7z" /></svg>
            </div>
          ) : pub.contentType === "story" ? (
            <div className="flex size-12 items-center justify-center rounded-full border-2 border-background/80">
              <div className="size-2 rounded-full bg-background/80" />
            </div>
          ) : (
            <div className="flex size-12 items-center justify-center rounded-lg bg-background/80">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {renderPlatformIcon()}
          <Badge variant="outline" className="text-[10px]">{typeLabels[pub.contentType]}</Badge>
          <span className="ml-auto text-xs text-muted-foreground">{formatDateShort(pub.postedAt)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-foreground">{pub.caption}</p>

        <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
          <Metric icon={Heart} value={pub.likes} label="Curtidas" />
          <Metric icon={MessageCircle} value={pub.comments} label="Coment." />
          <Metric icon={Share2} value={pub.shares} label="Compart." />
          <Metric icon={Bookmark} value={pub.saves} label="Salv." />
          <Metric icon={Eye} value={pub.reach} label="Alcance" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-bold tabular text-success">{formatPercent(pub.engagementRate)}</span>
            <span className="text-[10px] text-muted-foreground">engaj.</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Metric({ icon: Icon, value, label }: { icon: typeof Heart; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className="size-3.5 text-muted-foreground" />
      <span className="text-sm font-bold tabular text-foreground">{formatNumber(value)}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}
