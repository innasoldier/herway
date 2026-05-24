import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-semibold text-purple-900">Dashboard</h1>
      <Link
        to="/profile"
        className="text-sm text-purple-600 font-medium hover:text-purple-800 transition"
      >
        View your profile &rarr;
      </Link>
    </div>
  )
}
