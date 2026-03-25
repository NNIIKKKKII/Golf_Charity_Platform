import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="font-bold text-xl flex items-center gap-1">
                    <span>⛳</span>
                    <span className="text-amber-400">Golf</span>
                    <span className="text-white">Charity</span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-white hover:text-amber-400 text-sm transition-colors font-medium"                            >
                                Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                                >
                                    Admin
                                </Link>
                            )}
                            <span className="text-white text-sm font-medium">{user.email}</span>                            <motion.button
                                onClick={handleLogout}
                                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3"
                                whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.3 }}
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-white/70 hover:text-white text-sm transition-colors"
                            >
                                Login
                            </Link>
                            <motion.div whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3 }}>
                                <Link
                                    to="/signup"
                                    className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3 inline-block"
                                    style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                                >
                                    Sign Up
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}