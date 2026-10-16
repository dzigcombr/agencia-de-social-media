import { useApp } from "@/context/app-context"
import { SectionHeader } from "@/components/shared"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plug, Unplug } from "lucide-react"
import { PlatformIcon } from "@/components/social-icons"
import type { Platform } from "@/types"

export function SettingsScreen() {
  const { client, currentUser, logout } = useApp()
  if (!client) return null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <SectionHeader
        title="Configurações"
        description="Gerencie a conta, integrações e preferências"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil da agência</CardTitle>
            <CardDescription>Informações do usuário logado</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                  {currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-foreground">{currentUser.name}</span>
                <span className="text-sm text-muted-foreground">{currentUser.email}</span>
                <Badge variant="outline" className="mt-1 w-fit text-xs">{currentUser.role}</Badge>
              </div>
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Nome</Label>
                <Input defaultValue={currentUser.name} className="h-9" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">E-mail</Label>
                <Input defaultValue={currentUser.email} className="h-9" />
              </div>
            </div>
            <Button size="sm" className="w-fit">Salvar alterações</Button>
          </CardContent>
        </Card>

        {/* Client info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliente selecionado</CardTitle>
            <CardDescription>Informações do contrato</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3.5">
              <div className="flex size-12 items-center justify-center rounded-xl text-base font-bold text-white" style={{ backgroundColor: client.brandColor }}>
                {client.logoInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{client.name}</span>
                <span className="text-xs text-muted-foreground">{client.industry}</span>
              </div>
              <Badge variant="outline" className="ml-auto text-xs">{client.planTier}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 rounded-lg bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground">Início do contrato</span>
                <span className="text-sm font-semibold text-foreground">
                  {new Date(client.contractStart).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-lg bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground">Contas conectadas</span>
                <span className="text-sm font-semibold text-foreground">{client.accounts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social integrations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Integrações sociais</CardTitle>
            <CardDescription>Conexões com Meta Graph API (estrutura preparada)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {client.accounts.map((account) => (
              <IntegrationRow key={account.id} platform={account.platform} handle={account.handle} />
            ))}
            <div className="rounded-lg border border-dashed border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Plug className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Meta Graph API</span>
                  <span className="text-xs text-muted-foreground">
                    Conexão automática com Instagram e Facebook para métricas em tempo real
                  </span>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">Em breve</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notificações</CardTitle>
            <CardDescription>Como você quer ser avisado</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { label: "Novas aprovações pendentes", desc: "Quando um conteúdo é enviado para revisão", on: true },
              { label: "Relatório mensal", desc: "Resumo de métricas no início de cada mês", on: true },
              { label: "Marços de crescimento", desc: "Quando um cliente atinge um marco", on: false },
              { label: "Comentários do cliente", desc: "Quando o cliente comenta em uma aprovação", on: true },
            ].map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
                <Switch defaultChecked={item.on} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Zona de risco</CardTitle>
            <CardDescription>Ações irreversíveis</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Sair da conta</span>
                <span className="text-xs text-muted-foreground">Encerrar a sessão atual</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-destructive">Excluir cliente</span>
                <span className="text-xs text-muted-foreground">Remove todos os dados de {client.name}</span>
              </div>
              <Button variant="destructive" size="sm">Excluir</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function IntegrationRow({ platform, handle }: { platform: Platform; handle: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3.5">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
        <PlatformIcon platform={platform} className="size-5" />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium capitalize text-foreground">{platform}</span>
        <span className="text-xs text-muted-foreground">{handle}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-success">
          <span className="size-1.5 rounded-full bg-success" />
          Conectado
        </span>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <Unplug className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
