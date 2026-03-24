import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-green-400 font-bold text-xl">
                    ⛳ GolfCharity
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-gray-300 hover:text-white text-sm transition-colors"
                            >
                                Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                                >
                                    Admin
                                </Link>
                            )}
                            <span className="text-gray-500 text-sm">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-800 hover:bg-gray-700 text-white text-sm 
                px-4 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white text-sm transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-green-500 hover:bg-green-400 text-black font-semibold 
                text-sm px-4 py-2 rounded-lg transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}