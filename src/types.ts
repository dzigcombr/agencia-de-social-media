// Domain types — designed to mirror future Meta Graph API entities.

export type Platform = "instagram" | "facebook"

export type ContentType = "post" | "reel" | "story"

export type ContentStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"

export type ApprovalStatus = "pending" | "approved" | "changes_requested"

export type BaselineStatus = "pending" | "captured" | "outdated"

export interface SocialAccount {
  id: string
  platform: Platform
  handle: string
  displayName: string
}

export interface ClientUser {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
}

export interface Client {
  id: string
  name: string
  brandColor: string
  logoInitials: string
  industry: string
  planTier: "Growth" | "Performance" | "Enterprise"
  contractStart: string // ISO date
  accounts: SocialAccount[]
  primaryAccount: SocialAccount
}

export interface BaselineSnapshot {
  capturedAt: string // ISO date
  profilePicture: string
  displayName: string
  handle: string
  bio: string
  bioLink: string
  followers: number
  following: number
  postsCount: number
  category: string
  isVerified: boolean
  notes: string
  evidenceFiles: EvidenceFile[]
}

export interface EvidenceFile {
  id: string
  name: string
  type: "screenshot" | "pdf" | "note" | "video"
  uploadedAt: string
  size: string
}

export interface TimelineEvent {
  id: string
  date: string
  label: string
  description: string
  type: "baseline" | "milestone" | "campaign" | "snapshot" | "contract"
  metric?: string
  value?: string
}

export interface MetricSeriesPoint {
  date: string
  followers: number
  reach: number
  impressions: number
  engagement: number
  profileVisits: number
  bioClicks: number
}

export interface Publication {
  id: string
  clientId: string
  accountPlatform: Platform
  contentType: ContentType
  caption: string
  thumbnailUrl: string
  postedAt: string
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  engagementRate: number
}

export interface CalendarItem {
  id: string
  clientId: string
  date: string // ISO date
  time?: string
  title: string
  contentType: ContentType
  platform: Platform
  status: ContentStatus
  assignee: string
  hasAttachment: boolean
}

export interface ApprovalRequest {
  id: string
  clientId: string
  title: string
  contentType: ContentType
  platform: Platform
  status: ApprovalStatus
  submittedAt: string
  submittedBy: string
  thumbnailUrl: string
  caption: string
  versions: ApprovalVersion[]
  comments: ApprovalComment[]
}

export interface ApprovalVersion {
  version: number
  createdAt: string
  author: string
  note: string
}

export interface ApprovalComment {
  id: string
  author: string
  authorRole: "agency" | "client"
  createdAt: string
  body: string
}

export interface LibraryFile {
  id: string
  clientId: string
  name: string
  type: "image" | "video" | "pdf" | "brief"
  category: string
  size: string
  uploadedAt: string
  uploadedBy: string
  thumbnailUrl?: string
}

export interface MetricKpi {
  label: string
  value: number
  previousValue: number
  format: "number" | "percent" | "compact"
  platform: Platform | "combined"
}

// Navigation
export type ScreenId =
  | "login"
  | "client-select"
  | "onboarding"
  | "dashboard"
  | "baseline"
  | "publications"
  | "calendar"
  | "approvals"
  | "library"
  | "ai"
  | "settings"
