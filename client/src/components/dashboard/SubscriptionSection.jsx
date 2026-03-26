import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'

export default function SubscriptionSection() {
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subscribing, setSubscribing] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    useEffect(() => {
        fetchSubscription()
    }, [])

    const fetchSubscription = async () => {
        try {
            const res = await api.get('/api/subscription/me')
            setSubscription(res.data)
        } catch {
            setSubscription(null)
        } finally {
            setLoading(false)
        }
    }

    const handleMockSubscribe = async (plan) => {
        setSubscribing(true)
        try {
            await api.post('/api/subscription/mock-subscribe', { plan })
            await fetchSubscription()
        } catch (err) {
            console.error(err)
        } finally {
            setSubscribing(false)
        }
    }

    if (loading) return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20
    rounded-2xl p-6 border-t-2 border-amber-400">
            <p className="text-white/60">Loading subscription...</p>
        </div>
    )

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20
    rounded-2xl p-6 border-t-2 border-amber-400">
            <h2 className="text-white text-xl font-bold mb-6">Subscription</h2>

            {subscription ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <motion.span
                            animate={subscription.status === 'active' ? {
                                boxShadow: [
                                    '0 0 0 0 rgba(134, 239, 172, 0.7)',
                                    '0 0 0 10px rgba(134, 239, 172, 0)',
                                ]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.status === 'active'
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                        >
                            {subscription.status?.toUpperCase()}
                        </motion.span>
                        <span className="text-amber-400 text-sm capitalize font-semibold">
                            {subscription.plan} plan
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-white/70 text-xs mb-1">Renewal Date</p>
                            <p className="text-white font-semibold">
                                {subscription.current_period_end
                                    ? new Date(subscription.current_period_end).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-white/70 text-xs mb-1">Charity Contribution</p>
                            <p className="text-white font-semibold">
                                {subscription.charity_percentage}%
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-white/60">
                        You don't have an active subscription.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.button
                            onClick={() => {
                                setSelectedPlan('monthly')
                                setShowModal(true)
                            }}
                            disabled={subscribing}
                            className="bg-white/15 backdrop-blur-sm border border-white/30
              text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            Monthly Plan
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                setSelectedPlan('yearly')
                                setShowModal(true)
                            }}
                            disabled={subscribing}
                            className="bg-white/15 backdrop-blur-sm border border-white/30
              text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                            style={{ boxShadow: '0 0 20px rgba(134,239,172,0.3)' }}
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            Yearly Plan
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Modal rendered at document.body level via Portal */}
            {createPortal(
                <AnimatePresence>
                    {showModal && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm
              flex items-center justify-center px-4"
                            style={{ zIndex: 9999 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20
                rounded-3xl p-8 max-w-md w-full"
                            >
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">🏌️</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Payment Gateway Notice
                                    </h3>
                                    <p className="text-white/60 leading-relaxed">
                                        Stripe payments are currently available in India
                                        by invite only. We are working on enabling live
                                        payments soon.
                                        <br /><br />
                                        In the meantime, activate a free demo subscription
                                        to explore all platform features fully.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <motion.button
                                        onClick={async () => {
                                            await handleMockSubscribe(selectedPlan)
                                            setShowModal(false)
                                        }}
                                        disabled={subscribing}
                                        className="w-full bg-white/15 backdrop-blur-sm border
                    border-white/30 text-white font-semibold rounded-xl
                    px-6 py-3 disabled:opacity-50"
                                        style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                                        whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {subscribing ? 'Activating...' : 'Activate Demo Access'}
                                    </motion.button>

                                    <motion.button
                                        onClick={() => setShowModal(false)}
                                        className="w-full bg-white/10 backdrop-blur-sm border
                    border-white/20 text-white/70 font-semibold rounded-xl
                    px-6 py-3"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}