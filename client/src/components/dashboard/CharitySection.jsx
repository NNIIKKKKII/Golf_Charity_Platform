import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'

export default function CharitySection() {
    const [charities, setCharities] = useState([])
    const [myCharity, setMyCharity] = useState(null)
    const [selectedId, setSelectedId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [percentage, setPercentage] = useState(10)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        fetchData()
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
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
                setSelectedName(myCharityRes.data.selection.charities?.name)
                setPercentage(myCharityRes.data.selection.contribution_percentage)
            }
        } catch {
            setCharities([])
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (charity) => {
        setSelectedId(charity.id)
        setSelectedName(charity.name)
        setOpen(false)
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
        <div className="bg-white/10 backdrop-blur-md border border-white/20
    border-t-2 border-t-green-300 rounded-2xl p-6">
            <p className="text-white/60">Loading charities...</p>
        </div>
    )

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20
    border-t-2 border-t-green-300 rounded-2xl p-6">
            <h2 className="text-white text-xl font-bold mb-6">My Charity</h2>

            {myCharity && (
                <div className="bg-green-500/10 border-l-4 border-green-300
        rounded-xl p-4 mb-6">
                    <p className="text-green-300 text-sm font-medium">
                        Currently supporting
                    </p>
                    <p className="text-white font-bold text-lg">
                        {myCharity.charities?.name}
                    </p>
                    <p className="text-white/60 text-sm">
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
                {/* Custom dropdown */}
                <div>
                    <label className="text-white/60 text-sm mb-2 block">
                        Select a charity
                    </label>
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="w-full bg-white/10 backdrop-blur-sm border
              border-white/20 text-white rounded-xl px-4 py-3 text-left
              flex items-center justify-between hover:bg-white/15
              transition-colors focus:border-amber-400 outline-none"
                        >
                            <span className={selectedName ? 'text-white' : 'text-white/40'}>
                                {selectedName || 'Choose a charity...'}
                            </span>
                            <span className="text-white/60 ml-2">
                                {open ? '▲' : '▼'}
                            </span>
                        </button>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-50 w-full mt-2 bg-gray-900/95
                  backdrop-blur-md border border-white/20 rounded-xl
                  overflow-hidden shadow-xl"
                                >
                                    {charities.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => handleSelect(c)}
                                            className={`w-full text-left px-4 py-3 text-sm
                      transition-colors hover:bg-white/10
                      ${selectedId === c.id
                                                    ? 'text-green-300 bg-green-500/10'
                                                    : 'text-white'
                                                }`}
                                        >
                                            {c.is_featured && (
                                                <span className="text-amber-400 mr-2">⭐</span>
                                            )}
                                            {c.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Range slider */}
                <div>
                    <label className="text-white/60 text-sm mb-2 block">
                        Contribution: {percentage}%
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={percentage}
                        onChange={(e) => setPercentage(parseInt(e.target.value))}
                        className="w-full accent-amber-400"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>10% (minimum)</span>
                        <span>100%</span>
                    </div>
                </div>

                <motion.button
                    onClick={handleSave}
                    disabled={saving || !selectedId}
                    className="w-full bg-white/15 backdrop-blur-sm border
          border-white/30 text-white font-semibold py-3 rounded-xl
          disabled:opacity-50"
                    style={{ boxShadow: '0 0 20px rgba(134,239,172,0.3)' }}
                    whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                >
                    {saving ? 'Saving...' : 'Save Charity Selection'}
                </motion.button>
            </div>
        </div>
    )
}