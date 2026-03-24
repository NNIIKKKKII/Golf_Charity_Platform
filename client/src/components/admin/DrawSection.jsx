import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function DrawSection() {
    const [draws, setDraws] = useState([])
    const [loading, setLoading] = useState(true)
    const [running, setRunning] = useState(false)
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        draw_type: 'random',
        status: 'simulation'
    })

    useEffect(() => {
        fetchDraws()
    }, [])

    const fetchDraws = async () => {
        try {
            const res = await api.get('/api/draws/all')
            setDraws(res.data.draws)
        } catch {
            setDraws([])
        } finally {
            setLoading(false)
        }
    }

    const handleRunDraw = async () => {
        setError(null)
        setRunning(true)
        try {
            await api.post('/api/draws/run', form)
            await fetchDraws()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to run draw')
        } finally {
            setRunning(false)
        }
    }

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">Draw Management</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400
        rounded-lg px-4 py-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Run draw form */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-4">Run New Draw</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-gray-400 text-xs mb-1 block">Month</label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={form.month}
                            onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
              text-sm border border-gray-600 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs mb-1 block">Year</label>
                        <input
                            type="number"
                            value={form.year}
                            onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
              text-sm border border-gray-600 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs mb-1 block">Draw Type</label>
                        <select
                            value={form.draw_type}
                            onChange={(e) => setForm({ ...form, draw_type: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
              text-sm border border-gray-600 outline-none focus:border-green-500"
                        >
                            <option value="random">Random</option>
                            <option value="algorithmic">Algorithmic</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs mb-1 block">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
              text-sm border border-gray-600 outline-none focus:border-green-500"
                        >
                            <option value="simulation">Simulation</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleRunDraw}
                    disabled={running}
                    className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50
          text-black font-semibold py-3 rounded-xl transition-colors"
                >
                    {running ? 'Running...' : 'Run Draw'}
                </button>
            </div>

            {/* Draws list */}
            {loading ? (
                <p className="text-gray-400 text-sm">Loading draws...</p>
            ) : draws.length === 0 ? (
                <p className="text-gray-500 text-sm">No draws yet.</p>
            ) : (
                <div className="space-y-3">
                    {draws.map((d) => (
                        <div key={d.id} className="bg-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white font-semibold">
                                    {d.month}/{d.year} — {d.draw_type}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === 'published'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {d.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Winning numbers: {d.drawn_numbers?.join(', ')}
                            </p>
                            {d.jackpot_amount > 0 && (
                                <p className="text-yellow-400 text-xs mt-1">
                                    Jackpot carried: £{d.jackpot_amount}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}