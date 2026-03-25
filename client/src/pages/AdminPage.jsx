import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import UsersSection from '../components/admin/UsersSection'
import DrawSection from '../components/admin/DrawSection'
import CharitiesSection from '../components/admin/CharitiesSection'
import WinnersSection from '../components/admin/WinnersSection'

export default function AdminPage() {
    return (
        <Layout>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-white/60 mt-1">Manage users, draws, charities and winners</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                    >
                        <UsersSection />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <DrawSection />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <CharitiesSection />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <WinnersSection />
                    </motion.div>
                </div>
            </div>
        </Layout>
    )
}