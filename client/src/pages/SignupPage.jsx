import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'

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
        <Layout>
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-10 mx-4"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/60 mb-8">Join the platform and start playing</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400
          rounded-lg px-4 py-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-white/60 mb-1 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:border-amber-400 outline-none backdrop-blur-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/60 mb-1 block">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:border-amber-400 outline-none backdrop-blur-sm"
                                placeholder="Min 6 characters"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={localLoading}
                            className="w-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3 disabled:opacity-50"
                            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            {localLoading ? 'Creating account...' : 'Sign Up'}
                        </motion.button>
                    </form>

                    <p className="text-white/60 text-sm text-center mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-400 hover:underline">
                            Log in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </Layout>
    )
}