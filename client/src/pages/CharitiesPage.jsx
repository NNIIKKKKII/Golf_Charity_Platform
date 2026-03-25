import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function CharitiesPage() {
    const [charities, setCharities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCharities()
    }, [])

    const fetchCharities = async () => {
        try {
            const res = await api.get('/api/charities')
            setCharities(res.data.charities)
        } catch {
            setCharities([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block bg-green-300/10 text-green-300
          text-sm font-medium px-4 py-2 rounded-full mb-6">
                        Making a difference
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-green-300">Charities</span>
                    </h1>
                    <p className="text-white/60 text-xl max-w-2xl mx-auto">
                        Every subscription contributes to life-changing causes.
                        Choose the charity closest to your heart.
                    </p>
                </motion.div>

                {/* Charities Grid */}
                {loading ? (
                    <div className="text-center text-white/60 py-20">
                        Loading charities...
                    </div>
                ) : charities.length === 0 ? (
                    <div className="text-center text-white/60 py-20">
                        No charities listed yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {charities.map((charity, index) => (
                            <motion.div
                                key={charity.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20
                rounded-2xl p-6 flex flex-col gap-4"
                            >
                                {charity.is_featured && (
                                    <div className="inline-flex items-center gap-1
                  bg-amber-400/20 text-amber-400 text-xs font-semibold
                  px-3 py-1 rounded-full w-fit">
                                        ⭐ Featured Charity
                                    </div>
                                )}

                                <h3 className="text-white text-xl font-bold">
                                    {charity.name}
                                </h3>

                                <p className="text-white/60 text-sm flex-1">
                                    {charity.description ||
                                        'Supporting those in need through dedicated charitable work.'}
                                </p>

                                <div className="pt-4 border-t border-white/10 flex
                items-center justify-between">
                                    <span className="text-green-300 text-sm font-medium">
                                        💚 Active cause
                                    </span>
                                    <Link to="/signup">
                                        <motion.button
                                            className="bg-white/15 backdrop-blur-sm border
                      border-white/30 text-white text-sm font-semibold
                      rounded-xl px-4 py-2"
                                            style={{ boxShadow: '0 0 15px rgba(134,239,172,0.2)' }}
                                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Support This
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20
          rounded-2xl p-10 max-w-2xl mx-auto">
                        <h2 className="text-white text-3xl font-bold mb-4">
                            Ready to make a difference?
                        </h2>
                        <p className="text-white/60 mb-8">
                            Subscribe today and start supporting the charity of your
                            choice while playing the game you love.
                        </p>
                        <Link to="/signup">
                            <motion.button
                                className="bg-white/15 backdrop-blur-sm border
                border-white/30 text-white font-bold rounded-xl
                px-8 py-4 text-lg"
                                style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                                whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.3 }}
                            >
                                Start Playing & Giving
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </Layout>
    )
}