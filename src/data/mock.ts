import type {
  ApprovalRequest,
  BaselineSnapshot,
  CalendarItem,
  Client,
  LibraryFile,
  MetricSeriesPoint,
  Publication,
  TimelineEvent,
} from "@/types"

export const agency = {
  name: "Northwave",
  tagline: "Social Media Performance Platform",
}

export const currentUser = {
  name: "Marina Almeida",
  email: "marina@northwave.studio",
  role: "Account Manager",
}

export const clients: Client[] = [
  {
    id: "verdao-cafe",
    name: "Verdão Café",
    brandColor: "oklch(0.55 0.13 142)",
    logoInitials: "VC",
    industry: "Food & Beverage",
    planTier: "Performance",
    contractStart: "2025-04-01",
    accounts: [
      { id: "vc-ig", platform: "instagram", handle: "@verdaocafe", displayName: "Verdão Café" },
      { id: "vc-fb", platform: "facebook", handle: "/verdaocafe", displayName: "Verdão Café" },
    ],
    primaryAccount: { id: "vc-ig", platform: "instagram", handle: "@verdaocafe", displayName: "Verdão Café" },
  },
  {
    id: "atlas-fitness",
    name: "Atlas Fitness",
    brandColor: "oklch(0.6 0.1 250)",
    logoInitials: "AF",
    industry: "Health & Fitness",
    planTier: "Growth",
    contractStart: "2025-06-15",
    accounts: [
      { id: "af-ig", platform: "instagram", handle: "@atlasfitoficial", displayName: "Atlas Fitness" },
      { id: "af-fb", platform: "facebook", handle: "/atlasfitness", displayName: "Atlas Fitness" },
    ],
    primaryAccount: { id: "af-ig", platform: "instagram", handle: "@atlasfitoficial", displayName: "Atlas Fitness" },
  },
  {
    id: "lumina-decor",
    name: "Lumina Decor",
    brandColor: "oklch(0.6 0.08 30)",
    logoInitials: "LD",
    industry: "Home & Design",
    planTier: "Enterprise",
    contractStart: "2025-02-10",
    accounts: [
      { id: "ld-ig", platform: "instagram", handle: "@luminadecor", displayName: "Lumina Decor" },
      { id: "ld-fb", platform: "facebook", handle: "/luminadecor", displayName: "Lumina Decor" },
    ],
    primaryAccount: { id: "ld-ig", platform: "instagram", handle: "@luminadecor", displayName: "Lumina Decor" },
  },
  {
    id: "pulse-activewear",
    name: "Pulse Activewear",
    brandColor: "oklch(0.55 0.15 300)",
    logoInitials: "PA",
    industry: "Fashion & Apparel",
    planTier: "Performance",
    contractStart: "2025-05-20",
    accounts: [
      { id: "pa-ig", platform: "instagram", handle: "@pulseactivewear", displayName: "Pulse Activewear" },
    ],
    primaryAccount: { id: "pa-ig", platform: "instagram", handle: "@pulseactivewear", displayName: "Pulse Activewear" },
  },
]

