import { useState, useEffect } from 'react'
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
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Loading winners...</p>
        </div>
    )

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">Winners</h2>

            {winners.length === 0 ? (
                <p className="text-gray-500 text-sm">No winners yet.</p>
            ) : (
                <div className="space-y-4">
                    {winners.map((w) => (
                        <div key={w.id} className="bg-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-white font-semibold">
                                        {w.profiles?.email}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {w.match_type}-Number Match —
                                        Draw {w.draws?.month}/{w.draws?.year}
                                    </p>
                                </div>
                                <p className="text-green-400 font-bold">
                                    £{w.prize_amount?.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.verification_status === 'approved'
                                    ? 'bg-green-500/20 text-green-400'
                                    : w.verification_status === 'rejected'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {w.verification_status}
                                </span>

                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.payment_status === 'paid'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {w.payment_status}
                                </span>
                            </div>

                            {w.proof_url && (
                                <a
                                    href={w.proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-400 text-xs hover:underline mt-2 block"
                                >
                                    View proof →
                                </a>
                            )}

                            {/* Admin actions */}
                            <div className="flex gap-2 mt-3">
                                {w.verification_status === 'pending' && w.proof_url && (
                                    <>
                                        <button
                                            onClick={() => handleVerify(w.id, 'approved')}
                                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400
                      text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleVerify(w.id, 'rejected')}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400
                      text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {w.verification_status === 'approved' &&
                                    w.payment_status === 'pending' && (
                                        <button
                                            onClick={() => handleMarkPaid(w.id)}
                                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400
                    text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                                        >
                                            Mark as Paid
                                        </button>
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