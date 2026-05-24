import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { DiaryEntry, Pillar } from '../types'
import { toDiaryEntry, toDiaryEntryRow } from '../lib/mappers'

const MOOD_EMOJIS: Record<number, string> = {
  1: '😔', 2: '😐', 3: '🙂', 4: '😊', 5: '🌟',
}

const PILLARS: Pillar[] = ['identity', 'body', 'relationships', 'career', 'vision']

const useDiaryData = () => {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(3)
  const [pillar, setPillar] = useState<Pillar>('identity')
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamingReflection, setStreamingReflection] = useState('')

  return {
    content, setContent,
    mood, setMood,
    pillar, setPillar,
    entries, setEntries,
    loading, setLoading,
    saving, setSaving,
    error, setError,
    streamingReflection, setStreamingReflection,
  }
}

const useDiaryMethods = (data: ReturnType<typeof useDiaryData>) => {
  const loadEntries = async () => {
    data.setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: rows, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      data.setEntries((rows ?? []).map(toDiaryEntry))
    } catch (err) {
      data.setError(err instanceof Error ? err.message : 'Failed to load entries.')
    } finally {
      data.setLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const handleSave = async () => {
    if (!data.content.trim()) {
      data.setError('Please write something before saving.')
      return
    }

    data.setSaving(true)
    data.setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const now = new Date().toISOString()
      const entry: DiaryEntry = {
        id: crypto.randomUUID(),
        userId: user.id,
        pillar: data.pillar,
        content: data.content.trim(),
        mood: data.mood,
        aiReflection: '',
        createdAt: now,
        updatedAt: now,
      }

      const { error: insertError } = await supabase
        .from('diary_entries')
        .insert(toDiaryEntryRow(entry))

      if (insertError) throw insertError

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: data.content.trim(), userId: user.id }),
      })

      let aiReflection = ''
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const payload = line.slice(6)
            if (payload === '[DONE]') continue
            try {
              const parsed = JSON.parse(payload)
              if (
                parsed.type === 'content_block_delta' &&
                parsed.delta?.type === 'text_delta'
              ) {
                const text = parsed.delta.text
                aiReflection += text
                data.setStreamingReflection(prev => prev + text)
              }
            } catch {
              // skip malformed chunk
            }
          }
        }
      }

      await supabase
        .from('diary_entries')
        .update({ ai_reflection: aiReflection, updated_at: new Date().toISOString() })
        .eq('id', entry.id)

      data.setStreamingReflection('')
      data.setEntries(prev => [{ ...entry, aiReflection }, ...prev])
      data.setContent('')
    } catch (err) {
      data.setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      data.setSaving(false)
    }
  }

  return { handleSave, loadEntries }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function Diary() {
  const data = useDiaryData()
  const methods = useDiaryMethods(data)

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-semibold text-purple-900 tracking-tight">My diary</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-6 space-y-5">
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-sm font-medium text-purple-800 mb-2.5">How are you feeling?</legend>
            <div className="flex gap-3">
              {([1, 2, 3, 4, 5] as const).map(n => (
                <button
                  key={n}
                  onClick={() => data.setMood(n)}
                  aria-pressed={data.mood === n}
                  aria-label={`Mood ${n}`}
                  className={`text-2xl rounded-2xl px-3 py-2 transition ${
                    data.mood === n
                      ? 'bg-purple-100 ring-2 ring-purple-400'
                      : 'hover:bg-purple-50'
                  }`}
                >
                  {MOOD_EMOJIS[n]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-0 p-0 m-0">
            <legend className="text-sm font-medium text-purple-800 mb-2.5">Area of focus</legend>
            <div className="flex flex-wrap gap-2">
              {PILLARS.map(p => (
                <button
                  key={p}
                  onClick={() => data.setPillar(p)}
                  aria-pressed={data.pillar === p}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                    data.pillar === p
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="diary-content" className="block text-sm font-medium text-purple-800 mb-1.5">
              What's on your mind
            </label>
            <textarea
              id="diary-content"
              value={data.content}
              onChange={e => data.setContent(e.target.value)}
              placeholder="What's on your mind today..."
              aria-describedby={data.error ? 'diary-error' : undefined}
              style={{ minHeight: '120px' }}
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition resize-y"
            />
          </div>

          {data.error && (
            <div id="diary-error" role="alert" className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {data.error}
            </div>
          )}

          <button
            onClick={methods.handleSave}
            disabled={data.saving}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm transition"
          >
            {data.saving ? 'Saving…' : 'Save entry'}
          </button>

          {data.streamingReflection && (
            <div aria-live="polite" aria-atomic="false" className="rounded-2xl bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-800 leading-relaxed">
              {data.streamingReflection}
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-purple-400 rounded-sm align-middle animate-pulse" />
            </div>
          )}
        </div>

        {data.loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          </div>
        ) : data.entries.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Past entries</h2>
            {data.entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-3xl border border-purple-100 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-400">{formatDate(entry.createdAt)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{MOOD_EMOJIS[entry.mood]}</span>
                    <span className="rounded-full bg-purple-50 text-purple-600 text-xs font-medium capitalize px-3 py-1">
                      {entry.pillar}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {entry.content.length > 100 ? entry.content.slice(0, 100) + '…' : entry.content}
                </p>
                {entry.aiReflection && (
                  <div className="rounded-2xl bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-800 leading-relaxed">
                    {entry.aiReflection}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
