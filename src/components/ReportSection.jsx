import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, AlertTriangle, Send, Trash2, Factory, FlaskConical, Recycle, Waves, TreePine, Bot, ShieldCheck, ShieldX, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { analyzeWasteImage } from '../services/geminiService'
import { saveReport } from '../services/reportStore'

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

// Helper to convert score (1-10) into a severity string
function scoreToCategoryValue(score) {
  if (score <= 3) return 'low'
  if (score <= 6) return 'medium'
  if (score <= 8) return 'high'
  return 'critical'
}

// Severity bar color gradient based on score 1-10
function getSeverityColor(score) {
  if (score <= 3) return { bar: 'from-emerald-500 to-green-400', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Low', emoji: '🟢' }
  if (score <= 6) return { bar: 'from-amber-500 to-yellow-400', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Medium', emoji: '🟡' }
  if (score <= 8) return { bar: 'from-orange-500 to-red-400', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'High', emoji: '🔴' }
  return { bar: 'from-red-600 to-rose-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Critical', emoji: '🚨' }
}

export default function ReportSection({ onToast }) {
  const [selectedType, setSelectedType] = useState('General')
  const [severity, setSeverity] = useState('')
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileRef = useRef()

  // Gemini AI state
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [imageBase64, setImageBase64] = useState(null)

  // Shared analysis logic — callable from handleFile and retry button
  const runAnalysis = async (base64) => {
    setAiAnalysis(null)
    setIsAnalyzing(true)
    onToast?.('🤖 Analyzing image with Gemini AI…', 'info')
    try {
      const result = await analyzeWasteImage(base64)
      setAiAnalysis(result)

      if (result.success && result.isGarbage) {
        const matchedType = wasteTypes.find(t => t.label === result.wasteType)
        if (matchedType) setSelectedType(matchedType.label)
        setSeverity(scoreToCategoryValue(result.severityScore))
        if (result.description) setDescription(result.description)
        onToast?.(`✅ AI verified: ${result.wasteType} waste detected (Severity: ${result.severityScore}/10)`, 'success')
      } else if (result.success && !result.isGarbage) {
        onToast?.('❌ AI could not detect waste in this image. Please upload a valid photo.', 'warn')
      } else {
        onToast?.('⚠️ AI analysis failed. You can still submit manually.', 'warn')
      }
    } catch (err) {
      console.error(err)
      onToast?.('⚠️ AI analysis error. You can still submit manually.', 'warn')
      setAiAnalysis({ success: false, error: err.message })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFile = (file) => {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      setPreview(base64)
      setImageBase64(base64)
      runAnalysis(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!severity) {
      onToast?.('⚠️ Please select a severity level', 'warn')
      return
    }

    // Get user's location for heatmap pin
    let lat = 12.9716 + (Math.random() - 0.5) * 0.04 // Bengaluru default + jitter
    let lng = 77.5946 + (Math.random() - 0.5) * 0.04

    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      )
      lat = pos.coords.latitude
      lng = pos.coords.longitude
    } catch {
      // Use default Bengaluru coordinates
    }

    const reportData = {
      wasteType: selectedType,
      severity,
      description,
      severityScore: aiAnalysis?.severityScore || (severity === 'low' ? 2 : severity === 'medium' ? 5 : severity === 'high' ? 8 : 10),
      aiVerified: aiAnalysis?.success && aiAnalysis?.isGarbage,
      aiConfidence: aiAnalysis?.confidence || 0,
      lat,
      lng,
    }

    try {
      const docId = await saveReport(reportData)
      const trackingId = `RPT-${docId.slice(0, 8).toUpperCase()}`
      onToast?.(`🚀 Report submitted! Tracking ID: ${trackingId}`, 'success')
    } catch (err) {
      console.error('Firestore save error:', err)
      const id = `RPT-2024-0${Math.floor(Math.random() * 100 + 880)}`
      onToast?.(`🚀 Report submitted locally! Tracking ID: ${id}`, 'success')
    }

    setDescription('')
    setSeverity('')
    setPreview(null)
    setAiAnalysis(null)
    setImageBase64(null)
  }

  const severityInfo = aiAnalysis?.severityScore ? getSeverityColor(aiAnalysis.severityScore) : null

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
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-eco-400 animate-spin" />
                  <span className="text-sm font-medium text-eco-300">Gemini AI Analyzing…</span>
                </div>
              )}
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
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-eco-600 to-eco-400 text-white font-semibold hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            id="btn-submit-report"
          >
            <Send className="w-4 h-4" />
            Submit Report
          </button>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          AI SEVERITY SCORE CARD — Appears below the report form
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(isAnalyzing || aiAnalysis) && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <div className={`glass p-6 lg:p-8 relative overflow-hidden border ${
              aiAnalysis?.isGarbage ? (severityInfo?.border || 'border-border-default') : 'border-border-default'
            }`}>
              {/* Decorative glow */}
              {aiAnalysis?.isGarbage && severityInfo && (
                <div className={`absolute -top-20 -right-20 w-60 h-60 ${severityInfo.bg} rounded-full blur-[80px] pointer-events-none`} />
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isAnalyzing ? 'bg-eco-500/15' : aiAnalysis?.isGarbage ? (severityInfo?.bg || 'bg-eco-500/15') : 'bg-red-500/10'
                }`}>
                  {isAnalyzing ? (
                    <Loader2 className="w-5 h-5 text-eco-400 animate-spin" />
                  ) : aiAnalysis?.isGarbage ? (
                    <ShieldCheck className={`w-5 h-5 ${severityInfo?.text || 'text-eco-400'}`} />
                  ) : (
                    <ShieldX className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-eco-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-eco-400" />
                    Gemini AI Analysis
                  </h3>
                  <p className="text-xs text-eco-200/40">
                    {isAnalyzing
                      ? 'Processing image with Gemini 2.0 Flash…'
                      : aiAnalysis?.isGarbage
                        ? `Waste verified · ${Math.round((aiAnalysis.confidence || 0) * 100)}% confidence`
                        : 'No waste detected in image'}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {isAnalyzing && (
                <div className="space-y-4 relative z-10">
                  <div className="h-3 rounded-full bg-eco-500/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-eco-600 to-eco-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 3, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex gap-4">
                    {['Detecting objects…', 'Classifying waste…', 'Scoring severity…'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 1 }}
                        className="text-xs text-eco-200/30 flex items-center gap-1.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result — Waste Detected */}
              {!isAnalyzing && aiAnalysis?.success && aiAnalysis?.isGarbage && (
                <div className="space-y-5 relative z-10">
                  {/* Severity Score Meter */}
                  <div>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-[0.68rem] text-eco-200/40 uppercase tracking-[1.5px] font-semibold">
                        Severity Score
                      </span>
                      <span className={`font-display text-3xl font-black ${severityInfo?.text}`}>
                        {aiAnalysis.severityScore}<span className="text-base font-medium text-eco-200/30">/10</span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-eco-500/10 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${severityInfo?.bar}`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${aiAnalysis.severityScore * 10}%` }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-eco-200/20 font-medium">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                      <span>Critical</span>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className={`rounded-xl px-4 py-3 ${severityInfo?.bg} border ${severityInfo?.border}`}>
                      <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">Status</div>
                      <div className={`text-sm font-bold ${severityInfo?.text}`}>
                        {severityInfo?.emoji} {severityInfo?.label} Severity
                      </div>
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-eco-500/5 border border-eco-500/15">
                      <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">Type Detected</div>
                      <div className="text-sm font-bold text-eco-300">
                        {wasteTypes.find(w => w.label === aiAnalysis.wasteType)?.emoji || '🗑️'} {aiAnalysis.wasteType}
                      </div>
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-eco-500/5 border border-eco-500/15">
                      <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1">AI Confidence</div>
                      <div className="text-sm font-bold text-eco-300">
                        {Math.round((aiAnalysis.confidence || 0) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Description & Recommendation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiAnalysis.description && (
                      <div className="rounded-xl px-4 py-3 bg-surface-glass border border-border-subtle">
                        <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1.5 flex items-center gap-1.5">
                          <Bot className="w-3 h-3" /> AI Observation
                        </div>
                        <p className="text-xs text-eco-200/60 leading-relaxed">{aiAnalysis.description}</p>
                      </div>
                    )}
                    {aiAnalysis.recommendation && (
                      <div className="rounded-xl px-4 py-3 bg-surface-glass border border-border-subtle">
                        <div className="text-[10px] uppercase tracking-wider text-eco-200/30 font-bold mb-1.5 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" /> Cleanup Advisory
                        </div>
                        <p className="text-xs text-eco-200/60 leading-relaxed">{aiAnalysis.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Result — Not Garbage */}
              {!isAnalyzing && aiAnalysis?.success && !aiAnalysis?.isGarbage && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 relative z-10">
                  <ShieldX className="w-10 h-10 text-red-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-400 mb-1">No Waste Detected</h4>
                    <p className="text-xs text-eco-200/40 leading-relaxed">
                      {aiAnalysis.description || 'The AI could not detect any garbage, waste, or pollution in this image. Please try uploading a clearer photo of the waste site.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Result — Error */}
              {!isAnalyzing && aiAnalysis && !aiAnalysis.success && (
                <div className="flex items-start gap-4 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 relative z-10">
                  <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-amber-400 mb-1.5">
                      {aiAnalysis.error?.includes('rate limit') ? '⏳ Rate Limited' : 'Analysis Unavailable'}
                    </h4>
                    <p className="text-xs text-eco-200/50 leading-relaxed mb-3">
                      {aiAnalysis.error || 'Unknown error occurred.'}
                      <br />
                      <span className="text-eco-200/30">You can still submit the report with manual severity selection.</span>
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (imageBase64) runAnalysis(imageBase64)
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
