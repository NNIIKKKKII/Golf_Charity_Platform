import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 border-t-2 border-green-300">
            <p className="text-white/60">Loading scores...</p>
        </div>
    )

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 border-t-2 border-green-300">
            <h2 className="text-white text-xl font-bold mb-6">
                My Scores
                <span className="text-white/60 text-sm font-normal ml-2">
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
            <form onSubmit={handleAddScore} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="number"
                    min="1"
                    max="45"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Score (1-45)"
                    required
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:border-amber-400 outline-none backdrop-blur-sm text-sm"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:border-amber-400 outline-none backdrop-blur-sm text-sm"
                />
                <motion.button
                    type="submit"
                    disabled={adding}
                    className="w-full sm:w-auto bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-4 py-2 rounded-xl disabled:opacity-50 text-sm"
                    style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                    whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                >
                    {adding ? 'Adding...' : 'Add'}
                </motion.button>
            </form>

            {/* Score list */}
            {scores.length === 0 ? (
                <p className="text-white/60 text-sm">No scores yet. Add your first score above.</p>
            ) : (
                <AnimatePresence>
                    <div className="space-y-3">
                        {scores.map((s) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3
            flex items-center justify-between"
                            >
                                {editingId === s.id ? (
                                    <div className="flex gap-2 flex-1">
                                        <input
                                            type="number"
                                            min="1"
                                            max="45"
                                            value={editScore}
                                            onChange={(e) => setEditScore(e.target.value)}
                                            className="w-20 bg-white/10 border border-white/20 text-white rounded-xl px-2 py-1
                    text-sm outline-none backdrop-blur-sm"
                                        />
                                        <input
                                            type="date"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                            className="bg-white/10 border border-white/20 text-white rounded-xl px-2 py-1
                    text-sm outline-none backdrop-blur-sm"
                                        />
                                        <motion.button
                                            onClick={() => handleEditScore(s.id)}
                                            className="bg-green-500/20 text-green-300 text-xs font-semibold
                    px-3 py-1 rounded-xl border border-green-300/30"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Save
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setEditingId(null)}
                                            className="bg-white/10 text-white text-xs px-3 py-1
                    rounded-xl border border-white/20"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <span className="text-amber-400 font-bold text-lg">
                                                {s.score}
                                            </span>
                                            <span className="text-white/60 text-sm">
                                                {new Date(s.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setEditingId(s.id)
                                                setEditScore(s.score)
                                                setEditDate(s.date)
                                            }}
                                            className="text-white/60 hover:text-white text-xs
                    transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {scores.length === 5 && (
                <p className="text-amber-400 text-xs mt-4">
                    ⚠ You have 5 scores. Adding a new one will remove the oldest.
                </p>
            )}
        </div>
    )
}