import { motion } from 'framer-motion'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

const reports = [
  {
    id: 'RPT-2024-0847',
    title: 'Koramangala Illegal Dump',
    status: 'progress',
    statusLabel: '⚙️ In Progress',
    timeline: [
      { text: 'Report submitted with 3 photos', time: 'Jan 14, 2:30 PM', done: true },
      { text: 'Verified by community moderator', time: 'Jan 14, 6:15 PM', done: true },
      { text: 'Forwarded to BBMP Ward Officer', time: 'Jan 15, 9:00 AM', done: true },
      { text: 'Cleanup team dispatched', time: 'Jan 16 · In progress', current: true },
      { text: 'Cleanup confirmed & site verified', time: 'Pending' },
    ],
  },
  {
    id: 'RPT-2024-0831',
    title: 'BTM Layout Roadside Waste',
    status: 'resolved',
    statusLabel: '✅ Resolved',
    timeline: [
      { text: 'Report submitted', time: 'Jan 9, 11:00 AM', done: true },
      { text: 'Verified by 4 community members', time: 'Jan 9, 3:00 PM', done: true },
      { text: 'Municipal team assigned', time: 'Jan 10, 8:30 AM', done: true },
      { text: 'Cleanup completed — 120kg removed', time: 'Jan 11, 5:00 PM', done: true },
      { text: 'Site verified clean ✅ +150 XP earned!', time: 'Jan 12, 10:00 AM', done: true },
    ],
  },
  {
    id: 'RPT-2024-0862',
    title: 'Indiranagar Lake Plastics',
    status: 'pending',
    statusLabel: '⏳ Pending Review',
    timeline: [
      { text: 'Report submitted with 2 photos', time: 'Jan 16, 8:15 AM', done: true },
      { text: 'Awaiting community verification', time: '1 of 3 verifications received', current: true },
      { text: 'Forward to BBMP Lakes Division', time: 'Pending' },
    ],
  },
  {
    id: 'RPT-2024-0819',
    title: 'MG Road Overpass Litter',
    status: 'progress',
    statusLabel: '⚙️ In Progress',
    timeline: [
      { text: 'Report submitted', time: 'Jan 8, 7:45 PM', done: true },
      { text: 'Verified — classified as medium priority', time: 'Jan 9, 9:00 AM', done: true },
      { text: 'Added to BBMP queue (position #14)', time: 'Jan 9, 2:30 PM', done: true },
      { text: 'Estimated cleanup: Jan 18–20', time: 'Queue position: #3', current: true },
    ],
  },
]

const statusStyles = {
  pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  progress: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  resolved: 'bg-eco-400/15 text-eco-300 border border-eco-400/30',
}

export default function StatusSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="status" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4">
          <div className="w-5 h-0.5 bg-eco-400 rounded" />
          Your Submissions
        </div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-tight leading-[1.1] mb-3">
          Report <span className="text-eco-400">Status</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg text-[0.92rem] leading-relaxed">
          Track the progress of your submitted reports from receipt to resolution.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10"
      >
        {reports.map((report) => (
          <motion.div key={report.id} variants={item} className="glass p-7">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[0.68rem] text-eco-200/25 tracking-[1px] uppercase font-medium">{report.id}</p>
                <h3 className="font-display font-bold text-base text-eco-100 mt-1">{report.title}</h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-semibold ${statusStyles[report.status]}`}>
                {report.statusLabel}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative pl-5">
              <div className="absolute left-[6px] top-1.5 bottom-1.5 w-[2px] bg-border-subtle" />
              {report.timeline.map((step, i) => (
                <div key={i} className="relative mb-3.5 last:mb-0 pl-4">
                  <div className={`absolute left-[-14px] top-[5px] w-2 h-2 rounded-full border-2 border-surface-deep ${
                    step.done
                      ? 'bg-eco-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                      : step.current
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                        : 'bg-eco-200/20'
                  }`} />
                  <p className="text-xs text-eco-200/60">{step.text}</p>
                  <p className="text-[0.68rem] text-eco-200/20 mt-0.5">{step.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
