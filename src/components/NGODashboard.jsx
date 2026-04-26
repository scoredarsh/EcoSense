import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function NGODashboard() {
  const iframeRef = useRef(null)
  const { logout, user } = useAuth()

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document
        // Inject logout button into nav-right
        const navRight = doc.querySelector('.nav-right')
        if (navRight) {
          const logoutBtn = doc.createElement('button')
          logoutBtn.textContent = '🚪 Logout'
          logoutBtn.style.cssText = `
            display:inline-flex;align-items:center;gap:6px;
            padding:6px 16px;border-radius:30px;font-size:.78rem;font-weight:600;
            cursor:pointer;border:1px solid rgba(239,68,68,.35);
            background:rgba(239,68,68,.1);color:#ef4444;
            transition:all .2s;font-family:'DM Sans',sans-serif;
          `
          logoutBtn.onmouseover = () => {
            logoutBtn.style.background = 'rgba(239,68,68,.2)'
            logoutBtn.style.borderColor = 'rgba(239,68,68,.5)'
          }
          logoutBtn.onmouseout = () => {
            logoutBtn.style.background = 'rgba(239,68,68,.1)'
            logoutBtn.style.borderColor = 'rgba(239,68,68,.35)'
          }
          logoutBtn.onclick = () => {
            logout()
            window.location.hash = ''
          }
          navRight.appendChild(logoutBtn)
        }

        // Update NGO badge with user email
        const ngoBadge = doc.querySelector('.ngo-badge')
        if (ngoBadge && user?.email) {
          const nameFromEmail = user.email.split('@')[0]
          ngoBadge.innerHTML = `<span class="org-dot"></span>${nameFromEmail}`
        }
      } catch (e) {
        console.error('Could not modify iframe:', e)
      }
    }

    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [logout, user])

  return (
    <iframe
      ref={iframeRef}
      src="/ngo-dashboard.html"
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
      title="NGO Command Centre"
    />
  )
}
