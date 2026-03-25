import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import SubscriptionSection from '../components/dashboard/SubscriptionSection'
import ScoreSection from '../components/dashboard/ScoreSection'
import CharitySection from '../components/dashboard/CharitySection'
import WinningsSection from '../components/dashboard/WinningsSection'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
    const { user } = useAuthStore()

    return (
        <Layout>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back 👋
                    </h1>
                    <p className="text-white/60 mt-1">{user?.email}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* Left column */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                        >
                            <SubscriptionSection />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <CharitySection />
                        </motion.div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ScoreSection />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <WinningsSection />
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}