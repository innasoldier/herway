export type Pillar = 'identity' | 'body' | 'relationships' | 'career' | 'vision'

export type SubscriptionStatus = 'free' | 'paid' | 'cancelled'

export type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string; code?: string }

export type PillarColor = Record<Pillar, string>

export const PILLAR_COLORS: PillarColor = {
  identity: 'bg-purple-100 text-purple-700',
  body: 'bg-teal-100 text-teal-700',
  relationships: 'bg-orange-100 text-orange-700',
  career: 'bg-amber-100 text-amber-700',
  vision: 'bg-pink-100 text-pink-700',
}

export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  subscriptionStatus: SubscriptionStatus
  pillarFocus: Pillar | null
  assessmentCompleted: boolean
  notificationToken: string | null
  createdAt: string
  updatedAt: string
}

export function isPaidUser(
  profile: UserProfile
): profile is UserProfile & { subscriptionStatus: 'paid' } {
  return profile.subscriptionStatus === 'paid'
}

export function hasCompletedAssessment(
  profile: UserProfile
): profile is UserProfile & { assessmentCompleted: true; pillarFocus: Pillar } {
  return profile.assessmentCompleted === true && profile.pillarFocus !== null
}

export interface DiaryEntry {
  id: string
  userId: string
  pillar: Pillar
  content: string
  mood: number
  aiReflection: string
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  pillar: Pillar
  text: string
  isAdaptive: boolean
  basedOnPattern: string | null
  createdAt: string
}

export interface QuestionnaireResponse {
  id: string
  userId: string
  questionId: string
  pillar: Pillar
  answer: string
  createdAt: string
}

export interface AdaptiveQuestionSet {
  id: string
  userId: string
  questions: Question[]
  basedOnPatterns: string[]
  weekStart: string
  completedAt: string | null
  createdAt: string
}

export interface CheckIn {
  id: string
  userId: string
  pillar: Pillar
  mood: number
  note: string
  promptText: string
  aiResponse: string
  createdAt: string
}

export interface AssessmentAnswer {
  id: string
  userId: string
  questionId: string
  pillar: Pillar
  answer: string
  createdAt: string
}

export interface Pattern {
  id: string
  userId: string
  pillar: Pillar
  description: string
  frequency: number
  firstSeen: string
  lastSeen: string
  detectedAt: string
}

export interface Strength {
  id: string
  userId: string
  pillar: Pillar
  title: string
  description: string
  createdAt: string
}

export interface Exercise {
  id: string
  pillar: Pillar
  title: string
  description: string
  durationMinutes: number
  sourceAuthor: string
  exerciseType: 'breathing' | 'movement' | 'journaling' | 'inquiry' | 'body'
  createdAt: string
}

export interface CommunityPost {
  id: string
  userId: string
  pillar: Pillar
  content: string
  createdAt: string
  updatedAt: string
}

export interface WeeklyReflection {
  id: string
  userId: string
  weekStart: string
  aiSummary: string
  keyPatterns: string[]
  keyStrengths: string[]
  focusNextWeek: string
  createdAt: string
}

export interface UserExercise {
  id: string
  userId: string
  exerciseId: string
  completedAt: string
  notes: string
}
