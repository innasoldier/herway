import { Link } from 'react-router-dom'

interface Section {
  heading: string
  content: string | string[]
}

const sections: Section[] = [
  {
    heading: 'What we store',
    content:
      'Your diary entries, mood logs, assessment answers, and AI responses are stored securely in an encrypted database.',
  },
  {
    heading: 'Who can see your data',
    content:
      'Only you. Every entry is protected so no other Herway user can ever access your diary or profile.',
  },
  {
    heading: 'How your data is used',
    content:
      'Your entries are used only to generate your personalised AI responses within the app. Nothing else. Ever.',
  },
  {
    heading: 'Our commitment to you',
    content: [
      'We will never read your personal diary entries.',
      'We will never share your data with third parties.',
      'We will never sell your data.',
      'We will never use your entries for advertising or marketing.',
      'Your words exist only for you.',
    ],
  },
  {
    heading: 'AI responses',
    content:
      'Your messages are sent to Anthropic’s Claude API to generate responses. Anthropic’s privacy policy applies to this processing. Your conversations are not used to train AI models.',
  },
  {
    heading: 'Data security',
    content:
      'Your data is encrypted at rest and in transit. Row-level security means only your account can access your entries — even if someone had your user ID they could not read your diary.',
  },
  {
    heading: 'Delete your data',
    content:
      'You can delete your account and all associated data at any time from Settings. Deletion is permanent and immediate.',
  },
  {
    heading: 'Contact',
    content: 'Questions about your privacy? Email [your email address].',
  },
]

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link
            to="/"
            className="text-sm text-purple-400 hover:text-purple-600 transition"
          >
            &larr; Back
          </Link>
          <h1 className="mt-6 text-3xl font-semibold text-purple-900 tracking-tight">
            Your privacy matters
          </h1>
        </div>

        <div className="space-y-8">
          {sections.map(({ heading, content }) => (
            <div key={heading} className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6">
              <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">
                {heading}
              </h2>
              {Array.isArray(content) ? (
                <ul className="space-y-2">
                  {content.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-purple-300">Last updated: May 2026</p>
      </div>
    </div>
  )
}
