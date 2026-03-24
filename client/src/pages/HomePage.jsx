import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-6 py-24 text-center">
                <div className="inline-block bg-green-500/10 text-green-400 text-sm 
        font-medium px-4 py-2 rounded-full mb-6">
                    Play Golf. Win Prizes. Change Lives.
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Golf with a
                    <span className="text-green-400"> purpose</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
                    Subscribe, enter your scores, participate in monthly draws,
                    and support a charity you believe in — all in one place.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="bg-green-500 hover:bg-green-400 text-black font-bold 
            px-8 py-4 rounded-xl text-lg transition-colors"
                    >
                        Start Playing
                    </Link>
                    <Link
                        to="/login"
                        className="bg-gray-800 hover:bg-gray-700 text-white font-semibold 
            px-8 py-4 rounded-xl text-lg transition-colors"
                    >
                        Log In
                    </Link>
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-white text-center mb-16">
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
                    ].map((item) => (
                        <div key={item.step} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                            <div className="text-green-400 text-4xl font-bold mb-4">{item.step}</div>
                            <h3 className="text-white text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Prize pool breakdown */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-white text-center mb-16">
                    Prize Pool Breakdown
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { match: '5 Numbers', share: '40%', color: 'green', note: 'Jackpot — rolls over if unclaimed' },
                        { match: '4 Numbers', share: '35%', color: 'blue', note: 'Split equally among winners' },
                        { match: '3 Numbers', share: '25%', color: 'purple', note: 'Split equally among winners' }
                    ].map((tier) => (
                        <div key={tier.match} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
                            <div className={`text-5xl font-bold mb-2 ${tier.color === 'green' ? 'text-green-400' :
                                    tier.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                                }`}>
                                {tier.share}
                            </div>
                            <div className="text-white font-semibold text-lg mb-2">{tier.match}</div>
                            <div className="text-gray-400 text-sm">{tier.note}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 mt-20 py-8 text-center text-gray-500 text-sm">
                © 2026 GolfCharity. All rights reserved.
            </footer>
        </div>
    )
}