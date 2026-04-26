import { motion } from 'framer-motion'
import { ExternalLink, Copy, Leaf } from 'lucide-react'

export default function ShareSection({ onToast }) {
  const shareMsg = encodeURIComponent(
    "I reported a waste issue on EcoSense! Join me in keeping our city clean 🌿 #EcoSense #CleanCity"
  )

  const shareSocial = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${shareMsg}`,
      whatsapp: `https://wa.me/?text=${shareMsg}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=https://ecosense.app&quote=${shareMsg}`,
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
    onToast?.(`📤 Opening ${platform}...`, 'info')
  }

  const copyLink = () => {
    navigator.clipboard.writeText('https://ecosense.app/report/RPT-2024-0847')
      .then(() => onToast?.('🔗 Link copied to clipboard!', 'success'))
      .catch(() => onToast?.('🔗 Link: ecosense.app/report', 'info'))
  }

  return (
    <section id="share" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4 justify-center">
          <div className="w-5 h-0.5 bg-eco-400 rounded" />
          Share & Inspire
        </div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-tight leading-[1.1] mb-3">
          Spread the <span className="text-eco-400">Movement</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg mx-auto text-[0.92rem] leading-relaxed">
          Your impact score is your badge of honor. Share it to inspire others to
          join the eco-movement.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass max-w-[700px] mx-auto mt-10 p-10 lg:p-12"
      >
        {/* Score Ring */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-[120px] h-[120px] rounded-full mb-5 glow-green">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(#22c55e 264deg, rgba(255,255,255,0.06) 264deg)',
              }}
            />
            {/* Inner cutout */}
            <div className="absolute inset-2 rounded-full bg-surface-deep" />
            {/* Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="font-display font-bold text-[2.2rem] text-eco-300 leading-none">88</span>
              <span className="text-[0.6rem] text-eco-200/25 uppercase tracking-[1.5px] mt-0.5">Eco Score</span>
            </div>
          </div>

          <p className="font-display font-bold text-lg">
            You're an <span className="text-eco-300">Urban Ranger</span>
          </p>
          <p className="text-xs text-eco-200/25 mt-1.5">
            23 reports · 3 cleanups · 486 XP this month
          </p>
        </div>

        {/* Share Message */}
        <div className="bg-eco-400/[0.04] border border-eco-400/10 rounded-xl p-5 mb-8 text-left">
          <p className="text-sm text-eco-200/50 leading-relaxed italic">
            "I've reported 23 waste dumps in Bengaluru this month using{' '}
            <strong className="text-eco-300">@EcoSense</strong>. 12 have already been
            cleaned up! Join me in keeping our city clean 🌿 #EcoSense
            #CleanBengaluru"
          </p>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: 'Twitter / X', platform: 'twitter', icon: '🐦', color: 'bg-[rgba(29,161,242,0.12)] text-[#1da1f2] border-[rgba(29,161,242,0.25)] hover:bg-[rgba(29,161,242,0.2)] hover:shadow-[0_0_20px_rgba(29,161,242,0.15)]' },
            { label: 'WhatsApp', platform: 'whatsapp', icon: '💬', color: 'bg-[rgba(37,211,102,0.12)] text-[#25d366] border-[rgba(37,211,102,0.25)] hover:bg-[rgba(37,211,102,0.2)] hover:shadow-[0_0_20px_rgba(37,211,102,0.15)]' },
            { label: 'Facebook', platform: 'facebook', icon: '📘', color: 'bg-[rgba(24,119,242,0.12)] text-[#1877f2] border-[rgba(24,119,242,0.25)] hover:bg-[rgba(24,119,242,0.2)] hover:shadow-[0_0_20px_rgba(24,119,242,0.15)]' },
          ].map(({ label, platform, icon, color }) => (
            <button
              key={platform}
              onClick={() => shareSocial(platform)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-1 ${color}`}
            >
              {icon} {label}
            </button>
          ))}
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium glass text-eco-200/50 hover:text-eco-300 hover:border-eco-400 hover:-translate-y-1 transition-all duration-300"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </button>
        </div>
      </motion.div>
    </section>
  )
}
