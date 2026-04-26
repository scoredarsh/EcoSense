import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { saveVolunteer, getVolunteer, deleteVolunteer } from '../services/reportStore'
import { CheckCircle, UserPlus, Trash2, Loader2, MapPin, Phone, Wrench, Calendar } from 'lucide-react'

const SKILLS = [
  { id: 'cleanup', label: '🧹 Cleanup', color: 'from-eco-600 to-eco-400' },
  { id: 'composting', label: '🌱 Composting', color: 'from-lime-600 to-lime-400' },
  { id: 'hazmat', label: '🧪 Hazmat', color: 'from-red-600 to-red-400' },
  { id: 'awareness', label: '📢 Awareness', color: 'from-amber-600 to-amber-400' },
  { id: 'data', label: '📊 Data', color: 'from-blue-600 to-blue-400' },
  { id: 'ewaste', label: '🔋 E-Waste', color: 'from-purple-600 to-purple-400' },
  { id: 'schools', label: '🏫 Schools', color: 'from-cyan-600 to-cyan-400' },
  { id: 'recycling', label: '♻️ Recycling', color: 'from-emerald-600 to-emerald-400' },
  { id: 'drone', label: '🚁 Drone Mapping', color: 'from-indigo-600 to-indigo-400' },
]

const AREAS = [
  'Koramangala', 'Indiranagar', 'HSR Layout', 'BTM Layout', 'Whitefield',
  'Jayanagar', 'JP Nagar', 'Bannerghatta', 'Electronic City', 'Marathahalli',
  'Bellandur', 'Sarjapur', 'Hebbal', 'Yelahanka', 'Rajajinagar',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function VolunteerSection({ onToast }) {
  const { loginWithGoogle, user } = useAuth()

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [area, setArea] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [availability, setAvailability] = useState([])

  // Status
  const [volunteer, setVolunteer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Check if user is already registered
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return }
    let cancelled = false
    getVolunteer(user.uid).then(v => {
      if (!cancelled) {
        setVolunteer(v)
        setLoading(false)
      }
    }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [user?.uid])

  // Pre-fill name from Google auth
  useEffect(() => {
    if (user?.displayName && !fullName) setFullName(user.displayName)
  }, [user?.displayName])

  const toggleSkill = (id) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleDay = (day) => {
    setAvailability(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleRegister = async () => {
    if (!user) { loginWithGoogle(); return }
    if (!fullName.trim()) { onToast?.('⚠️ Please enter your full name', 'warn'); return }
    if (!phone.trim() || phone.length < 10) { onToast?.('⚠️ Please enter a valid phone number', 'warn'); return }
    if (!area) { onToast?.('⚠️ Please select your area', 'warn'); return }
    if (selectedSkills.length === 0) { onToast?.('⚠️ Please select at least one skill', 'warn'); return }
    if (availability.length === 0) { onToast?.('⚠️ Please select your availability', 'warn'); return }

    setSubmitting(true)
    try {
      const data = {
        name: fullName.trim(),
        email: user.email || '',
        phone: phone.trim(),
        area,
        skills: selectedSkills,
        availability,
        status: 'available',
        xp: 0,
        uid: user.uid,
        photoURL: user.photoURL || '',
      }
      await saveVolunteer(user.uid, data)
      setVolunteer(data)
      onToast?.('🎉 You are now registered as a volunteer!', 'success')
    } catch (err) {
      console.error('Volunteer registration error:', err)
      onToast?.('⚠️ Registration failed. Please try again.', 'warn')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnregister = async () => {
    if (!user?.uid) return
    setSubmitting(true)
    try {
      await deleteVolunteer(user.uid)
      setVolunteer(null)
      setSelectedSkills([])
      setAvailability([])
      setPhone('')
      setArea('')
      onToast?.('👋 You have been unregistered as a volunteer.', 'info')
    } catch (err) {
      console.error('Unregister error:', err)
      onToast?.('⚠️ Could not unregister. Please try again.', 'warn')
    } finally {
      setSubmitting(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <section id="volunteer" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4">
          <div className="w-5 h-0.5 bg-eco-400 rounded" />
          Get Involved
        </div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-tight leading-[1.1] mb-3">
          Volunteer <span className="text-eco-400">Signup</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg text-[0.92rem] leading-relaxed">
          {volunteer
            ? 'You are a registered EcoSense volunteer. Your profile is visible to NGO partners.'
            : 'Register as a volunteer and help local NGOs clean up your community.'}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-eco-400 animate-spin" />
        </div>
      ) : volunteer ? (
        /* ═══ REGISTERED STATE ═══ */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <div className="glass p-8 border border-eco-400/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-eco-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex items-start gap-5 relative z-10 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-7 h-7 text-eco-950" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-eco-100 mb-1">
                  ✅ You're a Registered Volunteer
                </h3>
                <p className="text-sm text-eco-200/50">
                  NGO partners can see your profile and assign you to cleanup missions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-eco-500/5 border border-eco-500/15 rounded-xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">Name</div>
                <div className="text-sm font-bold text-eco-300">{volunteer.name}</div>
              </div>
              <div className="bg-eco-500/5 border border-eco-500/15 rounded-xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">Area</div>
                <div className="text-sm font-bold text-eco-300">📍 {volunteer.area}</div>
              </div>
              <div className="bg-eco-500/5 border border-eco-500/15 rounded-xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">Status</div>
                <div className="text-sm font-bold text-eco-300">🟢 Available</div>
              </div>
              <div className="bg-eco-500/5 border border-eco-500/15 rounded-xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">XP</div>
                <div className="text-sm font-bold text-eco-300">🏅 {volunteer.xp || 0} XP</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-2">Skills</div>
              <div className="flex flex-wrap gap-2">
                {(volunteer.skills || []).map(id => {
                  const skill = SKILLS.find(s => s.id === id)
                  return skill && (
                    <span key={id} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-eco-400/10 border border-eco-400/20 text-eco-300">
                      {skill.label}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-2">Availability</div>
              <div className="flex gap-2">
                {DAYS.map(day => (
                  <span
                    key={day}
                    className={`w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center ${
                      (volunteer.availability || []).includes(day)
                        ? 'bg-eco-400/15 border border-eco-400/30 text-eco-300'
                        : 'bg-surface-glass border border-border-subtle text-eco-200/20'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleUnregister}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Unregister
            </button>
          </div>
        </motion.div>
      ) : (
        /* ═══ REGISTRATION FORM ═══ */
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6"
        >
          {/* Left: Form */}
          <motion.div variants={item} className="glass p-7 lg:p-8">
            <h4 className="font-display font-bold text-lg mb-6 text-eco-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-eco-400" /> Volunteer Registration
            </h4>

            {/* Name */}
            <label className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-2 block">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-surface-glass border border-border-default rounded-xl px-4 py-3 text-eco-100 text-sm outline-none focus:border-eco-400 transition-colors placeholder:text-eco-200/15 mb-5"
            />

            {/* Phone */}
            <label className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-2 block">
              <Phone className="w-3 h-3 inline mr-1" /> Phone Number
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              type="tel"
              className="w-full bg-surface-glass border border-border-default rounded-xl px-4 py-3 text-eco-100 text-sm outline-none focus:border-eco-400 transition-colors placeholder:text-eco-200/15 mb-5"
            />

            {/* Area */}
            <label className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-2 block">
              <MapPin className="w-3 h-3 inline mr-1" /> Your Area
            </label>
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full bg-surface-glass border border-border-default rounded-xl px-4 py-3 text-eco-100 text-sm outline-none focus:border-eco-400 transition-colors cursor-pointer mb-5 appearance-none"
            >
              <option value="" className="bg-eco-900">Select your area…</option>
              {AREAS.map(a => (
                <option key={a} value={a} className="bg-eco-900">{a}</option>
              ))}
            </select>

            {/* Skills */}
            <label className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-3 block">
              <Wrench className="w-3 h-3 inline mr-1" /> Skills (select multiple)
            </label>
            <div className="flex flex-wrap gap-2 mb-5">
              {SKILLS.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => user ? toggleSkill(skill.id) : loginWithGoogle()}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                    selectedSkills.includes(skill.id)
                      ? 'border-eco-400 text-eco-300 bg-eco-400/[0.08] shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                      : 'border-border-subtle text-eco-200/35 hover:border-border-default hover:text-eco-200/60'
                  }`}
                >
                  {skill.label}
                </button>
              ))}
            </div>

            {/* Availability */}
            <label className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-3 block">
              <Calendar className="w-3 h-3 inline mr-1" /> Availability
            </label>
            <div className="flex gap-2 mb-6">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => user ? toggleDay(day) : loginWithGoogle()}
                  className={`w-12 h-12 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    availability.includes(day)
                      ? 'border-eco-400 text-eco-300 bg-eco-400/[0.1] shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                      : 'border-border-subtle text-eco-200/30 hover:border-border-default hover:text-eco-200/60'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-eco-600 to-eco-400 text-white font-semibold hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Register as Volunteer
                </>
              )}
            </button>
          </motion.div>

          {/* Right: Info */}
          <motion.div variants={item} className="space-y-5">
            <div className="glass p-6">
              <h4 className="font-display font-bold text-base mb-4 text-eco-100">Why Volunteer?</h4>
              <div className="space-y-3">
                {[
                  { emoji: '🌍', title: 'Direct Impact', desc: 'Help clean up waste hotspots in your neighborhood' },
                  { emoji: '🏅', title: 'Earn XP & Rewards', desc: 'Gain XP for each mission, climb the leaderboard' },
                  { emoji: '🤝', title: 'NGO Partnership', desc: 'Work directly with verified NGOs in Bengaluru' },
                  { emoji: '📊', title: 'Track Progress', desc: 'See your contribution through before/after evidence' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-eco-500/5 border border-eco-500/10">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-eco-200">{item.title}</div>
                      <div className="text-xs text-eco-200/40">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6">
              <h4 className="font-display font-bold text-base mb-3 text-eco-100">How It Works</h4>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Fill in your details and skills' },
                  { step: '2', text: 'NGO partners see your profile' },
                  { step: '3', text: 'Get assigned to cleanup missions' },
                  { step: '4', text: 'Complete missions and earn XP' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-eco-400/15 border border-eco-400/25 flex items-center justify-center text-xs font-bold text-eco-300">
                      {s.step}
                    </div>
                    <span className="text-sm text-eco-200/60">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