const baselineMap: Record<string, BaselineSnapshot> = {
  "verdao-cafe": {
    capturedAt: "2025-04-01",
    profilePicture: "",
    displayName: "Verdão Café",
    handle: "@verdaocafe",
    bio: "Café de especialidade direto da fazenda ☕\nCuritiba | São Paulo\nPedidos: link na bio",
    bioLink: "cardapio.verdaocafe.com.br",
    followers: 4820,
    following: 312,
    postsCount: 187,
    category: "Café e Restaurantes",
    isVerified: false,
    notes: "Perfil recebido sem estratégia editorial. Baixo engajamento, posts irregulares, sem identidade visual definida.",
    evidenceFiles: [
      { id: "e1", name: "screenshot_perfil_0104.png", type: "screenshot", uploadedAt: "2025-04-01", size: "1.2 MB" },
      { id: "e2", name: "relatorio_seguidores_inicial.pdf", type: "pdf", uploadedAt: "2025-04-01", size: "340 KB" },
    ],
  },
  "atlas-fitness": {
    capturedAt: "2025-06-15",
    profilePicture: "",
    displayName: "Atlas Fitness",
    handle: "@atlasfitoficial",
    bio: "Transforme seu corpo, transforme sua vida 💪\nMusculação | Funcional | HIIT\nUnidades em toda a cidade",
    bioLink: "atlasfitness.com.br/unidades",
    followers: 12100,
    following: 894,
    postsCount: 423,
    category: "Academia e Fitness",
    isVerified: false,
    notes: "Perfil com boa base de seguidores mas baixa taxa de engajamento (1.2%). Conteúdo majoritariamente promocional.",
    evidenceFiles: [
      { id: "e3", name: "screenshot_perfil_1506.png", type: "screenshot", uploadedAt: "2025-06-15", size: "980 KB" },
    ],
  },
  "lumina-decor": {
    capturedAt: "2025-02-10",
    profilePicture: "",
    displayName: "Lumina Decor",
    handle: "@luminadecor",
    bio: "Iluminação e design de interiores ✨\nProjetos residenciais e comerciais\nSolicite seu orçamento",
    bioLink: "luminadecor.com.br",
    followers: 28400,
    following: 1203,
    postsCount: 612,
    category: "Design e Decoração",
    isVerified: true,
    notes: "Perfil consolidado com identidade visual forte. Oportunidade em Reels e conteúdo educativo.",
    evidenceFiles: [
      { id: "e4", name: "screenshot_perfil_1002.png", type: "screenshot", uploadedAt: "2025-02-10", size: "1.5 MB" },
      { id: "e5", name: "benchmark_concorrentes.pdf", type: "pdf", uploadedAt: "2025-02-12", size: "520 KB" },
    ],
  },
  "pulse-activewear": {
    capturedAt: "2025-05-20",
    profilePicture: "",
    displayName: "Pulse Activewear",
    handle: "@pulseactivewear",
    bio: "Roupas esportivas com tecnologia e estilo 🏃‍♀️\nNova coleção SS26 disponível",
    bioLink: "pulseactivewear.com.br",
    followers: 8750,
    following: 456,
    postsCount: 234,
    category: "Moda Esportiva",
    isVerified: false,
    notes: "Marca em fase de expansão. Necessidade de aumentar alcance orgânico e construir comunidade.",
    evidenceFiles: [
      { id: "e6", name: "screenshot_perfil_2005.png", type: "screenshot", uploadedAt: "2025-05-20", size: "1.1 MB" },
    ],
  },
}

export function getBaseline(clientId: string): BaselineSnapshot {
  return baselineMap[clientId] ?? baselineMap["verdao-cafe"]
}

// Current (latest) profile state — for before/after comparison
export function getCurrentProfile(clientId: string) {
  const current: Record<string, { followers: number; postsCount: number; engagementRate: number; bioClicks: number }> = {
    "verdao-cafe": { followers: 18420, postsCount: 342, engagementRate: 4.8, bioClicks: 2840 },
    "atlas-fitness": { followers: 24600, postsCount: 531, engagementRate: 3.1, bioClicks: 1120 },
    "lumina-decor": { followers: 42100, postsCount: 748, engagementRate: 2.6, bioClicks: 3650 },
    "pulse-activewear": { followers: 19800, postsCount: 367, engagementRate: 5.2, bioClicks: 1980 },
  }
  return current[clientId] ?? current["verdao-cafe"]
}

