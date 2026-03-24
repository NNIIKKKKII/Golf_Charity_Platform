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
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Loading users...</p>
        </div>
    )

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">
                Users
                <span className="text-gray-500 text-sm font-normal ml-2">
                    ({users.length} total)
                </span>
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-800">
                            <th className="text-left py-3 pr-4">Email</th>
                            <th className="text-left py-3 pr-4">Role</th>
                            <th className="text-left py-3 pr-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-gray-800/50
              hover:bg-gray-800/30 transition-colors">
                                <td className="py-3 pr-4 text-white">{u.email}</td>
                                <td className="py-3 pr-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-gray-700 text-gray-300'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-3 pr-4 text-gray-400">
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