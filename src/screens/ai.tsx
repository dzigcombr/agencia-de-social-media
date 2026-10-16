import { useState } from "react"
import {
  Sparkles,
  PenLine,
  Video,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Send,
} from "lucide-react"
import { useApp } from "@/context/app-context"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type Tool = "caption" | "script" | "ideas"

const tools: { id: Tool; label: string; icon: LucideIcon; description: string; placeholder: string }[] = [
  {
    id: "caption",
    label: "Gerar legendas",
    icon: PenLine,
    description: "Crie legendas envolventes com CTAs e hashtags",
    placeholder: "Ex: Post sobre o novo café especialidade da casa...",
  },
  {
    id: "script",
    label: "Roteiros de Reels",
    icon: Video,
    description: "Estruture roteiros para vídeos curtos",
    placeholder: "Ex: Reels de bastidores da torra de café...",
  },
  {
    id: "ideas",
    label: "Ideias de conteúdo",
    icon: Lightbulb,
    description: "Gere pautas criativas baseadas no nicho",
    placeholder: "Ex: Conteúdo educativo sobre métodos de preparo...",
  },
]

const sampleOutputs: Record<Tool, { title: string; content: string }[]> = {
  caption: [
    {
      title: "Opção 1 — Emocional",
      content: "Cada xícara conta uma história ☕\n\nDo grão à sua mesa, levamos meses de dedicação para entregar o café especial que você merece. Cada detalhe importa — da torra à temperatura da água.\n\nE você, como prefere o seu café? Conta pra gente nos comentários 👇\n\n#cafeespecial #cafedamanha #verdaocafe #coffeelover #barista",
    },
    {
      title: "Opção 2 — Educativo",
      content: "Você sabia que 80% do sabor do café vem da torra? 🔥\n\nNa Verdão, torramos em pequenos lotes para preservar os aromas únicos de cada grão. É isso que faz um café especial de verdade.\n\nProve a diferença: cardapio.verdaocafe.com.br\n\n#cafedeespecialidade #torraartesanal #verdaocafe",
    },
  ],
  script: [
    {
      title: "Roteiro — Bastidores da torra",
      content: "[0-3s] Hook: close-up dos grãos verdes caindo no torrador\n\n[3-8s] Narração: 'O que faz um café ser especial? Tudo começa aqui, na torra.'\n\n[8-15s] B-roll: processo de torra, medição de temperatura, grãos mudando de cor\n\n[15-22s] Narração: 'Cada lote é torrado em pequenas quantidades, com controle preciso de tempo e temperatura.'\n\n[22-30s] CTA: barista servindo xícara, sorriso → 'Experimente o Verdão. Cardápio na bio.'\n\nMúsica: lo-fi suave, batida marcada nos cortes",
    },
  ],
  ideas: [
    {
      title: "5 ideias de conteúdo",
      content: "1. Carrossel: '5 erros que você comete ao preparar café em casa'\n\n2. Reels ASMR: som do café sendo moído e preparado (sem narração)\n\n3. Post educativo: infográfico 'do grão à xícara' — o caminho do café\n\n4. Reels: 'Reagindo aos pedidos mais estranhos da cafeteria'\n\n5. Série de stories: enquete 'qual seu café favorito?' + resultados em gráfico",
    },
  ],
}

export function AIScreen() {
  const { client } = useApp()
  if (!client) return null

  const [tool, setTool] = useState<Tool>("caption")
  const [prompt, setPrompt] = useState("")
  const [results, setResults] = useState<typeof sampleOutputs[Tool] | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = () => {
    setLoading(true)
    setResults(null)
    setTimeout(() => {
      setResults(sampleOutputs[tool])
      setLoading(false)
    }, 1200)
  }

  const handleCopy = (text: string, idx: string) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentTool = tools.find((t) => t.id === tool)!

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="IA Assistiva"
        description="Gere legendas, roteiros e ideias — sempre com revisão humana antes de publicar"
      />

      {/* Tool selector */}
      <div className="grid gap-3 sm:grid-cols-3">
        {tools.map((t) => (
          <Card
            key={t.id}
            className={cn(
              "cursor-pointer gap-0 py-0 transition-all hover:shadow-premium",
              tool === t.id && "border-primary ring-1 ring-primary/20"
            )}
            onClick={() => {
              setTool(t.id)
              setResults(null)
            }}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", tool === t.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                <t.icon className="size-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <currentTool.icon className="size-4.5 text-primary" />
              {currentTool.label}
            </CardTitle>
            <CardDescription>Descreva o que você precisa para {client.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Contexto / briefing</Label>
              <Textarea
                rows={5}
                placeholder={currentTool.placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Tom de voz</Label>
                <Input defaultValue="Amigável e profissional" className="h-9 text-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Hashtags</Label>
                <Input defaultValue="5-8 hashtags" className="h-9 text-sm" />
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={loading || !prompt} className="gap-2">
              {loading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Gerar com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado</CardTitle>
            <CardDescription>Revise e edite antes de usar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <RefreshCw className="size-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Criando conteúdo para você...</span>
              </div>
            )}

            {!loading && !results && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Sparkles className="size-6" />
                </div>
                <span className="text-sm font-medium text-foreground">Pronto para gerar</span>
                <span className="max-w-xs text-xs text-muted-foreground">
                  Preencha o briefing e clique em "Gerar com IA" para ver as sugestões.
                </span>
              </div>
            )}

            {!loading && results && (
              results.map((result, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{result.title}</span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleCopy(result.content, `${i}`)}
                    >
                      {copied === `${i}` ? (
                        <Check className="size-3.5 text-success" />
                      ) : (
                        <Copy className="size-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="whitespace-pre-line text-sm text-foreground">{result.content}</p>
                </div>
              ))
            )}

            {results && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/[0.06] p-3">
                <AlertCircle className="size-4 shrink-0 text-warning-foreground" />
                <span className="text-xs text-muted-foreground">
                  Conteúdo gerado por IA. <span className="font-semibold text-foreground">Sempre revise antes de publicar.</span> A aprovação humana é obrigatória.
                </span>
              </div>
            )}

            {results && (
              <Button variant="outline" size="sm" className="gap-2">
                <Send className="size-3.5" />
                Enviar para aprovação
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gerações recentes</CardTitle>
          <CardDescription>Histórico de conteúdos criados com IA</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[
            { tool: "Legenda", title: "Post: novo café especialidade", date: "há 2 dias" },
            { tool: "Roteiro", title: "Reels: ASMR preparo de café", date: "há 4 dias" },
            { tool: "Ideias", title: "5 pautas para agosto", date: "há 1 semana" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.tool}</span>
              </div>
              <Badge variant="outline" className="text-[10px]">{item.date}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
