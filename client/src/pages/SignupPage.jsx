import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [localLoading, setLocalLoading] = useState(false)
    const { signUp, error } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalLoading(true)
        const result = await signUp(email, password)
        setLocalLoading(false)
        if (result.success) {
            navigate('/login')
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-gray-400 mb-8">Join the platform and start playing</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 
          rounded-lg px-4 py-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 
              outline-none border border-gray-700 focus:border-green-500 
              transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 
              outline-none border border-gray-700 focus:border-green-500 
              transition-colors"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={localLoading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 
            text-black font-semibold rounded-lg px-4 py-3 transition-colors"
                    >
                        {localLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-gray-400 text-sm text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}