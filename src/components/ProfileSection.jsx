import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Pencil, Trophy, Zap, Star, Award, Flame, Camera, Globe, Trash2, Users as UsersIcon } from 'lucide-react'

const badges = [
  { icon: Trash2, label: 'Waste Spotter' },
  { icon: Globe, label: 'Earth First' },
  { icon: UsersIcon, label: 'Team Player' },
  { icon: Camera, label: 'Photo Pro' },
  { icon: Flame, label: '7-Day Streak' },
]

export default function ProfileSection({ onToast }) {
  const [userName, setUserName] = useState('EcoWarrior')
  const [userRating, setUserRating] = useState(4)
  const [platformRating, setPlatformRating] = useState(0)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(userName)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const handleSaveName = () => {
    const trimmed = editName.trim() || 'EcoWarrior'
    setUserName(trimmed)
    setEditing(false)
    onToast?.(`✅ Name updated to "${trimmed}"`, 'success')
  }

  const handlePlatformRate = (val) => {
    setPlatformRating(val)
    onToast?.(`🌟 Platform rated ${val}/5 — Thank you!`, 'success')
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Greeting Card */}
        <motion.div variants={item} className="glass relative overflow-hidden group">
          {/* Corner orb */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-eco-400/10 rounded-full blur-3xl group-hover:bg-eco-400/15 transition-colors duration-700" />

          <div className="relative p-8 lg:p-10">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-eco-600 to-eco-300 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.25)] mb-6">
              <User className="w-7 h-7 text-eco-950" />
            </div>

            {/* Greeting */}
            <h3 className="font-display font-bold text-2xl lg:text-3xl leading-tight mb-2">
              {greeting},
              <br />
              <span className="text-eco-300">{userName}</span>!
            </h3>

            {/* Level Badge */}
            <div className="inline-flex items-center gap-2 bg-eco-400/[0.08] border border-eco-400/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-eco-300" />
              <span className="text-xs font-semibold text-eco-300 tracking-wide">Level 12 — Urban Ranger</span>
            </div>

            {/* XP Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-eco-200/30">Experience Points</span>
                <span className="text-eco-300 font-medium">1,340 / 2,000 XP</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full w-[67%] bg-gradient-to-r from-eco-600 to-eco-300 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            <p className="text-sm text-eco-200/30 mt-5 leading-relaxed">
              You've reported <strong className="text-eco-300">23 issues</strong> this month.
              You're in the <strong className="text-eco-300">top 8%</strong> of contributors!
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => { setEditName(userName); setEditing(true) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-eco-700 to-eco-500 text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all duration-300"
                id="btn-edit-profile"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                onClick={() => onToast?.('🏆 Leaderboard coming soon!', 'info')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-medium text-eco-200/70 hover:text-eco-200 hover:border-border-bright transition-all duration-300"
                id="btn-leaderboard"
              >
                <Trophy className="w-3.5 h-3.5 text-eco-400" />
                Leaderboard
              </button>
            </div>
          </div>
        </motion.div>

        {/* Rating Card */}
        <motion.div variants={item} className="glass p-8 lg:p-10">
          <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4">
            <div className="w-5 h-0.5 bg-eco-400 rounded" />
            Community Trust
          </div>

          <h3 className="font-display font-bold text-xl mb-5">Your Impact Rating</h3>

          {/* Stars */}
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(val => (
              <button
                key={val}
                onClick={() => {
                  setUserRating(val)
                  onToast?.(`⭐ Thanks for the ${val}-star rating!`, 'success')
                }}
                className={`text-2xl transition-all duration-200 hover:scale-125 ${
                  val <= userRating ? 'grayscale-0' : 'grayscale opacity-40'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
          <p className="text-xs text-eco-200/30 mb-6">4.2 / 5 · Rated by 187 community members</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.03] border border-border-subtle rounded-full text-xs text-eco-200/60 hover:border-border-default hover:text-eco-200/80 transition-all cursor-default"
              >
                <Icon className="w-3 h-3 text-eco-400/60" />
                {label}
              </div>
            ))}
          </div>

          {/* Platform Rating */}
          <div className="border-t border-border-subtle pt-6">
            <p className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] mb-3 font-semibold">
              Rate This Platform
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => handlePlatformRate(val)}
                    className="text-xl hover:scale-125 transition-transform cursor-pointer"
                  >
                    {val <= platformRating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <span className="text-xs text-eco-200/25">
                {platformRating > 0 ? `${platformRating}/5` : 'Tap to rate'}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Name Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-eco-900 border border-border-bright rounded-2xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <h3 className="font-display font-bold text-xl mb-2">Edit Profile</h3>
            <p className="text-sm text-eco-200/30 mb-6">
              Update your display name shown in greetings and the community.
            </p>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="w-full bg-surface-glass border border-border-default rounded-xl px-4 py-3.5 text-eco-100 font-medium outline-none focus:border-eco-400 transition-colors placeholder:text-eco-200/20"
              placeholder="Your eco name…"
              autoFocus
              id="name-input"
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveName}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-eco-600 to-eco-400 text-white font-semibold hover:shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all"
              >
                Save Name
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-3 rounded-xl glass text-eco-200/60 font-medium hover:text-eco-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
