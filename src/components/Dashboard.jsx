import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Map, FileText, Users, BarChart3, Trophy, Calendar, Settings, 
  Menu, X, Bell, RefreshCw, Plus, LogOut, Leaf
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ReportSection from './ReportSection'
import MapSection from './MapSection'
import VolunteerSection from './VolunteerSection'

export default function Dashboard({ showToast }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('heatmap')

  // Sidebar links
  const navItems = [
    { id: 'heatmap', label: 'Community Heatmap', icon: Map, badge: '' },
    { id: 'report', label: 'Report Waste', icon: FileText, badge: '3' },
    { id: 'volunteer', label: 'Volunteer Signup', icon: Users, badge: 'New', badgeColor: 'bg-eco-500' },
  ]
  
  const communityItems = [
    { id: 'stats', label: 'Area Statistics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'events', label: 'Upcoming Drives', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-[#060d0a] flex text-eco-50 relative z-10 font-body">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] fixed top-0 left-0 bottom-0 bg-[#060d0a]/92 backdrop-blur-xl border-r border-border-default z-40 p-4 pt-6 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-8 group cursor-pointer" onClick={() => window.location.href='/'}>
          <div className="w-8 h-8 bg-gradient-to-br from-eco-500 to-eco-300 rounded-[50%_8px_50%_8px] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Leaf className="w-4 h-4 text-eco-950" />
          </div>
          <span className="font-display font-bold text-lg text-eco-200">EcoSense</span>
        </div>

        <div className="text-[10px] font-bold tracking-widest uppercase text-eco-500/60 px-3 mb-3">Overview</div>
        <div className="space-y-1 mb-6">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-eco-500/10 text-eco-300 border border-eco-500/20' : 'text-eco-200/70 hover:bg-eco-500/5 hover:text-eco-200 border border-transparent'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === item.id ? 'bg-eco-500/20' : ''}`}>
                <item.icon className="w-4 h-4" />
              </div>
              {item.label}
              {item.badge && (
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-red-500 text-white'}`}>{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-bold tracking-widest uppercase text-eco-500/60 px-3 mb-3">Community</div>
        <div className="space-y-1 mb-auto">
          {communityItems.map(item => (
            <button key={item.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-eco-200/70 hover:bg-eco-500/5 hover:text-eco-200 border border-transparent transition-all">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <item.icon className="w-4 h-4" />
              </div>
              {item.label}
            </button>
          ))}
        </div>

        <div className="h-px bg-border-subtle my-4" />
        <div className="glass p-3 flex items-center gap-3">
          <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="User" className="w-10 h-10 rounded-full border border-border-bright" />
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">{user?.displayName || 'EcoWarrior'}</div>
            <div className="text-xs text-eco-400">🏅 Level 7 · 2.3k XP</div>
          </div>
          <button onClick={logout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-w-0 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-20 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 bg-[#060d0a]/85 backdrop-blur-xl border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-eco-200 glass flex items-center justify-center rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="hidden sm:block font-display text-xl font-bold text-white">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => showToast && showToast('📡 Data refreshed!', 'success')} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-eco-200/70 hover:text-eco-200 hover:bg-eco-500/10 transition-colors border border-border-default">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button onClick={() => setActiveTab('report')} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-eco-600 to-eco-400 text-white shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:shadow-[0_0_36px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-0.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Report Waste</span>
              <span className="sm:hidden">Report</span>
            </button>
            <button className="p-2 relative text-eco-200 hover:bg-eco-500/10 rounded-full transition-colors ml-1">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-deep"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 space-y-8 max-w-[1400px] mx-auto w-full">
          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Welcome Back, <span className="text-gradient-bright">{user?.displayName?.split(' ')[0] || 'EcoWarrior'}</span></h2>
              <p className="text-eco-200/60 flex items-center gap-2 text-sm font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-eco-500 animate-pulse"></span>
                Live data · Bengaluru, KA
              </p>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-eco-500/10 rounded-full blur-xl group-hover:bg-eco-500/20 transition-colors"></div>
              <div className="text-xs font-bold text-eco-500/60 tracking-wider uppercase mb-2">Total Reports</div>
              <div className="font-display text-3xl font-bold text-eco-300">1,284</div>
              <div className="text-xs text-eco-200/50 mt-1">↑ 47 this week</div>
              <Map className="absolute bottom-4 right-4 w-10 h-10 text-eco-500/10" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform border-amber-500/20 cursor-default">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
              <div className="text-xs font-bold text-amber-500/60 tracking-wider uppercase mb-2">Pending Cleanup</div>
              <div className="font-display text-3xl font-bold text-amber-400">312</div>
              <div className="text-xs text-eco-200/50 mt-1">32 critical zones</div>
              <FileText className="absolute bottom-4 right-4 w-10 h-10 text-amber-500/10" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-eco-500/10 rounded-full blur-xl group-hover:bg-eco-500/20 transition-colors"></div>
              <div className="text-xs font-bold text-eco-500/60 tracking-wider uppercase mb-2">Resolved (30d)</div>
              <div className="font-display text-3xl font-bold text-eco-300">891</div>
              <div className="text-xs text-eco-200/50 mt-1">↑ 12% vs last month</div>
              <Trophy className="absolute bottom-4 right-4 w-10 h-10 text-eco-500/10" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform border-red-500/20 cursor-default">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors"></div>
              <div className="text-xs font-bold text-red-500/60 tracking-wider uppercase mb-2">Critical Hotspots</div>
              <div className="font-display text-3xl font-bold text-red-400">18</div>
              <div className="text-xs text-eco-200/50 mt-1">Requires urgent action</div>
              <Map className="absolute bottom-4 right-4 w-10 h-10 text-red-500/10" />
            </motion.div>
          </div>

          {/* Render Active Section Based on Tabs */}
          <div className="pt-4">
            {activeTab === 'heatmap' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="-mx-4 sm:mx-0">
                <MapSection onToast={showToast} />
              </motion.div>
            )}
            {activeTab === 'report' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="-mx-4 sm:mx-0">
                <ReportSection onToast={showToast} />
              </motion.div>
            )}
            {activeTab === 'volunteer' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="-mx-4 sm:mx-0">
                <VolunteerSection onToast={showToast} />
              </motion.div>
            )}
          </div>

        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-eco-950 border-r border-border-default z-50 p-4 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-2 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-eco-500 to-eco-300 rounded-[50%_8px_50%_8px] flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-eco-950" />
                  </div>
                  <span className="font-display font-bold text-lg text-eco-200">EcoSense</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-eco-200/70 hover:text-eco-200 glass rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Duplicate Sidebar Links for Mobile */}
              <div className="text-[10px] font-bold tracking-widest uppercase text-eco-500/60 px-3 mb-3">Overview</div>
              <div className="space-y-1 mb-6">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-eco-500/10 text-eco-300 border border-eco-500/20' : 'text-eco-200/70 hover:bg-eco-500/5 hover:text-eco-200'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === item.id ? 'bg-eco-500/20' : ''}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.label}
                    {item.badge && (
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-red-500 text-white'}`}>{item.badge}</span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-auto pt-4 border-t border-border-subtle">
                <div className="glass p-3 flex items-center gap-3">
                  <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="User" className="w-10 h-10 rounded-full border border-border-bright" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-semibold text-white truncate">{user?.displayName || 'EcoWarrior'}</div>
                    <div className="text-xs text-eco-400">🏅 Level 7</div>
                  </div>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
