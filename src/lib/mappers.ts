import type {
  UserProfile,
  DiaryEntry,
  Question,
  QuestionnaireResponse,
  AdaptiveQuestionSet,
  CheckIn,
  AssessmentAnswer,
  Pattern,
  Strength,
  Exercise,
  WeeklyReflection,
  UserExercise,
  CommunityPost,
  Pillar,
  SubscriptionStatus,
} from '../types'

// ---------------------------------------------------------------------------
// Row types (snake_case database representation)
// ---------------------------------------------------------------------------

type ProfileRow = {
  id: string
  name: string
  email: string
  avatar_url: string
  subscription_status: SubscriptionStatus
  created_at: string
  updated_at: string
}

type DiaryEntryRow = {
  id: string
  user_id: string
  pillar: Pillar
  content: string
  mood: number
  prompt_text: string
  ai_response: string
  created_at: string
}

type QuestionRow = {
  id: string
  pillar: Pillar
  text: string
  order_index: number
  created_at: string
}

type QuestionnaireResponseRow = {
  id: string
  user_id: string
  question_id: string
  pillar: Pillar
  answer: string
  created_at: string
}

type AdaptiveQuestionSetRow = {
  id: string
  user_id: string
  pillar: Pillar
  question_ids: string[]
  generated_at: string
  created_at: string
}

type CheckInRow = {
  id: string
  user_id: string
  pillar: Pillar
  mood: number
  note: string
  prompt_text: string
  ai_response: string
  created_at: string
}

type AssessmentAnswerRow = {
  id: string
  user_id: string
  question_id: string
  pillar: Pillar
  answer: string
  created_at: string
}

type PatternRow = {
  id: string
  user_id: string
  pillar: Pillar
  description: string
  frequency: number
  first_seen: string
  last_seen: string
  detected_at: string
}

type StrengthRow = {
  id: string
  user_id: string
  pillar: Pillar
  title: string
  description: string
  created_at: string
}

type ExerciseRow = {
  id: string
  pillar: Pillar
  title: string
  description: string
  duration_minutes: number
  source_author: string
  exercise_type: Exercise['exerciseType']
  created_at: string
}

type WeeklyReflectionRow = {
  id: string
  user_id: string
  week_start: string
  ai_summary: string
  key_patterns: string[]
  key_strengths: string[]
  focus_next_week: string
  created_at: string
}

type UserExerciseRow = {
  id: string
  user_id: string
  exercise_id: string
  completed_at: string
  notes: string
}

type CommunityPostRow = {
  id: string
  user_id: string
  pillar: Pillar
  content: string
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// UserProfile
// ---------------------------------------------------------------------------

function toProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
    subscriptionStatus: row.subscription_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toProfileRow(profile: UserProfile): ProfileRow {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar_url: profile.avatarUrl,
    subscription_status: profile.subscriptionStatus,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  }
}

// ---------------------------------------------------------------------------
// DiaryEntry
// ---------------------------------------------------------------------------

function toDiaryEntry(row: DiaryEntryRow): DiaryEntry {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    content: row.content,
    mood: row.mood,
    promptText: row.prompt_text,
    aiResponse: row.ai_response,
    createdAt: row.created_at,
  }
}

function toDiaryEntryRow(entry: DiaryEntry): DiaryEntryRow {
  return {
    id: entry.id,
    user_id: entry.userId,
    pillar: entry.pillar,
    content: entry.content,
    mood: entry.mood,
    prompt_text: entry.promptText,
    ai_response: entry.aiResponse,
    created_at: entry.createdAt,
  }
}

// ---------------------------------------------------------------------------
// Question
// ---------------------------------------------------------------------------

function toQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    pillar: row.pillar,
    text: row.text,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  }
}

function toQuestionRow(question: Question): QuestionRow {
  return {
    id: question.id,
    pillar: question.pillar,
    text: question.text,
    order_index: question.orderIndex,
    created_at: question.createdAt,
  }
}

// ---------------------------------------------------------------------------
// QuestionnaireResponse
// ---------------------------------------------------------------------------

function toQuestionnaireResponse(row: QuestionnaireResponseRow): QuestionnaireResponse {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    pillar: row.pillar,
    answer: row.answer,
    createdAt: row.created_at,
  }
}

function toQuestionnaireResponseRow(response: QuestionnaireResponse): QuestionnaireResponseRow {
  return {
    id: response.id,
    user_id: response.userId,
    question_id: response.questionId,
    pillar: response.pillar,
    answer: response.answer,
    created_at: response.createdAt,
  }
}

// ---------------------------------------------------------------------------
// AdaptiveQuestionSet
// ---------------------------------------------------------------------------

function toAdaptiveQuestionSet(row: AdaptiveQuestionSetRow): AdaptiveQuestionSet {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    questionIds: row.question_ids,
    generatedAt: row.generated_at,
    createdAt: row.created_at,
  }
}

function toAdaptiveQuestionSetRow(set: AdaptiveQuestionSet): AdaptiveQuestionSetRow {
  return {
    id: set.id,
    user_id: set.userId,
    pillar: set.pillar,
    question_ids: set.questionIds,
    generated_at: set.generatedAt,
    created_at: set.createdAt,
  }
}

// ---------------------------------------------------------------------------
// CheckIn
// ---------------------------------------------------------------------------

function toCheckIn(row: CheckInRow): CheckIn {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    mood: row.mood,
    note: row.note,
    promptText: row.prompt_text,
    aiResponse: row.ai_response,
    createdAt: row.created_at,
  }
}

