import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { PILLAR_COLORS } from '../types'
import type { Pillar } from '../types'

const QUESTIONS: { id: string; pillar: Pillar; text: string }[] = [
  { id: 'q1', pillar: 'identity', text: 'When was the last time you did something purely because you wanted to — not because it was useful, expected, or would make someone else happy?' },
  { id: 'q2', pillar: 'identity', text: 'Complete this sentence: The version of me that everyone sees is... but the version I hide is...' },
  { id: 'q3', pillar: 'relationships', text: 'Think of someone whose disappointment you work hardest to avoid. What would change if their opinion of you did not matter?' },
  { id: 'q4', pillar: 'relationships', text: 'When someone asks how you are, what do you actually say — and what do you leave out?' },
  { id: 'q5', pillar: 'body', text: 'How do you talk to yourself when you look in the mirror or make a mistake?' },
  { id: 'q6', pillar: 'body', text: 'When do you feel most at home in your body? When do you feel most disconnected from it?' },
  { id: 'q7', pillar: 'career', text: 'Is there something you are very good at that you quietly resent doing? What is it?' },
  { id: 'q8', pillar: 'career', text: 'If money and other peoples opinions were removed from the equation, what would you spend your time on?' },
  { id: 'q9', pillar: 'vision', text: 'What is something you want but have never let yourself say out loud?' },
  { id: 'q10', pillar: 'vision', text: 'Finish this sentence: I will know I am living my own life when...' },
]

const answerSchema = z.object({
  answer: z.string().min(10, 'Please share a little more'),
})

type AnswerFormData = z.infer<typeof answerSchema>

const useAssessmentData = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return {
    currentQuestion, setCurrentQuestion,
    saving, setSaving,
    error, setError,
  }
}

const useAssessmentMethods = (data: ReturnType<typeof useAssessmentData>) => {
  const navigate = useNavigate()

  const handleAnswer = async (answer: string) => {
    data.setSaving(true)
    data.setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const question = QUESTIONS[data.currentQuestion]

      const { error: insertError } = await supabase
        .from('assessment_answers')
        .insert({
          user_id: user.id,
          question_id: question.id,
          pillar: question.pillar,
          answer,
        })

      if (insertError) throw insertError

      if (data.currentQuestion === 9) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ assessment_completed: true })
          .eq('id', user.id)

        if (profileError) throw profileError
        navigate('/dashboard')
      } else {
        data.setCurrentQuestion(prev => prev + 1)
      }
    } catch (err) {
      data.setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      data.setSaving(false)
    }
  }

  const handleBack = () => {
    if (data.currentQuestion > 0) {
      data.setCurrentQuestion(prev => prev - 1)
    }
  }

  return { handleAnswer, handleBack }
}

export default function Assessment() {
  const data = useAssessmentData()
  const methods = useAssessmentMethods(data)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  })

  const question = QUESTIONS[data.currentQuestion]
  const isLast = data.currentQuestion === 9
  const progress = (data.currentQuestion / 10) * 100

  const onSubmit = async (formData: AnswerFormData) => {
    await methods.handleAnswer(formData.answer)
    reset()
  }

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full h-1 bg-purple-100">
        <div
          role="progressbar"
          aria-valuenow={data.currentQuestion}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-label="Assessment progress"
          className="h-1 bg-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-[600px] space-y-8">
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${PILLAR_COLORS[question.pillar]}`}>
              {question.pillar}
            </span>
            <span className="text-xs text-purple-300">
              Question {data.currentQuestion + 1} of 10
            </span>
          </div>

          <p className="text-xl font-medium text-purple-900 leading-relaxed text-center">
            {question.text}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea
              {...register('answer')}
              placeholder="Take your time..."
              style={{ minHeight: '140px' }}
              onInput={autoResize}
              disabled={data.saving}
              autoFocus
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition resize-none disabled:opacity-50"
            />

            {errors.answer && (
              <p className="text-sm text-red-500 px-1">{errors.answer.message}</p>
            )}

            {data.error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {data.error}
              </div>
            )}

            <div className="flex gap-3">
              {data.currentQuestion > 0 && (
                <button
                  type="button"
                  onClick={methods.handleBack}
                  disabled={data.saving}
                  aria-label="Go to previous question"
                  className="rounded-xl border border-purple-200 text-purple-600 hover:bg-purple-50 disabled:opacity-50 px-5 py-3 text-sm font-medium transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={data.saving}
                aria-label="Submit answer and continue"
                className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm transition"
              >
                {data.saving ? 'Saving…' : isLast ? 'Finish' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
