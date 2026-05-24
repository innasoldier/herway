import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface ProfileSection {
  strengths: string[]
  growthEdges: string[]
  question: string
}

function parseSummary(summary: string): ProfileSection {
  const strengthsMatch = summary.match(/YOUR STRENGTHS[\s\S]*?(?=YOUR GROWTH EDGES|$)/)
  const growthMatch = summary.match(/YOUR GROWTH EDGES[\s\S]*?(?=A QUESTION FOR YOU|$)/)
  const questionMatch = summary.match(/A QUESTION FOR YOU[\s\S]*$/)

  const extractLines = (block: string | undefined, header: string): string[] => {
    if (!block) return []
    return block
      .replace(header, '')
      .split('\n')
      .map(l => l.replace(/^[-–—•]\s*/, '').trim())
      .filter(Boolean)
  }

  const questionText = questionMatch
    ? questionMatch[0].replace('A QUESTION FOR YOU', '').trim().replace(/^[-–—•]\s*/, '')
    : ''

  return {
    strengths: extractLines(strengthsMatch?.[0], 'YOUR STRENGTHS'),
    growthEdges: extractLines(growthMatch?.[0], 'YOUR GROWTH EDGES'),
    question: questionText,
  }
}

const useProfileData = () => {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasProfile, setHasProfile] = useState(false)

  return {
    summary, setSummary,
    loading, setLoading,
    error, setError,
    hasProfile, setHasProfile,
  }
}

const useProfileMethods = (data: ReturnType<typeof useProfileData>) => {
  const loadProfile = async () => {
    data.setLoading(true)
    data.setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_profile_summary')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      if (profile?.ai_profile_summary) {
        data.setSummary(profile.ai_profile_summary)
        data.setHasProfile(true)
        return
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to generate profile')
      }

      const { summary } = await res.json()

      await supabase
        .from('profiles')
        .update({ ai_profile_summary: summary })
        .eq('id', user.id)

      data.setSummary(summary)
      data.setHasProfile(true)
    } catch (err) {
      data.setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      data.setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const regenerate = async () => {
    data.setSummary('')
    data.setHasProfile(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ ai_profile_summary: null })
      .eq('id', user.id)

    loadProfile()
  }

  return { loadProfile, regenerate }
}

export default function Profile() {
  const data = useProfileData()
  const methods = useProfileMethods(data)

  if (data.loading) {
    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto" />
          <p className="text-sm text-purple-400">Building your profile…</p>
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-purple-800 text-sm leading-relaxed">{data.error}</p>
          <button
            onClick={methods.loadProfile}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-3 transition"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const sections = parseSummary(data.summary)

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-purple-900 tracking-tight">Your profile</h1>
          <Link to="/dashboard" className="text-sm text-purple-400 hover:text-purple-600 transition">
            &larr; Dashboard
          </Link>
        </div>

        {data.hasProfile && (
          <>
            <div className="space-y-4">
              {sections.strengths.length > 0 && (
                <div className="rounded-3xl bg-teal-50 border border-teal-100 p-6 space-y-3">
                  <h2 className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                    Your strengths
                  </h2>
                  <div className="space-y-2">
                    {sections.strengths.map((line, i) => (
                      <p key={i} className="text-sm text-teal-900 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {sections.growthEdges.length > 0 && (
                <div className="rounded-3xl bg-purple-50 border border-purple-100 p-6 space-y-3">
                  <h2 className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
                    Your growth edges
                  </h2>
                  <div className="space-y-2">
                    {sections.growthEdges.map((line, i) => (
                      <p key={i} className="text-sm text-purple-900 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {sections.question && (
                <div className="rounded-3xl bg-white border border-purple-200 border-l-4 border-l-purple-500 p-6">
                  <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">
                    A question for you
                  </h2>
                  <p className="text-lg italic text-purple-900 leading-relaxed">
                    {sections.question}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-purple-300 text-center leading-relaxed px-4">
              This profile grows as you do. Come back after a few weeks of diary entries and it will deepen.
            </p>

            <button
              onClick={methods.regenerate}
              className="w-full rounded-xl border border-purple-200 text-purple-600 hover:bg-purple-50 text-sm font-medium py-3 transition"
            >
              Regenerate profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}
