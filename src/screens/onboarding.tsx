import { useState } from "react"
import { ArrowLeft, ArrowRight, Camera, Check, FileText, Link2, Upload, User } from "lucide-react"
import { useApp } from "@/context/app-context"
import { BrandLogo } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const steps = ["Dados do cliente", "Conta social", "Baseline do perfil", "Evidências"]

export function OnboardingScreen() {
  const { navigate, selectClient, clients } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: "",
    industry: "",
    handle: "",
    bio: "",
    bioLink: "",
    followers: "",
    notes: "",
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleFinish = () => {
    // In a real app, create the client. For demo, select first existing client.
    selectClient(clients[0])
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <BrandLogo />
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("client-select")}>
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Onboarding de cliente</h1>
          <p className="text-sm text-muted-foreground">
            Configure um novo cliente e capture o baseline do perfil — o registro inicial que prova a evolução ao
            longo do contrato.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i < step && "bg-success text-success-foreground",
                  i === step && "bg-primary text-primary-foreground",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={cn("h-0.5 flex-1 rounded-full", i < step ? "bg-success" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-lg">{steps[step]}</CardTitle>
            <CardDescription>
              {step === 0 && "Informações básicas do cliente."}
              {step === 1 && "Conecte a conta do Instagram ou Facebook."}
              {step === 2 && "Capture o snapshot inicial — este é o ponto de partida da evolução."}
              {step === 3 && "Anexe prints e documentos como prova do estado inicial."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {step === 0 && (
              <>
                <Field label="Nome do cliente" icon={User}>
                  <Input
                    placeholder="Ex: Verdão Café"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </Field>
                <Field label="Segmento" icon={FileText}>
                  <Input
                    placeholder="Ex: Food & Beverage"
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                  />
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <Field label="Handle do Instagram" icon={Camera}>
                  <Input
                    placeholder="@usuario"
                    value={form.handle}
                    onChange={(e) => update("handle", e.target.value)}
                  />
                </Field>
                <Field label="Link da bio" icon={Link2}>
                  <Input
                    placeholder="seusite.com.br"
                    value={form.bioLink}
                    onChange={(e) => update("bioLink", e.target.value)}
                  />
                </Field>
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
                      <Camera className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">Meta Graph API</span>
                      <span className="text-xs text-muted-foreground">
                        Estrutura preparada para conexão automática (futuro)
                      </span>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs">Em breve</Badge>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Bio atual do perfil">
                  <Textarea
                    rows={3}
                    placeholder="Copie a bio atual do perfil..."
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                  />
                </Field>
                <Field label="Número de seguidores">
                  <Input
                    type="number"
                    placeholder="Ex: 4820"
                    value={form.followers}
                    onChange={(e) => update("followers", e.target.value)}
                  />
                </Field>
                <Field label="Observações do baseline">
                  <Textarea
                    rows={2}
                    placeholder="Registre o estado inicial: identidade visual, padrão de posts, engajamento..."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </Field>
                <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">Por que capturar o baseline?</span> O snapshot
                    inicial é a prova do estado do perfil antes do trabalho da agência. Ele transforma a evolução em
                    um argumento visual e concreto de resultado.
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Upload className="size-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Arraste arquivos ou clique para enviar</span>
                    <span className="text-xs text-muted-foreground">Screenshots, PDFs e observações — máx 20MB</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1"><Camera className="size-3" /> screenshot_perfil.png</Badge>
                  <Badge variant="secondary" className="gap-1"><FileText className="size-3" /> relatorio_inicial.pdf</Badge>
                </div>
              </>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => (step === 0 ? navigate("client-select") : setStep(step - 1))}
              >
                <ArrowLeft className="size-4" />
                {step === 0 ? "Cancelar" : "Voltar"}
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continuar
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish}>
                  <Check className="size-4" />
                  Concluir onboarding
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon?: typeof User
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="size-3.5 text-muted-foreground" />}
        {label}
      </Label>
      {children}
    </div>
  )
}
