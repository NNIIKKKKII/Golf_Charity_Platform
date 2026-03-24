import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function ScoreSection() {
    const [scores, setScores] = useState([])
    const [score, setScore] = useState('')
    const [date, setDate] = useState('')
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editScore, setEditScore] = useState('')
    const [editDate, setEditDate] = useState('')

    useEffect(() => {
        fetchScores()
    }, [])

    const fetchScores = async () => {
        try {
            const res = await api.get('/api/scores/me')
            setScores(res.data.scores)
        } catch {
            setScores([])
        } finally {
            setLoading(false)
        }
    }

    const handleAddScore = async (e) => {
        e.preventDefault()
        setError(null)
        setAdding(true)
        try {
            await api.post('/api/scores', {
                score: parseInt(score),
                date
            })
            setScore('')
            setDate('')
            await fetchScores()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add score')
        } finally {
            setAdding(false)
        }
    }

    const handleEditScore = async (id) => {
        try {
            await api.put(`/api/scores/${id}`, {
                score: parseInt(editScore),
                date: editDate
            })
            setEditingId(null)
            await fetchScores()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update score')
        }
    }

    if (loading) return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Loading scores...</p>
        </div>
    )

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">
                My Scores
                <span className="text-gray-500 text-sm font-normal ml-2">
                    ({scores.length}/5)
                </span>
            </h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400
        rounded-lg px-4 py-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Add score form */}
            <form onSubmit={handleAddScore} className="flex gap-3 mb-6">
                <input
                    type="number"
                    min="1"
                    max="45"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Score (1-45)"
                    required
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2
          border border-gray-700 focus:border-green-500 outline-none text-sm"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2
          border border-gray-700 focus:border-green-500 outline-none text-sm"
                />
                <button
                    type="submit"
                    disabled={adding}
                    className="bg-green-500 hover:bg-green-400 disabled:opacity-50
          text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    {adding ? 'Adding...' : 'Add'}
                </button>
            </form>

            {/* Score list */}
            {scores.length === 0 ? (
                <p className="text-gray-500 text-sm">No scores yet. Add your first score above.</p>
            ) : (
                <div className="space-y-3">
                    {scores.map((s) => (
                        <div key={s.id} className="bg-gray-800 rounded-xl px-4 py-3
            flex items-center justify-between">
                            {editingId === s.id ? (
                                <div className="flex gap-2 flex-1">
                                    <input
                                        type="number"
                                        min="1"
                                        max="45"
                                        value={editScore}
                                        onChange={(e) => setEditScore(e.target.value)}
                                        className="w-20 bg-gray-700 text-white rounded px-2 py-1
                    text-sm border border-gray-600 outline-none"
                                    />
                                    <input
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                        className="bg-gray-700 text-white rounded px-2 py-1
                    text-sm border border-gray-600 outline-none"
                                    />
                                    <button
                                        onClick={() => handleEditScore(s.id)}
                                        className="bg-green-500 text-black text-xs font-semibold
                    px-3 py-1 rounded transition-colors hover:bg-green-400"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-600 text-white text-xs px-3 py-1
                    rounded transition-colors hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <span className="text-green-400 font-bold text-lg">
                                            {s.score}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {new Date(s.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingId(s.id)
                                            setEditScore(s.score)
                                            setEditDate(s.date)
                                        }}
                                        className="text-gray-500 hover:text-white text-xs
                    transition-colors"
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {scores.length === 5 && (
                <p className="text-yellow-400 text-xs mt-4">
                    ⚠ You have 5 scores. Adding a new one will remove the oldest.
                </p>
            )}
        </div>
    )
}