const timelineMap: Record<string, TimelineEvent[]> = {
  "verdao-cafe": [
    { id: "t1", date: "2025-04-01", label: "Baseline capturado", description: "Snapshot inicial do perfil registrado no onboarding", type: "baseline", metric: "Seguidores", value: "4.820" },
    { id: "t2", date: "2025-04-15", label: "Estratégia editorial ativa", description: "Calendário editorial implementado com 4 posts/semana", type: "contract" },
    { id: "t3", date: "2025-05-01", label: "Primeiro marco de crescimento", description: "+1.000 seguidores orgânicos no primeiro mês", type: "milestone", metric: "Seguidores", value: "5.940" },
    { id: "t4", date: "2025-05-20", label: "Campanha Dia do Café", description: "Reels promocional alcançou 180K visualizações", type: "campaign", metric: "Reach", value: "180K" },
    { id: "t5", date: "2025-06-15", label: "Snapshot trimestral", description: "Evolução registrada: +118% em seguidores", type: "snapshot", metric: "Seguidores", value: "10.230" },
    { id: "t6", date: "2025-07-20", label: "Reels viral", description: "Conteúdo 'do grão à xícara' ultrapassou 500K views", type: "campaign", metric: "Views", value: "520K" },
    { id: "t7", date: "2025-08-01", label: "Snapshot atual", description: "Crescimento total: +282% em seguidores desde o baseline", type: "snapshot", metric: "Seguidores", value: "18.420" },
  ],
  "atlas-fitness": [
    { id: "t8", date: "2025-06-15", label: "Baseline capturado", description: "Snapshot inicial: 12.100 seguidores, 1.2% engajamento", type: "baseline", metric: "Seguidores", value: "12.100" },
    { id: "t9", date: "2025-07-01", label: "Reformulação de conteúdo", description: "Transição de conteúdo promocional para educativo", type: "contract" },
    { id: "t10", date: "2025-08-01", label: "Snapshot atual", description: "+103% em seguidores, engajamento subiu para 3.1%", type: "snapshot", metric: "Seguidores", value: "24.600" },
  ],
  "lumina-decor": [
    { id: "t11", date: "2025-02-10", label: "Baseline capturado", description: "Perfil consolidado com 28.400 seguidores", type: "baseline", metric: "Seguidores", value: "28.400" },
    { id: "t12", date: "2025-03-15", label: "Lançamento série Reels", description: "Conteúdo educativo de design de interiores", type: "campaign", metric: "Reach", value: "340K" },
    { id: "t13", date: "2025-06-10", label: "Snapshot semestral", description: "+32% em seguidores nos primeiros 4 meses", type: "snapshot", metric: "Seguidores", value: "37.500" },
    { id: "t14", date: "2025-08-01", label: "Snapshot atual", description: "+48% de crescimento total desde o baseline", type: "snapshot", metric: "Seguidores", value: "42.100" },
  ],
  "pulse-activewear": [
    { id: "t15", date: "2025-05-20", label: "Baseline capturado", description: "8.750 seguidores, marca em fase de expansão", type: "baseline", metric: "Seguidores", value: "8.750" },
    { id: "t16", date: "2025-06-20", label: "Estratégia de UGC", description: "User-generated content com embaixadoras", type: "contract" },
    { id: "t17", date: "2025-08-01", label: "Snapshot atual", description: "+126% de crescimento em 2.5 meses", type: "snapshot", metric: "Seguidores", value: "19.800" },
  ],
}

export function getTimeline(clientId: string): TimelineEvent[] {
  return timelineMap[clientId] ?? timelineMap["verdao-cafe"]
}

function generateSeries(clientId: string): MetricSeriesPoint[] {
  const base = baselineMap[clientId]
  const current = getCurrentProfile(clientId)
  const start = new Date(base.capturedAt).getTime()
  const months = 5
  const points: MetricSeriesPoint[] = []
  for (let m = 0; m <= months; m++) {
    const date = new Date(start + m * 30 * 86_400_000)
    const progress = m / months
    const followers = Math.round(base.followers + (current.followers - base.followers) * progress)
    const reachBase = followers * 2.4
    const reach = Math.round(reachBase + (Math.sin(m * 1.3) + 1) * reachBase * 0.15)
    const impressions = Math.round(reach * 1.35 + Math.sin(m) * 2000)
    const engagement = Math.round(followers * (0.03 + progress * 0.018))
    const profileVisits = Math.round(followers * 0.08 * (0.8 + Math.sin(m * 0.8) * 0.2))
    const bioClicks = Math.round(profileVisits * 0.35)
    points.push({
      date: date.toISOString().slice(0, 10),
      followers,
      reach,
      impressions,
      engagement,
      profileVisits,
      bioClicks,
    })
  }
  return points
}

const seriesCache: Record<string, MetricSeriesPoint[]> = {}
export function getMetricSeries(clientId: string): MetricSeriesPoint[] {
  if (!seriesCache[clientId]) seriesCache[clientId] = generateSeries(clientId)
  return seriesCache[clientId]
}

