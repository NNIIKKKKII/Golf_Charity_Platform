import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'

export default function HomePage() {
    return (
        <Layout>
            <Navbar />

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
                <div className="text-center">
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold mb-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="text-white"
                        >
                            Play Golf.
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="text-amber-400"
                        >
                            Win Prizes.
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="text-green-300"
                        >
                            Change Lives.
                        </motion.div>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white/60 text-xl max-w-2xl mx-auto mb-10"
                    >
                        Subscribe, enter your scores, participate in monthly draws,
                        and support a charity you believe in — all in one place.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-4 flex-wrap"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/signup"
                                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-8 py-4 inline-block text-lg"
                                style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                            >
                                Start Playing
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/login"
                                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-8 py-4 inline-block text-lg"
                            >
                                Log In
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bouncing Arrow */}
                <motion.div
                    className="absolute bottom-10"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </section>

            {/* Stats Bar */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {[
                        { icon: '🏌️', number: '2,400+', label: 'Players' },
                        { icon: '🏆', number: '£48,000', label: 'Prizes Paid' },
                        { icon: '💚', number: '12', label: 'Charities Supported' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center"
                        >
                            <div className="text-5xl mb-3">{stat.icon}</div>
                            <div className="text-white font-bold text-3xl mb-1">{stat.number}</div>
                            <div className="text-white/60">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* How it Works */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-white text-center mb-16">
                    How it works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            step: '01',
                            title: 'Subscribe',
                            description: 'Choose a monthly or yearly plan and get full access to the platform.'
                        },
                        {
                            step: '02',
                            title: 'Enter Your Scores',
                            description: 'Log your last 5 Stableford scores. Each one is your entry into the monthly draw.'
                        },
                        {
                            step: '03',
                            title: 'Win & Give',
                            description: 'Match numbers in the monthly draw to win prizes. A portion always goes to your chosen charity.'
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
                        >
                            <div className="text-amber-400 text-5xl font-bold mb-4">{item.step}</div>
                            <h3 className="text-white text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-white/60">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Prize Pool Breakdown */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-white text-center mb-16">
                    Prize Pool Breakdown
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { match: '5 Numbers', share: '40%', note: 'Jackpot rolls over', color: 'amber' },
                        { match: '4 Numbers', share: '35%', note: 'Split among winners', color: 'white' },
                        { match: '3 Numbers', share: '25%', note: 'Split among winners', color: 'green' }
                    ].map((tier, index) => (
                        <motion.div
                            key={tier.match}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center"
                        >
                            <div className={`text-6xl font-bold mb-3 ${
                                tier.color === 'amber' ? 'text-amber-400' :
                                tier.color === 'white' ? 'text-white' : 'text-green-300'
                            }`}>
                                {tier.share}
                            </div>
                            <div className="text-white font-semibold text-xl mb-2">{tier.match}</div>
                            <div className="text-white/60 text-sm">{tier.note}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Charity Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 border-l-4 border-l-green-300"
                >
                    <h2 className="text-4xl font-bold text-green-300 mb-6">
                        Making a difference
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-3xl">
                        Every subscription and every win contributes to real change.
                        Choose from our partner charities and watch your passion for golf
                        create lasting impact in communities around the world.
                    </p>
                    <motion.button
                        className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl px-8 py-4"
                        style={{ boxShadow: '0 0 20px rgba(134,239,172,0.3)' }}
                        whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                    >
                        See Our Charities
                    </motion.button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 mt-20 py-8 text-center text-white/40 text-sm">
                © 2026 GolfCharity. All rights reserved.
            </footer>
        </Layout>
    )
}