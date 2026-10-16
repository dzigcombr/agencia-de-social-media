import { cn } from "@/lib/utils"

export function BrandLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8"
  const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5"
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative flex items-center justify-center rounded-lg bg-primary", dim)}>
        <svg
          className={cn(iconSize, "text-primary-foreground")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 17l4-4 3 3 5-6 6 7" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-foreground">Pulse</span>
        <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Performance</span>
      </div>
    </div>
  )
}

export function ClientAvatar({
  initials,
  color,
  className,
  size = "md",
}: {
  initials: string
  color?: string
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const dim = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-12 text-base" : "size-9 text-sm"
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-lg font-bold text-white", dim, className)}
      style={{ backgroundColor: color ?? "oklch(0.5 0.1 240)" }}
    >
      {initials}
    </div>
  )
}
