import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { delta, formatDelta, formatNumber, formatPercent } from "@/lib/format"

export function MetricCard({
  label,
  value,
  format,
  previousValue,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  format: "number" | "percent" | "compact"
  previousValue: number
  icon: LucideIcon
  accent?: boolean
}) {
  const pct = delta(value, previousValue)
  const positive = pct >= 0
  const formatted =
    format === "percent" ? formatPercent(value) : format === "compact" ? formatNumber(value) : formatNumber(value)

  return (
    <Card className={cn("gap-0 overflow-hidden py-0", accent && "border-primary/30 bg-primary/[0.03]")}>
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        </div>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </div>
      <div className="px-5 pb-5 pt-3">
        <div className="text-2xl font-bold tracking-tight tabular text-foreground">{formatted}</div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold tabular",
              positive ? "text-success" : "text-destructive"
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {formatDelta(Math.abs(pct))}
          </span>
          <span className="text-xs text-muted-foreground">vs período anterior</span>
        </div>
      </div>
    </Card>
  )
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}
