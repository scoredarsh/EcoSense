import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Menu, X, FileText, Map, Users, Rss, Share2, Plus, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { label: 'Report', href: '#report', icon: FileText },
  { label: 'Map', href: '#map', icon: Map },
  { label: 'Volunteer', href: '#volunteer', icon: Users },
  { label: 'Issues', href: '#feed', icon: Rss },
  { label: 'Share', href: '#share', icon: Share2 },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loginWithGoogle, logout } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(6,13,10,0.88)] backdrop-blur-2xl border-b border-border-subtle shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 py-3.5">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-eco-500 to-eco-300 rounded-[50%_8px_50%_8px] flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-shadow duration-300">
              <Leaf className="w-4.5 h-4.5 text-eco-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-eco-200 group-hover:text-eco-100 transition-colors">
              EcoSense
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-eco-200/70 hover:text-eco-200 hover:bg-eco-400/[0.06] transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
            <div className="w-px h-6 bg-border-subtle mx-2" />
            {!user ? (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-eco-200/70 hover:text-eco-200 hover:bg-eco-400/[0.06] transition-all duration-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3 pr-2 pl-2">
                <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full border border-border-bright" />
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/[0.08] text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <a
              href="#report"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-eco-600 to-eco-400 text-white shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:shadow-[0_0_36px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              New Report
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-eco-300"
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[64px] z-40 p-4 lg:hidden"
          >
            <div className="glass-strong rounded-2xl p-4 space-y-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {links.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-eco-200/80 hover:text-eco-200 hover:bg-eco-400/[0.08] transition-all"
                >
                  <Icon className="w-4 h-4 text-eco-400" />
                  {label}
                </a>
              ))}
              {!user ? (
                <button
                  onClick={() => { loginWithGoogle(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-eco-200/80 hover:text-eco-200 hover:bg-eco-400/[0.08] transition-all w-full text-left"
                >
                  <LogIn className="w-4 h-4 text-eco-400" />
                  Login
                </button>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-eco-400/[0.04] border border-eco-400/10 mb-2 mt-1">
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium text-eco-100">{user.displayName?.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
              <a
                href="#report"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 mt-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-eco-600 to-eco-400 text-white"
              >
                <Plus className="w-4 h-4" />
                New Report
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