const publicationsMap: Record<string, Publication[]> = {
  "verdao-cafe": [
    { id: "p1", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "reel", caption: "Do grão à xícara: o caminho do nosso café especial ✨", thumbnailUrl: "", postedAt: "2025-07-20", likes: 18420, comments: 342, shares: 1280, saves: 2104, reach: 520000, engagementRate: 8.7 },
    { id: "p2", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "reel", caption: "3 métodos de preparo que vão mudar seu café ☕", thumbnailUrl: "", postedAt: "2025-07-12", likes: 9200, comments: 187, shares: 640, saves: 1320, reach: 210000, engagementRate: 6.2 },
    { id: "p3", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "post", caption: "Nova coleção de canecas exclusivas chegou 🏺", thumbnailUrl: "", postedAt: "2025-07-08", likes: 3120, comments: 48, shares: 92, saves: 210, reach: 48000, engagementRate: 3.4 },
    { id: "p4", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "story", caption: "Promoção relâmpago: 2 pelo preço de 1", thumbnailUrl: "", postedAt: "2025-07-05", likes: 890, comments: 12, shares: 34, saves: 0, reach: 22000, engagementRate: 2.1 },
    { id: "p5", clientId: "verdao-cafe", accountPlatform: "facebook", contentType: "post", caption: "Conheça a história por trás do Verdão Café", thumbnailUrl: "", postedAt: "2025-06-28", likes: 2140, comments: 67, shares: 180, saves: 0, reach: 67000, engagementRate: 3.8 },
    { id: "p6", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "reel", caption: "ASMR: som do café sendo preparado 🎧", thumbnailUrl: "", postedAt: "2025-06-22", likes: 12400, comments: 234, shares: 890, saves: 1670, reach: 340000, engagementRate: 7.1 },
    { id: "p7", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "post", caption: "Dica: como armazenar seu café corretamente", thumbnailUrl: "", postedAt: "2025-06-18", likes: 4100, comments: 89, shares: 240, saves: 560, reach: 71000, engagementRate: 4.5 },
    { id: "p8", clientId: "verdao-cafe", accountPlatform: "instagram", contentType: "story", caption: "Bastidores da torra de hoje", thumbnailUrl: "", postedAt: "2025-06-15", likes: 670, comments: 8, shares: 15, saves: 0, reach: 18000, engagementRate: 1.8 },
  ],
  "atlas-fitness": [
    { id: "p9", clientId: "atlas-fitness", accountPlatform: "instagram", contentType: "reel", caption: "3 exercícios para glúteos que você não conhecia 💪", thumbnailUrl: "", postedAt: "2025-07-25", likes: 14200, comments: 420, shares: 980, saves: 2400, reach: 380000, engagementRate: 7.5 },
    { id: "p10", clientId: "atlas-fitness", accountPlatform: "instagram", contentType: "post", caption: "Transformação real: 90 dias de dedicação", thumbnailUrl: "", postedAt: "2025-07-18", likes: 5600, comments: 134, shares: 210, saves: 680, reach: 89000, engagementRate: 4.2 },
    { id: "p11", clientId: "atlas-fitness", accountPlatform: "facebook", contentType: "post", caption: "Plano anual com 40% de desconto", thumbnailUrl: "", postedAt: "2025-07-10", likes: 1800, comments: 56, shares: 340, saves: 0, reach: 45000, engagementRate: 2.8 },
  ],
  "lumina-decor": [
    { id: "p12", clientId: "lumina-decor", accountPlatform: "instagram", contentType: "reel", caption: "5 erros comuns na iluminação da sala ✨", thumbnailUrl: "", postedAt: "2025-07-22", likes: 22400, comments: 560, shares: 1420, saves: 3800, reach: 610000, engagementRate: 6.8 },
    { id: "p13", clientId: "lumina-decor", accountPlatform: "instagram", contentType: "post", caption: "Antes e depois: apartamento 80m²", thumbnailUrl: "", postedAt: "2025-07-14", likes: 18900, comments: 430, shares: 890, saves: 2900, reach: 420000, engagementRate: 5.4 },
    { id: "p14", clientId: "lumina-decor", accountPlatform: "instagram", contentType: "post", caption: "Tendência 2026: tons terrosos", thumbnailUrl: "", postedAt: "2025-07-06", likes: 9800, comments: 210, shares: 540, saves: 1600, reach: 180000, engagementRate: 4.1 },
  ],
  "pulse-activewear": [
    { id: "p15", clientId: "pulse-activewear", accountPlatform: "instagram", contentType: "reel", caption: "Nova coleção SS26 — Bastidores do ensaio 🏃‍♀️", thumbnailUrl: "", postedAt: "2025-07-24", likes: 16200, comments: 380, shares: 1120, saves: 2800, reach: 440000, engagementRate: 7.8 },
    { id: "p16", clientId: "pulse-activewear", accountPlatform: "instagram", contentType: "post", caption: "Legging que não fica transparente — teste real", thumbnailUrl: "", postedAt: "2025-07-16", likes: 7400, comments: 190, shares: 430, saves: 1200, reach: 120000, engagementRate: 5.2 },
  ],
}

