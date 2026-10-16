export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M"
  }
  if (Math.abs(n) >= 1_000) {
    return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + "K"
  }
  return n.toLocaleString("pt-BR")
}

export function formatFull(n: number): string {
  return n.toLocaleString("pt-BR")
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}

export function delta(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function formatDelta(pct: number): string {
  const sign = pct > 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("pt-BR", opts ?? { day: "2-digit", month: "short", year: "numeric" })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

export function relativeDays(iso: string): string {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return "hoje"
  if (diff === 1) return "ontem"
  if (diff < 7) return `há ${diff} dias`
  if (diff < 30) return `há ${Math.round(diff / 7)} sem`
  return `há ${Math.round(diff / 30)} meses`
}
