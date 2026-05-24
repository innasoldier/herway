import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types'
import { toUserProfile } from '../lib/mappers'

const SUBSCRIPTION_STYLES: Record<string, string> = {
  free: 'bg-purple-100 text-purple-700',
  paid: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

const useSettingsData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  return {
    profile, setProfile,
    loading, setLoading,
    saving, setSaving,
    error, setError,
    success, setSuccess,
  }
}

const useSettingsMethods = (data: ReturnType<typeof useSettingsData>) => {
  const navigate = useNavigate()

  const loadProfile = async () => {
    data.setLoading(true)
    data.setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: row, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      data.setProfile(toUserProfile(row))
    } catch (err) {
      data.setError(err instanceof Error ? err.message : 'Failed to load profile.')
    } finally {
      data.setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return { loadProfile, handleSignOut }
}

export default function Settings() {
  const data = useSettingsData()
  const methods = useSettingsMethods(data)

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-purple-900 tracking-tight">Settings</h1>

        {data.loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          </div>
        )}

        {data.error && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {data.error}
          </div>
        )}

        {data.success && (
          <div role="status" className="rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm text-teal-700">
            {data.success}
          </div>
        )}

        {!data.loading && data.profile && (
          <>
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-5">
              <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Account</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-purple-400 mb-1">Name</p>
                  <p className="text-sm text-gray-800">{data.profile.name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-400 mb-1">Email</p>
                  <p className="text-sm text-gray-800">{data.profile.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-4">
              <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Subscription</h2>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    SUBSCRIPTION_STYLES[data.profile.subscriptionStatus] ?? SUBSCRIPTION_STYLES.free
                  }`}
                >
                  {data.profile.subscriptionStatus}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-4">
              <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">More</h2>
              <Link
                to="/privacy"
                className="block text-sm text-purple-600 hover:text-purple-800 transition"
              >
                Privacy Policy
              </Link>
            </div>

            <button
              onClick={methods.handleSignOut}
              className="w-full rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-medium py-3 text-sm transition"
            >
              Sign out
            </button>
          </>
        )}

        <p className="text-center text-xs text-purple-200 pt-4">
          Herway v0.1 — built with care
        </p>
      </div>
    </div>
  )
}
