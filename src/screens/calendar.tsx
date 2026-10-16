import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Paperclip,
  Clock,
  User,
} from "lucide-react"
import { PlatformIcon } from "@/components/social-icons"
import { useApp } from "@/context/app-context"
import { getCalendar } from "@/data/mock"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CalendarItem, ContentStatus } from "@/types"

const statusConfig: Record<ContentStatus, { label: string; color: string; dot: string }> = {
  draft: { label: "Rascunho", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  review: { label: "Revisão", color: "bg-warning/15 text-warning-foreground", dot: "bg-warning" },
  approved: { label: "Aprovado", color: "bg-success/15 text-success", dot: "bg-success" },
  scheduled: { label: "Agendado", color: "bg-chart-2/15 text-chart-2", dot: "bg-chart-2" },
  published: { label: "Publicado", color: "bg-primary/15 text-primary", dot: "bg-primary" },
}



const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function CalendarScreen() {
  const { client } = useApp()
  if (!client) return null

  const items = getCalendar(client.id)
  const [view, setView] = useState<"month" | "week">("month")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)) // August 2025

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthLabel = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const itemsByDate = items.reduce<Record<string, CalendarItem[]>>((acc, item) => {
    const key = item.date
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const navigateMonth = (dir: number) => setCurrentDate(new Date(year, month + dir, 1))
  const navigateWeek = (dir: number) => setCurrentDate(new Date(year, month, currentDate.getDate() + dir * 7))

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Calendário editorial"
        description="Pautas, agendamentos e status de conteúdo"
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setView("month")}
                className={cn("rounded-md px-3 py-1 text-xs font-medium transition-colors", view === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Mês
              </button>
              <button
                onClick={() => setView("week")}
                className={cn("rounded-md px-3 py-1 text-xs font-medium transition-colors", view === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Semana
              </button>
            </div>
            <Button size="sm">
              <Plus className="size-4" />
              Nova pauta
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:p-6">
          {/* Calendar header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold capitalize text-foreground">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => (view === "month" ? navigateMonth(-1) : navigateWeek(-1))}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setCurrentDate(new Date(2025, 7, 1))}>
                Hoje
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => (view === "month" ? navigateMonth(1) : navigateWeek(1))}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", cfg.dot)} />
                <span className="text-xs text-muted-foreground">{cfg.label}</span>
              </div>
            ))}
          </div>

          {view === "month" ? (
            <MonthView
              firstDay={firstDay}
              daysInMonth={daysInMonth}
              year={year}
              month={month}
              today={today}
              itemsByDate={itemsByDate}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              today={today}
              itemsByDate={itemsByDate}
            />
          )}
        </CardContent>
      </Card>

      {/* Upcoming items list */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-4 md:p-6">
          <h3 className="mb-2 text-base font-bold text-foreground">Próximas pautas</h3>
          {items
            .filter((i) => i.status !== "published")
            .map((item) => {
              const cfg = statusConfig[item.status]
              const renderPlatformIcon = () => <PlatformIcon platform={item.platform} className="size-3" />
              return (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30">
                  <div className="flex flex-col items-center justify-center size-12 shrink-0 rounded-lg bg-muted">
                    <span className="text-xs font-medium text-muted-foreground">{new Date(item.date).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}</span>
                    <span className="text-lg font-bold text-foreground">{new Date(item.date).getDate()}</span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {item.time && <span className="flex items-center gap-0.5"><Clock className="size-3" />{item.time}</span>}
                      <span className="flex items-center gap-0.5"><User className="size-3" />{item.assignee}</span>
                      <span className="flex items-center gap-0.5">{renderPlatformIcon()}{item.contentType}</span>
                      {item.hasAttachment && <Paperclip className="size-3" />}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", cfg.color)}>
                    <span className={cn("size-1.5 rounded-full", cfg.dot)} />
                    {cfg.label}
                  </Badge>
                </div>
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}

function MonthView({
  firstDay,
  daysInMonth,
  year,
  month,
  today,
  itemsByDate,
}: {
  firstDay: number
  daysInMonth: number
  year: number
  month: number
  today: Date
  itemsByDate: Record<string, CalendarItem[]>
}) {
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {weekDays.map((day) => (
          <div key={day} className="bg-muted/40 px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
        {cells.map((day, i) => {
          const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : ""
          const dayItems = dateStr ? itemsByDate[dateStr] ?? [] : []
          const isToday =
            day && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
          return (
            <div
              key={i}
              className={cn(
                "min-h-[80px] bg-card p-1.5 md:min-h-[100px] md:p-2",
                !day && "bg-muted/20"
              )}
            >
              {day && (
                <>
                  <div className={cn("mb-1 flex size-6 items-center justify-center rounded-full text-xs font-medium", isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                    {day}
                  </div>
                  <div className="flex flex-col gap-1">
                    {dayItems.map((item) => {
                      const cfg = statusConfig[item.status]
                      return (
                        <div
                          key={item.id}
                          className={cn("truncate rounded px-1.5 py-1 text-[10px] font-medium leading-tight", cfg.color)}
                          title={item.title}
                        >
                          <span className="inline-flex items-center gap-1">
                            <span className={cn("size-1.5 shrink-0 rounded-full", cfg.dot)} />
                            <span className="truncate">{item.title}</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({
  currentDate,
  today,
  itemsByDate,
}: {
  currentDate: Date
  today: Date
  itemsByDate: Record<string, CalendarItem[]>
}) {
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((date, i) => {
        const dateStr = date.toISOString().slice(0, 10)
        const dayItems = itemsByDate[dateStr] ?? []
        const isToday = date.toDateString() === today.toDateString()
        return (
          <div key={i} className="flex min-h-[300px] flex-col gap-2 rounded-lg border border-border/60 p-2">
            <div className="flex flex-col items-center pb-2">
              <span className="text-xs font-medium text-muted-foreground">{weekDays[i]}</span>
              <span className={cn("flex size-7 items-center justify-center rounded-full text-sm font-bold", isToday ? "bg-primary text-primary-foreground" : "text-foreground")}>
                {date.getDate()}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {dayItems.map((item) => {
                const cfg = statusConfig[item.status]
                return (
                  <div key={item.id} className={cn("rounded-md p-2 text-xs leading-tight", cfg.color)}>
                    {item.time && <div className="flex items-center gap-0.5 text-[10px] opacity-80"><Clock className="size-2.5" />{item.time}</div>}
                    <div className="mt-0.5 font-medium">{item.title}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
