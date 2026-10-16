import { useState } from "react"
import {
  Check,
  X,
  MessageCircle,
  Clock,
  FileEdit,
  Send,
} from "lucide-react"
import { PlatformIcon } from "@/components/social-icons"
import { useApp } from "@/context/app-context"
import { getApprovals } from "@/data/mock"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDate, relativeDays } from "@/lib/format"
import type { ApprovalRequest, ApprovalStatus } from "@/types"

const statusConfig: Record<ApprovalStatus, { label: string; color: string; icon: typeof Check }> = {
  pending: { label: "Aguardando", color: "bg-warning/15 text-warning-foreground", icon: Clock },
  approved: { label: "Aprovado", color: "bg-success/15 text-success", icon: Check },
  changes_requested: { label: "Ajustes solicitados", color: "bg-destructive/15 text-destructive", icon: FileEdit },
}



export function ApprovalsScreen() {
  const { client } = useApp()
  if (!client) return null

  const approvals = getApprovals(client.id)
  const [selectedId, setSelectedId] = useState(approvals[0]?.id ?? "")
  const [comment, setComment] = useState("")

  const selected = approvals.find((a) => a.id === selectedId) ?? approvals[0]

  const pendingCount = approvals.filter((a) => a.status === "pending").length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Aprovações"
        description="Revise e aprove conteúdos antes da publicação"
        action={
          <Badge variant="outline" className="gap-1.5 text-xs">
            <Clock className="size-3 text-warning" />
            {pendingCount} aguardando
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        {/* List */}
        <div className="flex flex-col gap-3">
          {approvals.map((req) => {
            const cfg = statusConfig[req.status]
            const Icon = cfg.icon
            return (
              <Card
                key={req.id}
                className={cn(
                  "cursor-pointer gap-0 py-0 transition-all hover:shadow-premium",
                  selectedId === req.id && "border-primary ring-1 ring-primary/20"
                )}
                onClick={() => setSelectedId(req.id)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {req.contentType === "reel" ? "▶" : req.contentType === "story" ? "○" : "□"}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-sm font-semibold text-foreground">{req.title}</span>
                    <span className="text-xs text-muted-foreground">{relativeDays(req.submittedAt)} · {req.submittedBy}</span>
                    <Badge variant="outline" className={cn("mt-0.5 w-fit gap-1 text-[10px]", cfg.color)}>
                      <Icon className="size-2.5" />
                      {cfg.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detail */}
        {selected && (
          <ApprovalDetail
            key={selected.id}
            request={selected}
            comment={comment}
            setComment={setComment}
          />
        )}
      </div>
    </div>
  )
}

function ApprovalDetail({
  request,
  comment,
  setComment,
}: {
  request: ApprovalRequest
  comment: string
  setComment: (v: string) => void
}) {
  const cfg = statusConfig[request.status]
  const renderPlatformIcon = () => <PlatformIcon platform={request.platform} className="size-3.5" />

  return (
    <Card className="flex flex-col gap-0 py-0">
      {/* Preview */}
      <div className="flex aspect-video items-center justify-center rounded-t-xl bg-gradient-to-br from-muted/60 to-muted/30">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="flex size-14 items-center justify-center rounded-full bg-background/80">
            {request.contentType === "reel" ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-7"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-foreground">{request.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {renderPlatformIcon()}
              <span className="capitalize">{request.contentType}</span>
              <span>·</span>
              <span>Enviado {formatDate(request.submittedAt)}</span>
            </div>
          </div>
          <Badge variant="outline" className={cn("gap-1 text-xs", cfg.color)}>
            {cfg.label}
          </Badge>
        </div>

        {/* Caption */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
          <span className="text-xs font-semibold text-muted-foreground">Legenda</span>
          <p className="mt-1 text-sm text-foreground">{request.caption}</p>
        </div>

        {/* Versions */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Histórico de versões</span>
          <div className="flex flex-col gap-1.5">
            {request.versions.map((v) => (
              <div key={v.version} className="flex items-center gap-2 text-xs">
                <Badge variant="secondary" className="text-[10px]">v{v.version}</Badge>
                <span className="text-muted-foreground">{formatDate(v.createdAt)} · {v.author}</span>
                <span className="truncate text-foreground">{v.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MessageCircle className="size-3.5" />
            Comentários ({request.comments.length})
          </span>
          <div className="flex flex-col gap-3">
            {request.comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className={cn("text-[10px] font-semibold", c.authorRole === "client" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    {c.author.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{c.author}</span>
                    <Badge variant="outline" className="text-[9px]">{c.authorRole === "client" ? "Cliente" : "Agência"}</Badge>
                    <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment input */}
        <div className="flex flex-col gap-2 border-t border-border/60 pt-4">
          <Textarea
            placeholder="Adicione um comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="resize-none"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <X className="size-4" />
              Solicitar ajustes
            </Button>
            <Button size="sm" className="gap-1.5">
              <Check className="size-4" />
              Aprovar conteúdo
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto gap-1.5">
              <Send className="size-3.5" />
              Comentar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
