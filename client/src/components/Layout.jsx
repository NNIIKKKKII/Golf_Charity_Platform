export default function Layout({ children }) {
    return (
        <div className="min-h-screen relative">
            {/* Fixed Background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Dark Overlay */}
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                />
            </div>

            {/* Content */}
            {children}
        </div>
    )
}
