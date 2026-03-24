import Navbar from '../components/Navbar'
import UsersSection from '../components/admin/UsersSection'
import DrawSection from '../components/admin/DrawSection'
import CharitiesSection from '../components/admin/CharitiesSection'
import WinnersSection from '../components/admin/WinnersSection'

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage users, draws, charities and winners</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <UsersSection />
                    <DrawSection />
                    <CharitiesSection />
                    <WinnersSection />
                </div>
            </div>
        </div>
    )
}