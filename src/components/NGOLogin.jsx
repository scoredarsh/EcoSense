import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, AlertCircle, ArrowLeft, Building2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function NGOLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { loginWithEmail, signupWithEmail } = useAuth()

  const validateEmail = (email) => {
    // Ends with "ngo" or "@ngo.in" or "@ngo.com"
    const ngoRegex = /(ngo|@ngo\.in|@ngo\.com)$/i
    return ngoRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateEmail(email)) {
      setError('Access denied. Must use a valid NGO email ending in "ngo", "@ngo.in", or "@ngo.com".')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await loginWithEmail(email, password)
      } else {
        await signupWithEmail(email, password)
      }
      // If successful, App.jsx handles the redirect because `user` will be set
      window.location.hash = ''
    } catch (err) {
      console.error('Firebase Auth Error:', err.code, err.message)
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered. Please log in.')
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.')
      } else {
        setError(`Authentication failed: ${err.code || err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-eco-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-lime-400/[0.04] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <a
          href="#"
          onClick={() => window.location.hash = ''}
          className="inline-flex items-center gap-2 text-sm font-medium text-eco-200/60 hover:text-eco-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        <div className="glass-strong rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-eco-400/20">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-eco-500 to-eco-300 rounded-[50%_12px_50%_12px] flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-4">
              <Building2 className="w-7 h-7 text-eco-950" />
            </div>
            <h1 className="font-display font-bold text-2xl text-eco-100 mb-2">
              NGO Portal
            </h1>
            <p className="text-sm text-eco-200/60">
              {isLogin ? 'Sign in to your NGO account' : 'Register your NGO to start helping'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium text-eco-200/60 uppercase tracking-wider mb-2 ml-1">
                NGO Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-eco-200/40 group-focus-within:text-eco-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-eco-950/50 border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-eco-100 placeholder-eco-200/30 focus:outline-none focus:border-eco-400/50 focus:ring-1 focus:ring-eco-400/50 transition-all duration-300"
                  placeholder="contact@example.ngo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-eco-200/60 uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-eco-200/40 group-focus-within:text-eco-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-eco-950/50 border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-eco-100 placeholder-eco-200/30 focus:outline-none focus:border-eco-400/50 focus:ring-1 focus:ring-eco-400/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-lime-400 to-eco-300 text-eco-950 font-bold text-base shadow-[0_0_20px_rgba(163,230,53,0.2)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-eco-950/30 border-t-eco-950 rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Register NGO'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-sm font-medium text-eco-200/60 hover:text-eco-200 transition-colors"
            >
              {isLogin ? "Don't have an NGO account? " : "Already registered? "}
              <span className="text-lime-400 underline underline-offset-4">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
