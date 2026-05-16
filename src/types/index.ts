export type Pillar = 'identity' | 'body' | 'relationships' | 'career' | 'vision'

export type SubscriptionStatus = 'free' | 'paid' | 'cancelled'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string
  subscriptionStatus: SubscriptionStatus
  createdAt: string
  updatedAt: string
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
