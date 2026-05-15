import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go home
      </Link>
    </div>
  )
}
