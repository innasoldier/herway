import type { UserProfile, DiaryEntry } from '../types'

export function toUserProfile(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    avatarUrl: row.avatar_url ?? null,
    subscriptionStatus: row.subscription_status,
    pillarFocus: row.pillar_focus ?? null,
    assessmentCompleted: row.assessment_completed,
    notificationToken: row.notification_token ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function toUserProfileRow(profile: Partial<UserProfile>): any {
  const row: Record<string, unknown> = {}

  if (profile.id !== undefined)                   row.id = profile.id
  if (profile.email !== undefined)                row.email = profile.email
  if (profile.name !== undefined)                 row.name = profile.name
  if (profile.avatarUrl !== undefined)            row.avatar_url = profile.avatarUrl
  if (profile.subscriptionStatus !== undefined)   row.subscription_status = profile.subscriptionStatus
  if (profile.pillarFocus !== undefined)          row.pillar_focus = profile.pillarFocus
  if (profile.assessmentCompleted !== undefined)  row.assessment_completed = profile.assessmentCompleted
  if (profile.notificationToken !== undefined)    row.notification_token = profile.notificationToken
  if (profile.createdAt !== undefined)            row.created_at = profile.createdAt
  if (profile.updatedAt !== undefined)            row.updated_at = profile.updatedAt

  return row
}

export function toDiaryEntry(row: any): DiaryEntry {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    content: row.content,
    mood: row.mood,
    aiReflection: row.ai_reflection,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function toDiaryEntryRow(entry: Partial<DiaryEntry>): any {
  const row: Record<string, unknown> = {}

  if (entry.id !== undefined)            row.id = entry.id
  if (entry.userId !== undefined)        row.user_id = entry.userId
  if (entry.pillar !== undefined)        row.pillar = entry.pillar
  if (entry.content !== undefined)       row.content = entry.content
  if (entry.mood !== undefined)          row.mood = entry.mood
  if (entry.aiReflection !== undefined)  row.ai_reflection = entry.aiReflection
  if (entry.createdAt !== undefined)     row.created_at = entry.createdAt
  if (entry.updatedAt !== undefined)     row.updated_at = entry.updatedAt

  return row
}
