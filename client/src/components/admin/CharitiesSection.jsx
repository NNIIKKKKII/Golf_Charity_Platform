import { useState, useEffect } from 'react'
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
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">Charities</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400
        rounded-lg px-4 py-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Add charity form */}
            <form onSubmit={handleAdd} className="bg-gray-800 rounded-xl p-4 mb-6 space-y-3">
                <h3 className="text-white font-semibold">Add Charity</h3>
                <input
                    type="text"
                    placeholder="Charity name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
          text-sm border border-gray-600 outline-none focus:border-green-500"
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
          text-sm border border-gray-600 outline-none focus:border-green-500 resize-none"
                />
                <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                        className="accent-green-500"
                    />
                    Featured charity
                </label>
                <button
                    type="submit"
                    disabled={adding}
                    className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50
          text-black font-semibold py-2 rounded-xl text-sm transition-colors"
                >
                    {adding ? 'Adding...' : 'Add Charity'}
                </button>
            </form>

            {/* Charities list */}
            {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
            ) : (
                <div className="space-y-3">
                    {charities.map((c) => (
                        <div key={c.id} className="bg-gray-800 rounded-xl p-4
            flex items-center justify-between">
                            <div>
                                <p className="text-white font-semibold">{c.name}</p>
                                <p className="text-gray-400 text-sm">{c.description}</p>
                                {c.is_featured && (
                                    <span className="text-yellow-400 text-xs">⭐ Featured</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="text-red-400 hover:text-red-300 text-sm
                transition-colors ml-4"
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