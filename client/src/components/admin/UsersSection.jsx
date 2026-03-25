import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function UsersSection() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users')
            setUsers(res.data.users)
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <p className="text-white/60">Loading users...</p>
        </div>
    )

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-bold mb-6">
                Users
                <span className="text-white/60 text-sm font-normal ml-2">
                    ({users.length} total)
                </span>
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-white/60 border-b border-white/20">
                            <th className="text-left py-3 pr-4">Email</th>
                            <th className="text-left py-3 pr-4">Role</th>
                            <th className="text-left py-3 pr-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                <td className="py-3 pr-4 text-white">{u.email}</td>
                                <td className="py-3 pr-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : u.role === 'subscriber'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-white/10 text-white/50'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-3 pr-4 text-white/40">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}