import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-7 h-7 bg-gradient-to-br from-eco-500 to-eco-300 rounded-[50%_6px_50%_6px] flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-eco-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-eco-300 tracking-tight">
            EcoSense
          </span>
        </div>

        <p className="text-sm text-eco-200/25">
          Community Waste Intelligence Platform · Bengaluru, India
        </p>
        <p className="text-xs text-eco-200/15 mt-3">
          Built with ♻️ for a cleaner planet ·{' '}
          <span className="text-eco-400/50">2024 EcoSense</span>
        </p>

        {/* Subtle separator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-eco-400/15" />
          ))}
        </div>
      </div>
    </footer>
  )
}
