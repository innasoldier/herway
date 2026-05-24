import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types'
import { toUserProfileRow } from '../lib/mappers'

const useSignupData = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    loading, setLoading,
    error, setError,
  }
}

const useSignupMethods = (data: ReturnType<typeof useSignupData>) => {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  data.setLoading(true)
  data.setError(null)

  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (signUpError || !authData.user) {
      data.setError(signUpError?.message ?? 'Something went wrong.')
      return
    }

    const now = new Date().toISOString()
    const profile: UserProfile = {
      id: authData.user.id,
      name: data.name,
      email: data.email,
      avatarUrl: null,
      subscriptionStatus: 'free',
      pillarFocus: null,
      assessmentCompleted: false,
      notificationToken: null,
      createdAt: now,
      updatedAt: now,
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert(toUserProfileRow(profile))

    if (profileError) {
      data.setError(profileError.message)
      return
    }

    navigate('/assessment')

  } catch (err) {
    data.setError('An unexpected error occurred. Please try again.')
    console.error('Signup error:', err)

  } finally {
    data.setLoading(false)
  }
}

  return { handleSubmit }
}

export default function Signup() {
  const data = useSignupData()
  const methods = useSignupMethods(data)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-purple-900 tracking-tight">Create your account</h1>
          <p className="mt-2 text-purple-400 text-sm">Your journey begins here</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-8">
          <form onSubmit={methods.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-800 mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={data.name}
                onChange={e => data.setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-800 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={data.email}
                onChange={e => data.setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-800 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={data.password}
                onChange={e => data.setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>

            {data.error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {data.error}
              </div>
            )}

            <button
              type="submit"
              disabled={data.loading}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 text-sm transition"
            >
              {data.loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-purple-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:text-purple-800 transition">
            Sign in
          </Link>
        </p>

        <p className="text-center mt-3 text-xs text-purple-300">
          <Link to="/privacy" className="hover:text-purple-500 transition">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}