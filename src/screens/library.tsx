import { useState } from "react"
import {
  FileText,
  Film,
  Image as ImageIcon,
  ClipboardList,
  Download,
  Upload,
  Search,
  Folder,
} from "lucide-react"
import { useApp } from "@/context/app-context"
import { getLibrary } from "@/data/mock"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { LibraryFile } from "@/types"

const fileIcons: Record<LibraryFile["type"], typeof FileText> = {
  pdf: FileText,
  video: Film,
  image: ImageIcon,
  brief: ClipboardList,
}

const fileColors: Record<LibraryFile["type"], string> = {
  pdf: "bg-destructive/10 text-destructive",
  video: "bg-chart-2/10 text-chart-2",
  image: "bg-chart-3/10 text-chart-3",
  brief: "bg-primary/10 text-primary",
}

export function LibraryScreen() {
  const { client } = useApp()
  if (!client) return null

  const files = getLibrary(client.id)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(files.map((f) => f.category)))]

  const filtered = files.filter(
    (f) =>
      (category === "all" || f.category === category) &&
      f.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalSize = files.reduce((acc, f) => {
    const num = parseFloat(f.size)
    return acc + (f.size.includes("MB") ? num : num / 1024)
  }, 0)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Biblioteca de arquivos"
        description="Artes, vídeos, briefs e materiais do cliente"
        action={
          <Button size="sm">
            <Upload className="size-4" />
            Enviar arquivo
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="py-0">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Arquivos</span>
              <span className="text-2xl font-bold tabular text-foreground">{files.length}</span>
            </div>
            <Folder className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Categorias</span>
              <span className="text-2xl font-bold tabular text-foreground">{categories.length - 1}</span>
            </div>
            <Folder className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="py-0">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Armazenamento</span>
              <span className="text-2xl font-bold tabular text-foreground">{totalSize.toFixed(1)} MB</span>
            </div>
            <FileText className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "all" ? "Todos" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* File grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((file) => {
          const Icon = fileIcons[file.type]
          return (
            <Card key={file.id} className="group gap-0 overflow-hidden py-0 transition-all hover:shadow-premium">
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20">
                <div className={cn("flex size-14 items-center justify-center rounded-xl", fileColors[file.type])}>
                  <Icon className="size-7" />
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
                  <Button variant="ghost" size="icon-xs" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <Download className="size-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{file.category}</Badge>
                  <span>{file.size}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{formatDate(file.uploadedAt)} · {file.uploadedBy}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Folder className="size-8 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Nenhum arquivo encontrado</span>
            <span className="text-xs text-muted-foreground">Tente ajustar a busca ou os filtros.</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
