import Navbar from '../components/Navbar'
import SubscriptionSection from '../components/dashboard/SubscriptionSection'
import ScoreSection from '../components/dashboard/ScoreSection'
import CharitySection from '../components/dashboard/CharitySection'
import WinningsSection from '../components/dashboard/WinningsSection'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
    const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back 👋
                    </h1>
                    <p className="text-gray-400 mt-1">{user?.email}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <SubscriptionSection />
                    <ScoreSection />
                    <CharitySection />
                    <WinningsSection />
                </div>
            </div>
        </div>
    )
}