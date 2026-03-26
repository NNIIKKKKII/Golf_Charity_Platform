import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function WinningsSection() {
    const [winnings, setWinnings] = useState([])
    const [loading, setLoading] = useState(true)
    const [proofUrl, setProofUrl] = useState('')
    const [uploadingId, setUploadingId] = useState(null)

    useEffect(() => {
        fetchWinnings()
    }, [])

    const fetchWinnings = async () => {
        try {
            const res = await api.get('/api/winners/my-winnings')
            setWinnings(res.data.winnings)
        } catch {
            setWinnings([])
        } finally {
            setLoading(false)
        }
    }

    const handleUploadProof = async (id) => {
        if (!proofUrl) return
        setUploadingId(id)
        try {
            await api.put(`/api/winners/${id}/proof`, { proof_url: proofUrl })
            setProofUrl('')
            await fetchWinnings()
        } catch (err) {
            console.error(err)
        } finally {
            setUploadingId(null)
        }
    }

    const getStatusColor = (status) => {
        if (status === 'approved') return 'bg-green-500/20 text-green-300'
        if (status === 'rejected') return 'bg-red-500/20 text-red-400'
        return 'bg-amber-500/20 text-amber-400'
    }

    if (loading) return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 border-t-2 border-amber-400">
            <p className="text-white/60">Loading winnings...</p>
        </div>
    )

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 border-t-2 border-amber-400">
            <h2 className="text-white text-xl font-bold mb-6">My Winnings</h2>

            {winnings.length === 0 ? (
                <p className="text-white/60 text-sm">
                    No winnings yet. Keep entering your scores!
                </p>
            ) : (
                <div className="space-y-4">
                    {winnings.map((w) => (
                        <div key={w.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                                <div>
                                    <p className="text-white font-semibold">
                                        {w.match_type}-Number Match
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        {w.draws?.month}/{w.draws?.year}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-amber-400 font-bold text-lg">
                                        £{w.prize_amount?.toFixed(2)}
                                    </p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${getStatusColor(w.verification_status)}`}>
                                        {w.verification_status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.payment_status === 'paid'
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-white/10 text-white/60'
                                    }`}>
                                    Payment: {w.payment_status}
                                </span>
                            </div>

                            {/* Proof upload */}
                            {w.verification_status === 'pending' && !w.proof_url && (
                                <div className="mt-3 flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="Paste screenshot URL as proof"
                                        value={uploadingId === w.id ? proofUrl : ''}
                                        onChange={(e) => {
                                            setUploadingId(w.id)
                                            setProofUrl(e.target.value)
                                        }}
                                        className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 backdrop-blur-sm"
                                    />
                                    <motion.button
                                        onClick={() => handleUploadProof(w.id)}
                                        className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-3 py-2 rounded-xl text-sm"
                                        style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                                        whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Submit
                                    </motion.button>
                                </div>
                            )}

                            {w.proof_url && (
                                <p className="text-white/60 text-xs mt-2">
                                    ✓ Proof submitted
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}