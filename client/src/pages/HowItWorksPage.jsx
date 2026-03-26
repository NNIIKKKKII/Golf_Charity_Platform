import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'

export default function HowItWorksPage() {
    return (
        <Layout>
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 space-y-16">
                {/* HERO SECTION */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        How It Works
                    </h1>
                    <p className="text-white/60 text-xl">
                        Everything you need to know about GolfCharity
                    </p>
                </motion.div>

                {/* SECTION 1 - THE DRAW SYSTEM */}
                <motion.div
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h2 className="text-3xl font-bold text-amber-400 mb-6">
                        Monthly Draw
                    </h2>
                    <p className="text-white/80 text-lg mb-8 leading-relaxed">
                        Each month a draw is run. 5 winning numbers are generated.
                        Your last 5 golf scores are your entries.
                        Match 3, 4, or 5 numbers to win prizes.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* 3 Numbers Match */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                            <div className="text-6xl font-bold text-green-300 mb-2">3</div>
                            <p className="text-white/80 font-medium">Numbers</p>
                            <div className="mt-4 text-green-300 font-semibold">
                                25% of prize pool
                            </div>
                        </div>

                        {/* 4 Numbers Match */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                            <div className="text-6xl font-bold text-white mb-2">4</div>
                            <p className="text-white/80 font-medium">Numbers</p>
                            <div className="mt-4 text-white font-semibold">
                                35% of prize pool
                            </div>
                        </div>

                        {/* 5 Numbers Match */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                            <div className="text-6xl font-bold text-amber-400 mb-2">5</div>
                            <p className="text-white/80 font-medium">Numbers</p>
                            <div className="mt-4 text-amber-400 font-semibold">
                                40% of prize pool
                                <div className="text-sm mt-1">Jackpot rolls over</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 2 - YOUR SCORES */}
                <motion.div
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-green-300 mb-6">
                        Stableford Scoring
                    </h2>
                    <p className="text-white/80 text-lg mb-8 leading-relaxed">
                        Enter your last 5 golf scores (range 1-45 in Stableford format).
                        Each score must have a date.
                        Only your 5 most recent scores are kept.
                        Adding a new score automatically removes the oldest.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        {[28, 33, 41, 19, 35].map((score, index) => (
                            <div
                                key={index}
                                className="bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 rounded-lg px-8 py-4"
                            >
                                <div className="text-3xl font-bold text-amber-400">{score}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* SECTION 3 - SUBSCRIPTION PLANS */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* Monthly Plan */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">Monthly</h3>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            Full platform access, monthly draw entry, charity contribution
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/signup"
                                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3 inline-block"
                                style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </div>

                    {/* Yearly Plan */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-2xl font-bold text-white">Yearly</h3>
                            <span className="bg-green-300/20 text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
                                Best Value
                            </span>
                        </div>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            Same great access at a discounted annual rate
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/signup"
                                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3 inline-block"
                                style={{ boxShadow: '0 0 20px rgba(134,239,172,0.3)' }}
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* SECTION 4 - CHARITY CONTRIBUTION */}
                <motion.div
                    className="bg-white/10 backdrop-blur-md border-l-4 border-green-300 border-r border-t border-b border-white/20 rounded-2xl p-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-green-300 mb-6">
                        Give While You Play
                    </h2>
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                        A minimum of 10% of your subscription goes directly to your chosen charity.
                        You can increase this percentage at any time.
                        You can also make independent donations not tied to gameplay.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link
                            to="/charities"
                            className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3 inline-block"
                            style={{ boxShadow: '0 0 20px rgba(134,239,172,0.3)' }}
                        >
                            Explore Charities
                        </Link>
                    </motion.div>
                </motion.div>

                {/* BOTTOM CTA */}
                <motion.div
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to play?
                    </h2>
                    <p className="text-white/60 text-lg mb-6">
                        Join thousands of golfers making a difference
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link
                            to="/signup"
                            className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-6 py-3 inline-block"
                            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                        >
                            Create Account
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </Layout>
    )
}