export function getPublications(clientId: string): Publication[] {
  return publicationsMap[clientId] ?? publicationsMap["verdao-cafe"]
}

const calendarMap: Record<string, CalendarItem[]> = {
  "verdao-cafe": [
    { id: "c1", clientId: "verdao-cafe", date: "2025-08-04", time: "09:00", title: "Reels: preparo do dia", contentType: "reel", platform: "instagram", status: "published", assignee: "Marina", hasAttachment: true },
    { id: "c2", clientId: "verdao-cafe", date: "2025-08-05", time: "12:00", title: "Post: cardápio da semana", contentType: "post", platform: "instagram", status: "published", assignee: "Lucas", hasAttachment: true },
    { id: "c3", clientId: "verdao-cafe", date: "2025-08-06", time: "10:00", title: "Story: promoção happy hour", contentType: "story", platform: "instagram", status: "published", assignee: "Marina", hasAttachment: false },
    { id: "c4", clientId: "verdao-cafe", date: "2025-08-07", time: "08:00", title: "Reels: ASMR café", contentType: "reel", platform: "instagram", status: "scheduled", assignee: "Lucas", hasAttachment: true },
    { id: "c5", clientId: "verdao-cafe", date: "2025-08-08", time: "11:00", title: "Post: bastidores torra", contentType: "post", platform: "facebook", status: "scheduled", assignee: "Marina", hasAttachment: true },
    { id: "c6", clientId: "verdao-cafe", date: "2025-08-11", time: "09:30", title: "Reels: dica de barista", contentType: "reel", platform: "instagram", status: "approved", assignee: "Lucas", hasAttachment: true },
    { id: "c7", clientId: "verdao-cafe", date: "2025-08-12", time: "14:00", title: "Post: nova coleção canecas", contentType: "post", platform: "instagram", status: "review", assignee: "Marina", hasAttachment: true },
    { id: "c8", clientId: "verdao-cafe", date: "2025-08-13", time: "10:00", title: "Story: enquete seguidores", contentType: "story", platform: "instagram", status: "review", assignee: "Lucas", hasAttachment: false },
    { id: "c9", clientId: "verdao-cafe", date: "2025-08-14", time: "12:00", title: "Reels: tour pela cafeteria", contentType: "reel", platform: "instagram", status: "draft", assignee: "Marina", hasAttachment: false },
    { id: "c10", clientId: "verdao-cafe", date: "2025-08-15", time: "15:00", title: "Post: depoimento cliente", contentType: "post", platform: "facebook", status: "draft", assignee: "Lucas", hasAttachment: false },
  ],
}

export function getCalendar(clientId: string): CalendarItem[] {
  return calendarMap[clientId] ?? calendarMap["verdao-cafe"]
}

