export type Pillar = 'identity' | 'body' | 'relationships' | 'career' | 'vision'

export type SubscriptionStatus = 'free' | 'paid' | 'cancelled'

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

export interface DiaryEntry {
  id: string
  userId: string
  pillar: Pillar
  content: string
  mood: number
  promptText: string
  aiReflection: string
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  pillar: Pillar
  text: string
  orderIndex: number
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
  pillar: Pillar
  questionIds: string[]
  generatedAt: string
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
