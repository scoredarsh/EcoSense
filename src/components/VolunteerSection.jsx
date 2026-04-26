import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const opportunities = [
  {
    icon: '🧹', title: 'Weekend Cleanup Drive',
    desc: 'Join organized cleanup events every Saturday morning. Gear and transport provided. Perfect for first-timers.',
    spots: '12 spots remaining', time: 'This Saturday, 7AM', status: 'green',
  },
  {
    icon: '🔍', title: 'Report Verification',
    desc: 'Help verify community reports and assess severity from home. Requires 2+ hours/week commitment.',
    spots: '5 spots remaining', time: 'Remote, flexible', status: 'green',
  },
  {
    icon: '🎓', title: 'School Outreach',
    desc: 'Educate students about waste management and encourage them to be environmental reporters.',
    spots: '2 spots remaining', time: 'Weekdays, mornings', status: 'amber',
  },
  {
    icon: '🏛️', title: 'Municipal Liaison',
    desc: 'Bridge between community reports and BBMP. Help escalate critical issues to the right authorities.',
    spots: 'Full', time: 'Join waitlist', status: 'red',
  },
  {
    icon: '🚁', title: 'Drone Mapping',
    desc: 'Use drones to map waste hotspots in hard-to-reach areas. Own equipment or use community drones.',
    spots: '8 spots remaining', time: 'On demand', status: 'green',
  },
  {
    icon: '📊', title: 'Data Analytics',
    desc: 'Analyze waste patterns and create reports for city planners. Requires basic data skills.',
    spots: '10 spots remaining', time: 'Remote', status: 'green',
  },
]

const statusDot = { green: '🟢', amber: '🟡', red: '🔴' }

export default function VolunteerSection({ onToast }) {
  const { loginWithGoogle, user } = useAuth()
  const [toggled, setToggled] = useState({})

  const toggle = (title) => {
    const next = !toggled[title]
    setToggled(p => ({ ...p, [title]: next }))
    onToast?.(next ? `🙋 You signed up for: ${title}` : `👋 Removed from: ${title}`, next ? 'success' : 'info')
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
          Volunteer <span className="text-eco-400">Opportunities</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg text-[0.92rem] leading-relaxed">
          Join local cleanup drives, mentor new reporters, or help coordinate
          municipal outreach. Toggle your availability.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10"
      >
        {opportunities.map((opp) => (
          <motion.div
            key={opp.title}
            variants={item}
            onClick={() => user ? toggle(opp.title) : loginWithGoogle()}
            className="glass relative p-7 group cursor-pointer hover:-translate-y-1.5 hover:border-eco-400/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300"
          >
            {/* Toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); user ? toggle(opp.title) : loginWithGoogle() }}
              className={`absolute top-5 right-5 w-10 h-[22px] rounded-full border transition-all duration-300 ${
                toggled[opp.title]
                  ? 'bg-eco-400 border-eco-400 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                  : 'bg-white/[0.08] border-border-subtle'
              }`}
            >
              <div className={`w-4 h-4 rounded-full absolute top-[2px] transition-all duration-300 ${
                toggled[opp.title]
                  ? 'left-[calc(100%-18px)] bg-white'
                  : 'left-[2px] bg-eco-200/30'
              }`} />
            </button>

            {/* Icon */}
            <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-eco-400/10 to-eco-400/[0.03] border border-border-bright flex items-center justify-center text-2xl mb-5">
              {opp.icon}
            </div>

            <h3 className="font-display font-bold text-base mb-2 text-eco-100">
              {opp.title}
            </h3>
            <p className="text-sm text-eco-200/30 leading-relaxed mb-5">
              {opp.desc}
            </p>
            <div className="flex items-center gap-2 text-xs text-eco-300 font-medium">
              {statusDot[opp.status]} <span>{opp.spots} · {opp.time}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