const approvalsMap: Record<string, ApprovalRequest[]> = {
  "verdao-cafe": [
    {
      id: "a1", clientId: "verdao-cafe", title: "Reels: tour pela cafeteria", contentType: "reel", platform: "instagram",
      status: "pending", submittedAt: "2025-08-09", submittedBy: "Marina Almeida", thumbnailUrl: "",
      caption: "Venha conhecer cada cantinho da nossa cafeteria em Curitiba ☕ Da torra à xícara, tudo acontece aqui. #verdaocafe #cafeespecialidade",
      versions: [
        { version: 1, createdAt: "2025-08-08", author: "Lucas", note: "Primeira versão com trilha original" },
        { version: 2, createdAt: "2025-08-09", author: "Marina", note: "Adicionada narração e ajuste de cortes" },
      ],
      comments: [
        { id: "cm1", author: "Marina Almeida", authorRole: "agency", createdAt: "2025-08-09", body: "Versão final pronta para revisão. Narrativa completa com narração." },
      ],
    },
    {
      id: "a2", clientId: "verdao-cafe", title: "Post: nova coleção canecas", contentType: "post", platform: "instagram",
      status: "changes_requested", submittedAt: "2025-08-07", submittedBy: "Lucas Pereira", thumbnailUrl: "",
      caption: "Chegou! Nova coleção de canecas exclusivas Verdão 🏺 Edição limitada, apenas na loja física.",
      versions: [
        { version: 1, createdAt: "2025-08-06", author: "Lucas", note: "Layout inicial com 3 produtos" },
        { version: 2, createdAt: "2025-08-07", author: "Lucas", note: "Ajuste de cores conforme feedback" },
      ],
      comments: [
        { id: "cm2", author: "Carlos Verdão", authorRole: "client", createdAt: "2025-08-07", body: "Podemos destacar mais a caneca verde? Ela é o carro-chefe." },
        { id: "cm3", author: "Lucas Pereira", authorRole: "agency", createdAt: "2025-08-08", body: "Claro! Vou realocar a caneca verde para o centro da composição." },
      ],
    },
    {
      id: "a3", clientId: "verdao-cafe", title: "Story: enquete seguidores", contentType: "story", platform: "instagram",
      status: "approved", submittedAt: "2025-08-05", submittedBy: "Marina Almeida", thumbnailUrl: "",
      caption: "Qual o seu café favorito? Vote na enquete dos stories! ☕",
      versions: [
        { version: 1, createdAt: "2025-08-05", author: "Marina", note: "Versão única com stickers de enquete" },
      ],
      comments: [
        { id: "cm4", author: "Carlos Verdão", authorRole: "client", createdAt: "2025-08-05", body: "Aprovado! Publicar amanhã." },
      ],
    },
  ],
}

export function getApprovals(clientId: string): ApprovalRequest[] {
  return approvalsMap[clientId] ?? approvalsMap["verdao-cafe"]
}

const libraryMap: Record<string, LibraryFile[]> = {
  "verdao-cafe": [
    { id: "f1", clientId: "verdao-cafe", name: "Branding Guide 2025.pdf", type: "pdf", category: "Brand", size: "2.4 MB", uploadedAt: "2025-04-02", uploadedBy: "Marina" },
    { id: "f2", clientId: "verdao-cafe", name: "Foto_Cafe_Especialidade.jpg", type: "image", category: "Fotos", size: "3.1 MB", uploadedAt: "2025-04-10", uploadedBy: "Lucas", thumbnailUrl: "" },
    { id: "f3", clientId: "verdao-cafe", name: "Reels_Bastidores_Torra.mp4", type: "video", category: "Vídeos", size: "48 MB", uploadedAt: "2025-06-20", uploadedBy: "Lucas", thumbnailUrl: "" },
    { id: "f4", clientId: "verdao-cafe", name: "Brief_Campanha_DiaDoCafe.pdf", type: "brief", category: "Briefs", size: "180 KB", uploadedAt: "2025-05-15", uploadedBy: "Marina" },
    { id: "f5", clientId: "verdao-cafe", name: "Canecas_NovaColecao.jpg", type: "image", category: "Produtos", size: "2.8 MB", uploadedAt: "2025-07-01", uploadedBy: "Lucas", thumbnailUrl: "" },
    { id: "f6", clientId: "verdao-cafe", name: "Logo_VerdaoCafe_SVG.png", type: "image", category: "Brand", size: "120 KB", uploadedAt: "2025-04-02", uploadedBy: "Marina", thumbnailUrl: "" },
  ],
}

export function getLibrary(clientId: string): LibraryFile[] {
  return libraryMap[clientId] ?? libraryMap["verdao-cafe"]
}
