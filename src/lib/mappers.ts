import type { UserProfile } from '../types'

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
