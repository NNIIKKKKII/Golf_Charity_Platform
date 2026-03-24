import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function CharitySection() {
    const [charities, setCharities] = useState([])
    const [myCharity, setMyCharity] = useState(null)
    const [selectedId, setSelectedId] = useState('')
    const [percentage, setPercentage] = useState(10)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [charitiesRes, myCharityRes] = await Promise.all([
                api.get('/api/charities'),
                api.get('/api/charities/my/selection').catch(() => ({ data: null }))
            ])
            setCharities(charitiesRes.data.charities)
            setMyCharity(myCharityRes.data?.selection || null)
            if (myCharityRes.data?.selection) {
                setSelectedId(myCharityRes.data.selection.charity_id)
                setPercentage(myCharityRes.data.selection.contribution_percentage)
            }
        } catch {
            setCharities([])
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!selectedId) return
        setError(null)
        setSaving(true)
        try {
            await api.post('/api/charities/select', {
                charity_id: selectedId,
                contribution_percentage: percentage
            })
            await fetchData()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save charity')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Loading charities...</p>
        </div>
    )

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">My Charity</h2>

            {myCharity && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl
        p-4 mb-6">
                    <p className="text-green-400 text-sm font-medium">Currently supporting</p>
                    <p className="text-white font-bold text-lg">
                        {myCharity.charities?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                        {myCharity.contribution_percentage}% of your subscription
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400
        rounded-lg px-4 py-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                        Select a charity
                    </label>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
            border border-gray-700 focus:border-green-500 outline-none text-sm"
                    >
                        <option value="">Choose a charity...</option>
                        {charities.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                        Contribution: {percentage}%
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={percentage}
                        onChange={(e) => setPercentage(parseInt(e.target.value))}
                        className="w-full accent-green-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10% (minimum)</span>
                        <span>100%</span>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving || !selectedId}
                    className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50
          text-black font-semibold py-3 rounded-xl transition-colors"
                >
                    {saving ? 'Saving...' : 'Save Charity Selection'}
                </button>
            </div>
        </div>
    )
}