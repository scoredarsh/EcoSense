import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, MapPin, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const stats = [
  { num: '2,847', label: 'Issues Reported' },
  { num: '1,203', label: 'Resolved' },
  { num: '486', label: 'Volunteers' },
  { num: '38', label: 'Active Today' },
]

export default function Hero() {
  const { loginWithGoogle } = useAuth()
  
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-[500px] h-[500px] bg-eco-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-eco-400/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-eco-600/[0.04] rounded-full blur-[140px]" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(74,222,128,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 glass px-5 py-2.5 rounded-full mb-8 cursor-pointer group hover:border-border-bright transition-colors duration-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-eco-400" />
          </span>
          <span className="text-sm text-eco-200/90 font-medium">
            Welcome back, EcoWarrior
          </span>
          <Sparkles className="w-3.5 h-3.5 text-eco-400 group-hover:text-lime-400 transition-colors" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="font-display font-bold text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] tracking-[-0.03em] mb-6"
        >
          Your Community.
          <br />
          <span className="text-gradient-green">Cleaner Planet.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg text-eco-200/40 max-w-xl mx-auto leading-relaxed font-light mb-10"
        >
          Report waste dumps, track cleanup progress, and coordinate with local
          volunteers — all in one powerful platform built for environmental
          changemakers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={loginWithGoogle}
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-lime-400 to-eco-300 text-eco-950 font-bold text-base shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:shadow-[0_0_50px_rgba(163,230,53,0.5)] hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300"
            id="cta-get-started"
          >
            <Sparkles className="w-4.5 h-4.5" />
            Get Started
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#report"
            className="flex items-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-eco-700 to-eco-500 text-white font-semibold text-base shadow-[0_0_25px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] hover:-translate-y-1 transition-all duration-300"
            id="cta-report"
          >
            📸 Report a Dump
          </a>

          <a
            href="#map"
            className="flex items-center gap-2.5 px-7 py-4 rounded-full glass font-medium text-eco-200/80 hover:text-eco-200 hover:border-border-bright hover:-translate-y-1 transition-all duration-300"
            id="cta-map"
          >
            <MapPin className="w-4 h-4 text-eco-400" />
            View Map
            <ChevronRight className="w-4 h-4 text-eco-400/50" />
          </a>
        </motion.div>

        {/* NGO Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6"
        >
          <a
            href="#ngo-login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-eco-400/20 bg-eco-400/5 text-eco-200/80 hover:text-eco-100 hover:bg-eco-400/10 hover:border-eco-400/30 transition-all duration-300 text-sm font-medium shadow-[0_0_15px_rgba(74,222,128,0.05)] hover:shadow-[0_0_20px_rgba(74,222,128,0.1)]"
          >
            Are you an NGO? <span className="text-lime-400 ml-1">Click here.</span>
          </a>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mt-16 w-fit"
      >
        <div className="flex flex-col sm:flex-row gap-0 bg-[rgba(10,22,16,0.85)] border border-border-subtle rounded-[60px] p-1.5 backdrop-blur-xl">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center px-7 py-3 rounded-full hover:bg-eco-400/[0.05] transition-colors duration-200 cursor-default group">
                <span className="font-display font-bold text-xl text-eco-300 group-hover:text-eco-200 transition-colors">
                  {s.num}
                </span>
                <span className="text-[0.68rem] text-eco-200/30 uppercase tracking-wider mt-0.5">
                  {s.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden sm:block w-px h-8 bg-border-subtle" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-eco-400/20 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-eco-400/60"
          />
        </div>
      </motion.div>
    </section>
  )
}
