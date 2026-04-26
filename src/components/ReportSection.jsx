import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, AlertTriangle, Send, Trash2, Factory, FlaskConical, Recycle, Waves, TreePine } from 'lucide-react'

const wasteTypes = [
  { icon: Trash2, label: 'General', emoji: '🗑️' },
  { icon: Factory, label: 'Industrial', emoji: '🏭' },
  { icon: FlaskConical, label: 'Hazardous', emoji: '⚗️' },
  { icon: Recycle, label: 'Recyclable', emoji: '♻️' },
  { icon: Waves, label: 'Water Body', emoji: '🌊' },
  { icon: TreePine, label: 'Forest Area', emoji: '🌳' },
]

const severities = [
  { value: 'low', label: '🟢 Low — Minor littering' },
  { value: 'medium', label: '🟡 Medium — Moderate dump' },
  { value: 'high', label: '🔴 High — Large illegal dump' },
  { value: 'critical', label: '🚨 Critical — Hazardous / Urgent' },
]

export default function ReportSection({ onToast }) {
  const [selectedType, setSelectedType] = useState('General')
  const [severity, setSeverity] = useState('')
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onToast?.('📸 Photo loaded! Add details and submit.', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!severity) {
      onToast?.('⚠️ Please select a severity level', 'warn')
      return
    }
    const id = `RPT-2024-0${Math.floor(Math.random() * 100 + 880)}`
    onToast?.(`🚀 Report submitted! Tracking ID: ${id}`, 'success')
    setDescription('')
    setSeverity('')
    setPreview(null)
  }

  return (
    <section id="report" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4">
          <div className="w-5 h-0.5 bg-eco-400 rounded" />
          Report Issue
        </div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-tight leading-[1.1] mb-3">
          Spot a Dump? <span className="text-eco-400">Report It.</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg text-[0.92rem] leading-relaxed">
          Your reports go directly to municipal authorities and local volunteers.
          Every submission makes a difference.
        </p>
      </motion.div>

      {/* Upload Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-10"
      >
        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-14 text-center group ${
            isDragOver
              ? 'border-eco-400 bg-eco-400/[0.05] scale-[1.01]'
              : 'border-border-bright hover:border-eco-400 hover:bg-eco-400/[0.03]'
          }`}
          id="upload-zone"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <div className="w-[72px] h-[72px] mx-auto mb-6 rounded-full glass flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-eco-600 group-hover:to-eco-400 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300">
            {isDragOver ? (
              <Upload className="w-8 h-8 text-eco-300" />
            ) : (
              <Camera className="w-8 h-8 text-eco-300 group-hover:text-eco-950 transition-colors" />
            )}
          </div>

          <h3 className="font-display font-bold text-lg mb-2 text-eco-100">
            Drop Your Photo Here
          </h3>
          <p className="text-sm text-eco-200/30 leading-relaxed">
            Drag & drop or click to upload.
            <br />
            Supports JPG, PNG, HEIC up to 20MB
          </p>

          {preview && (
            <div className="mt-6 rounded-xl overflow-hidden h-[200px] relative">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1.5 rounded-lg text-[0.7rem] text-eco-300 flex items-center gap-1.5">
                📍 Location auto-detected
              </div>
            </div>
          )}
        </div>

        {/* Report Details */}
        <div className="glass p-7 lg:p-8">
          <h4 className="font-display font-bold text-base mb-5 text-eco-100">
            Report Details
          </h4>

          {/* Waste Type */}
          <p className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-3">
            Waste Type
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {wasteTypes.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => setSelectedType(label)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                  selectedType === label
                    ? 'border-eco-400 text-eco-300 bg-eco-400/[0.08]'
                    : 'border-border-subtle text-eco-200/35 hover:border-border-default hover:text-eco-200/60'
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Severity */}
          <p className="text-[0.68rem] text-eco-200/25 uppercase tracking-[1.5px] font-semibold mb-3">
            Severity Level
          </p>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-surface-glass border border-border-default rounded-xl px-4 py-3 text-eco-100 text-sm outline-none focus:border-eco-400 transition-colors cursor-pointer mb-4 appearance-none"
            id="severity-select"
          >
            <option value="" className="bg-eco-900">Select severity…</option>
            {severities.map(({ value, label }) => (
              <option key={value} value={value} className="bg-eco-900">{label}</option>
            ))}
          </select>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you see — size, smell, any visible hazardous materials…"
            className="w-full bg-surface-glass border border-border-default rounded-xl px-4 py-3 text-eco-100 text-sm outline-none focus:border-eco-400 transition-colors resize-vertical min-h-[100px] placeholder:text-eco-200/15 mb-4"
            id="report-description"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-eco-600 to-eco-400 text-white font-semibold hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 transition-all duration-300"
            id="btn-submit-report"
          >
            <Send className="w-4 h-4" />
            Submit Report
          </button>
        </div>
      </motion.div>
    </section>
  )
}