function toCheckInRow(checkIn: CheckIn): CheckInRow {
  return {
    id: checkIn.id,
    user_id: checkIn.userId,
    pillar: checkIn.pillar,
    mood: checkIn.mood,
    note: checkIn.note,
    prompt_text: checkIn.promptText,
    ai_response: checkIn.aiResponse,
    created_at: checkIn.createdAt,
  }
}

// ---------------------------------------------------------------------------
// AssessmentAnswer
// ---------------------------------------------------------------------------

function toAssessmentAnswer(row: AssessmentAnswerRow): AssessmentAnswer {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    pillar: row.pillar,
    answer: row.answer,
    createdAt: row.created_at,
  }
}

function toAssessmentAnswerRow(answer: AssessmentAnswer): AssessmentAnswerRow {
  return {
    id: answer.id,
    user_id: answer.userId,
    question_id: answer.questionId,
    pillar: answer.pillar,
    answer: answer.answer,
    created_at: answer.createdAt,
  }
}

// ---------------------------------------------------------------------------
// Pattern
// ---------------------------------------------------------------------------

function toPattern(row: PatternRow): Pattern {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    description: row.description,
    frequency: row.frequency,
    firstSeen: row.first_seen,
    lastSeen: row.last_seen,
    detectedAt: row.detected_at,
  }
}

function toPatternRow(pattern: Pattern): PatternRow {
  return {
    id: pattern.id,
    user_id: pattern.userId,
    pillar: pattern.pillar,
    description: pattern.description,
    frequency: pattern.frequency,
    first_seen: pattern.firstSeen,
    last_seen: pattern.lastSeen,
    detected_at: pattern.detectedAt,
  }
}

// ---------------------------------------------------------------------------
// Strength
// ---------------------------------------------------------------------------

function toStrength(row: StrengthRow): Strength {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  }
}

function toStrengthRow(strength: Strength): StrengthRow {
  return {
    id: strength.id,
    user_id: strength.userId,
    pillar: strength.pillar,
    title: strength.title,
    description: strength.description,
    created_at: strength.createdAt,
  }
}

// ---------------------------------------------------------------------------
// Exercise
// ---------------------------------------------------------------------------

function toExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    pillar: row.pillar,
    title: row.title,
    description: row.description,
    durationMinutes: row.duration_minutes,
    sourceAuthor: row.source_author,
    exerciseType: row.exercise_type,
    createdAt: row.created_at,
  }
}

function toExerciseRow(exercise: Exercise): ExerciseRow {
  return {
    id: exercise.id,
    pillar: exercise.pillar,
    title: exercise.title,
    description: exercise.description,
    duration_minutes: exercise.durationMinutes,
    source_author: exercise.sourceAuthor,
    exercise_type: exercise.exerciseType,
    created_at: exercise.createdAt,
  }
}

// ---------------------------------------------------------------------------
// WeeklyReflection
// ---------------------------------------------------------------------------

function toWeeklyReflection(row: WeeklyReflectionRow): WeeklyReflection {
  return {
    id: row.id,
    userId: row.user_id,
    weekStart: row.week_start,
    aiSummary: row.ai_summary,
    keyPatterns: row.key_patterns,
    keyStrengths: row.key_strengths,
    focusNextWeek: row.focus_next_week,
    createdAt: row.created_at,
  }
}

function toWeeklyReflectionRow(reflection: WeeklyReflection): WeeklyReflectionRow {
  return {
    id: reflection.id,
    user_id: reflection.userId,
    week_start: reflection.weekStart,
    ai_summary: reflection.aiSummary,
    key_patterns: reflection.keyPatterns,
    key_strengths: reflection.keyStrengths,
    focus_next_week: reflection.focusNextWeek,
    created_at: reflection.createdAt,
  }
}

// ---------------------------------------------------------------------------
// UserExercise
// ---------------------------------------------------------------------------

function toUserExercise(row: UserExerciseRow): UserExercise {
  return {
    id: row.id,
    userId: row.user_id,
    exerciseId: row.exercise_id,
    completedAt: row.completed_at,
    notes: row.notes,
  }
}

function toUserExerciseRow(userExercise: UserExercise): UserExerciseRow {
  return {
    id: userExercise.id,
    user_id: userExercise.userId,
    exercise_id: userExercise.exerciseId,
    completed_at: userExercise.completedAt,
    notes: userExercise.notes,
  }
}

// ---------------------------------------------------------------------------
// CommunityPost
// ---------------------------------------------------------------------------

function toCommunityPost(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    userId: row.user_id,
    pillar: row.pillar,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toCommunityPostRow(post: CommunityPost): CommunityPostRow {
  return {
    id: post.id,
    user_id: post.userId,
    pillar: post.pillar,
    content: post.content,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
  }
}

// ---------------------------------------------------------------------------
// Unified mappers object
// ---------------------------------------------------------------------------

export const mappers = {
  toProfile,
  toProfileRow,
  toDiaryEntry,
  toDiaryEntryRow,
  toQuestion,
  toQuestionRow,
  toQuestionnaireResponse,
  toQuestionnaireResponseRow,
  toAdaptiveQuestionSet,
  toAdaptiveQuestionSetRow,
  toCheckIn,
  toCheckInRow,
  toAssessmentAnswer,
  toAssessmentAnswerRow,
  toPattern,
  toPatternRow,
  toStrength,
  toStrengthRow,
  toExercise,
  toExerciseRow,
  toWeeklyReflection,
  toWeeklyReflectionRow,
  toUserExercise,
  toUserExerciseRow,
  toCommunityPost,
  toCommunityPostRow,
}
