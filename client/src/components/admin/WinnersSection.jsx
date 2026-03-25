import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function WinnersSection() {
    const [winners, setWinners] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWinners()
    }, [])

    const fetchWinners = async () => {
        try {
            const res = await api.get('/api/winners/all')
            setWinners(res.data.winners)
        } catch {
            setWinners([])
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (id, status) => {
        try {
            await api.put(`/api/winners/${id}/verify`, { verification_status: status })
            await fetchWinners()
        } catch (err) {
            console.error(err)
        }
    }

    const handleMarkPaid = async (id) => {
        try {
            await api.put(`/api/winners/${id}/pay`)
            await fetchWinners()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <p className="text-white/60">Loading winners...</p>
        </div>
    )

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-bold mb-6">Winners</h2>

            {winners.length === 0 ? (
                <p className="text-white/60 text-sm">No winners yet.</p>
            ) : (
                <div className="space-y-4">
                    {winners.map((w) => (
                        <div key={w.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-white font-semibold">
                                        {w.profiles?.email}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        {w.match_type}-Number Match —
                                        Draw {w.draws?.month}/{w.draws?.year}
                                    </p>
                                </div>
                                <p className="text-amber-400 font-bold">
                                    £{w.prize_amount?.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.verification_status === 'approved'
                                    ? 'bg-green-500/20 text-green-300'
                                    : w.verification_status === 'rejected'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {w.verification_status}
                                </span>

                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.payment_status === 'paid'
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-white/10 text-white/60'
                                    }`}>
                                    {w.payment_status}
                                </span>
                            </div>

                            {w.proof_url && (
                                <a
                                    href={w.proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-400 text-xs hover:underline mt-2 block"
                                >
                                    View proof →
                                </a>
                            )}

                            {/* Admin actions */}
                            <div className="flex gap-2 mt-3">
                                {w.verification_status === 'pending' && w.proof_url && (
                                    <>
                                        <motion.button
                                            onClick={() => handleVerify(w.id, 'approved')}
                                            className="bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-xl border border-green-300/30"
                                            style={{ boxShadow: '0 0 20px rgba(134,239,172,0.3)' }}
                                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Approve
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleVerify(w.id, 'rejected')}
                                            className="bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-xl border border-red-400/30"
                                            style={{ boxShadow: '0 0 20px rgba(248,113,113,0.3)' }}
                                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Reject
                                        </motion.button>
                                    </>
                                )}
                                {w.verification_status === 'approved' &&
                                    w.payment_status === 'pending' && (
                                        <motion.button
                                            onClick={() => handleMarkPaid(w.id)}
                                            className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-xl border border-amber-400/30"
                                            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Mark as Paid
                                        </motion.button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    )
}