import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ReportSection from './components/ReportSection'
import MapSection from './components/MapSection'
import VolunteerSection from './components/VolunteerSection'
import ShareSection from './components/ShareSection'
import Footer from './components/Footer'
import { useToast, ToastContainer } from './components/Toast'
import Dashboard from './components/Dashboard'
import NGOLogin from './components/NGOLogin'
import NGODashboard from './components/NGODashboard'
import { useAuth } from './contexts/AuthContext'

export default function App() {
  const { toasts, showToast } = useToast()
  const { user } = useAuth()
  const [currentHash, setCurrentHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      showToast('🌿 Welcome to EcoSense! 3 new issues in your area.', 'success')
    }, 800)
    return () => clearTimeout(timer)
  }, [showToast])

  // Check if this is an NGO user by email pattern
  const isNGOUser = user?.email && /(ngo|@ngo\.in|@ngo\.com)$/i.test(user.email)

  if (user && isNGOUser) {
    return <NGODashboard />
  }

  if (user) {
    return (
      <>
        <Dashboard showToast={showToast} />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  if (currentHash === '#ngo-login') {
    return <NGOLogin />
  }

  return (
    <>
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-eco-500/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-eco-400/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-600/[0.03] rounded-full blur-[180px]" />
        {/* Noise grain */}
        <div
          className="absolute inset-0 opacity-[0.025] animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ReportSection onToast={showToast} />
        <MapSection onToast={showToast} />
        <VolunteerSection onToast={showToast} />
        <ShareSection onToast={showToast} />
        <Footer />
      </div>

      <ToastContainer toasts={toasts} />
    </>
  )
}
