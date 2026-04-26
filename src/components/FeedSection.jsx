import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, Share2, HandHelping, MapPin, Eye, Clock } from 'lucide-react'

const feedItems = [
  {
    icon: '🏭', category: 'Industrial Waste', title: 'Chemical drums dumped near Sarjapur',
    desc: 'Blue barrels with unknown chemical markings found near the drainage ditch. Foul smell reported by residents.',
    dist: '4.2 km', time: '3h ago', views: 142, upvotes: 28,
  },
  {
    icon: '🌊', category: 'Water Contamination', title: 'Garbage dumped in Bellandur Lake',
    desc: 'Fresh dump of construction debris and domestic waste spotted on the western bank. Lake water turning dark.',
    dist: '6.1 km', time: '6h ago', views: 89, upvotes: 45,
  },
  {
    icon: '🌳', category: 'Forest Encroachment', title: 'Plastic bags clogging Cubbon Park drain',
    desc: 'Storm drain at the northeast entrance blocked with plastic bags and food waste. Risk of flooding.',
    dist: '2.3 km', time: '1d ago', views: 203, upvotes: 67, initiallyLiked: true,
  },
  {
    icon: '♻️', category: 'Recyclable Waste', title: 'E-waste pile at Silk Board Junction',
    desc: 'TVs, monitors, and cables discarded on the footpath. Highly recyclable — needs specialist collection.',
    dist: '5.7 km', time: '2d ago', views: 118, upvotes: 33,
  },
]

export default function FeedSection({ onToast }) {
  const [likedStates, setLikedStates] = useState(
    feedItems.reduce((acc, item, i) => ({ ...acc, [i]: item.initiallyLiked || false }), {})
  )
  const [upvoteCounts, setUpvoteCounts] = useState(
    feedItems.reduce((acc, item, i) => ({ ...acc, [i]: item.upvotes }), {})
  )

  const toggleLike = (idx) => {
    const wasLiked = likedStates[idx]
    setLikedStates(p => ({ ...p, [idx]: !wasLiked }))
    setUpvoteCounts(p => ({ ...p, [idx]: wasLiked ? p[idx] - 1 : p[idx] + 1 }))
    if (!wasLiked) onToast?.('👍 Upvoted! This helps boost priority.', 'success')
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
    <section id="feed" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4">
          <div className="w-5 h-0.5 bg-eco-400 rounded" />
          Community Feed
        </div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-tight leading-[1.1] mb-3">
          Issues <span className="text-eco-400">Near You</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg text-[0.92rem] leading-relaxed">
          Real-time reports from your neighborhood. Upvote to boost priority.
          Share to spread awareness.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10"
      >
        {feedItems.map((fi, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="glass flex gap-4 p-6 group cursor-pointer hover:translate-x-1 hover:border-border-bright transition-all duration-300"
          >
            {/* Thumb */}
            <div className="w-[72px] h-[72px] rounded-xl shrink-0 flex items-center justify-center text-3xl bg-gradient-to-br from-eco-400/[0.08] to-eco-800/80 border border-border-subtle">
              {fi.icon}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <p className="text-[0.65rem] text-eco-400 font-semibold uppercase tracking-[1.5px] mb-1">
                {fi.category}
              </p>
              <h3 className="font-display font-bold text-sm text-eco-100 mb-1.5 truncate">
                {fi.title}
              </h3>
              <p className="text-xs text-eco-200/25 leading-relaxed mb-3 line-clamp-2">
                {fi.desc}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-[0.68rem] text-eco-200/25 mb-3">
                <span className="text-eco-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {fi.dist}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {fi.time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {fi.views}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(idx) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-medium border transition-all duration-200 ${
                    likedStates[idx]
                      ? 'text-red-400 border-red-500/30 bg-red-500/[0.08]'
                      : 'text-eco-200/30 border-border-subtle hover:text-eco-300 hover:border-eco-400 hover:bg-eco-400/[0.05]'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" /> {upvoteCounts[idx]}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToast?.(`📤 Sharing: "${fi.title}"`, 'info') }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-medium text-eco-200/30 border border-border-subtle hover:text-eco-300 hover:border-eco-400 hover:bg-eco-400/[0.05] transition-all"
                >
                  <Share2 className="w-3 h-3" /> Share
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToast?.('🤝 Volunteering for this issue!', 'success') }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-medium text-eco-200/30 border border-border-subtle hover:text-eco-300 hover:border-eco-400 hover:bg-eco-400/[0.05] transition-all"
                >
                  <HandHelping className="w-3 h-3" /> Help
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
