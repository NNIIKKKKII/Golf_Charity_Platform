import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function CharitiesSection() {
    const [charities, setCharities] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ name: '', description: '', is_featured: false })
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCharities()
    }, [])

    const fetchCharities = async () => {
        try {
            const res = await api.get('/api/charities')
            setCharities(res.data.charities)
        } catch {
            setCharities([])
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        setError(null)
        setAdding(true)
        try {
            await api.post('/api/charities', form)
            setForm({ name: '', description: '', is_featured: false })
            await fetchCharities()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add charity')
        } finally {
            setAdding(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/charities/${id}`)
            await fetchCharities()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-bold mb-6">Charities</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400
        rounded-lg px-4 py-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Add charity form */}
            <form onSubmit={handleAdd} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 space-y-3">
                <h3 className="text-white font-semibold">Add Charity</h3>
                <input
                    type="text"
                    placeholder="Charity name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 backdrop-blur-sm"
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 backdrop-blur-sm resize-none"
                />
                <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                        className="accent-amber-400"
                    />
                    Featured charity
                </label>
                <motion.button
                    type="submit"
                    disabled={adding}
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-50"
                    whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                >
                    {adding ? 'Adding...' : 'Add Charity'}
                </motion.button>
            </form>

            {/* Charities list */}
            {loading ? (
                <p className="text-white/60 text-sm">Loading...</p>
            ) : (
                <div className="space-y-3">
                    {charities.map((c) => (
                        <div key={c.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4
            flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                                <p className="text-white font-semibold">{c.name}</p>
                                <p className="text-white/60 text-sm">{c.description}</p>
                                {c.is_featured && (
                                    <span className="text-amber-400 text-xs">⭐ Featured</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="text-red-400 hover:text-red-300 text-sm
                transition-colors self-start md:ml-4"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}