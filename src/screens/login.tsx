import { useState } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useApp } from "@/context/app-context"
import { agency } from "@/data/mock"
import { BrandLogo } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginScreen() {
  const { login } = useApp()
  const [email, setEmail] = useState("marina@northwave.studio")
  const [password, setPassword] = useState("demo1234")
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

  return (
    <div className="flex min-h-svh">
      {/* Left — brand panel */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative">
          <BrandLogo className="[&_span]:text-white [&_div:first-child]:bg-white/15" />
        </div>
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <span className="size-1.5 rounded-full bg-success" />
              Plataforma de performance
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
              A evolução do perfil do seu cliente, <span className="text-white/70">desde o primeiro dia.</span>
            </h1>
            <p className="max-w-md text-base text-white/70">
              Centralize métricas, baseline do perfil, calendário editorial e aprovações em um só sistema.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tabular">+282%</span>
              <span className="text-xs text-white/60">Crescimento médio</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tabular">4</span>
              <span className="text-xs text-white/60">Clientes ativos</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tabular">7 telas</span>
              <span className="text-xs text-white/60">MVP completo</span>
            </div>
          </div>
        </div>
        <div className="relative text-xs text-white/50">© 2026 {agency.name}. Todos os direitos reservados.</div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>
          <div className="mb-8 flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h2>
            <p className="text-sm text-muted-foreground">Acesse o painel da agência para gerenciar seus clientes.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 pl-9"
                  placeholder="voce@agencia.com"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pl-9 pr-9"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 h-10 gap-2">
              Entrar no painel
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border/60 bg-muted/30 p-3.5">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Demo:</span> credenciais pré-preenchidas. Clique em
              "Entrar" para explorar o MVP.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
