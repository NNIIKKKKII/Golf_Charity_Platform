import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function SubscriptionSection() {
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subscribing, setSubscribing] = useState(false)

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
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400">Loading subscription...</p>
        </div>
    )

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-6">Subscription</h2>

            {subscription ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.status === 'active'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                            {subscription.status?.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm capitalize">
                            {subscription.plan} plan
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-xl p-4">
                            <p className="text-gray-400 text-xs mb-1">Renewal Date</p>
                            <p className="text-white font-semibold">
                                {subscription.current_period_end
                                    ? new Date(subscription.current_period_end).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4">
                            <p className="text-gray-400 text-xs mb-1">Charity Contribution</p>
                            <p className="text-white font-semibold">
                                {subscription.charity_percentage}%
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-gray-400">You don't have an active subscription.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleMockSubscribe('monthly')}
                            disabled={subscribing}
                            className="bg-green-500 hover:bg-green-400 disabled:opacity-50
              text-black font-semibold py-3 rounded-xl transition-colors"
                        >
                            Monthly Plan
                        </button>
                        <button
                            onClick={() => handleMockSubscribe('yearly')}
                            disabled={subscribing}
                            className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50
              text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            Yearly Plan
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}