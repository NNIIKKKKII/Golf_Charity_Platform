import { useState, useEffect } from 'react'
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
        if (status === 'approved') return 'text-green-400 bg-green-500/10'
        if (status === 'rejected') return 'text-red-400 bg-red-500/10'
        return 'text-yellow-400 bg-yellow-500/10'
    }

    if (loading) return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Loading winnings...</p>
        </div>
    )

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">My Winnings</h2>

            {winnings.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No winnings yet. Keep entering your scores!
                </p>
            ) : (
                <div className="space-y-4">
                    {winnings.map((w) => (
                        <div key={w.id} className="bg-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-white font-semibold">
                                        {w.match_type}-Number Match
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {w.draws?.month}/{w.draws?.year}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-400 font-bold text-lg">
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
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-gray-700 text-gray-400'
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
                                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2
                    text-sm border border-gray-600 outline-none
                    focus:border-green-500"
                                    />
                                    <button
                                        onClick={() => handleUploadProof(w.id)}
                                        className="bg-green-500 hover:bg-green-400 text-black
                    font-semibold px-3 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}

                            {w.proof_url && (
                                <p className="text-gray-400 text-xs mt-2">
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