import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Locate, Pencil, Grid3X3 } from 'lucide-react'
import { GoogleMap, useJsApiLoader, Circle } from '@react-google-maps/api'
import { subscribeToReports } from '../services/reportStore'
import { useAuth } from '../contexts/AuthContext'

const libraries = ['geometry']

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
}

const center = { lat: 12.9716, lng: 77.5946 } // Bengaluru default

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#0a1610' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4b7a5e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#060d0a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0d2218' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#060d0a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060d0a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d2218' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1a3a24' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#0d1f16' }] },
]

// Static demo data — always shown as baseline
const staticHeatmapData = [
  { lat: 12.9780, lng: 77.6068, weight: 10 },
  { lat: 12.9750, lng: 77.6010, weight: 8 },
  { lat: 12.9700, lng: 77.5900, weight: 5 },
  { lat: 12.9650, lng: 77.5850, weight: 9 },
  { lat: 12.9800, lng: 77.5800, weight: 3 },
  { lat: 12.9900, lng: 77.6000, weight: 7 },
  { lat: 12.9600, lng: 77.6100, weight: 6 },
  { lat: 12.9730, lng: 77.5960, weight: 10 },
  { lat: 12.9820, lng: 77.5920, weight: 4 },
  { lat: 12.9670, lng: 77.6020, weight: 8 },
  { lat: 12.9690, lng: 77.5880, weight: 6 },
  { lat: 12.9850, lng: 77.6050, weight: 5 },
]

const nearby = [
  { title: 'Koramangala Market', dist: '0.3 km · 2h ago', color: 'bg-red-500' },
  { title: 'MG Road Overpass', dist: '0.8 km · 5h ago', color: 'bg-amber-500' },
  { title: 'Indiranagar Lake', dist: '1.2 km · 1d ago', color: 'bg-amber-500' },
  { title: 'Banashankari Zone', dist: '2.1 km · 2d ago', color: 'bg-amber-500' },
  { title: 'BTM Layout ✅', dist: '2.5 km · Resolved', color: 'bg-eco-400', isResolved: true },
]

export default function MapSection({ onToast }) {
  const { loginWithGoogle } = useAuth()
  const [markMode, setMarkMode] = useState(false)
  const [map, setMap] = useState(null)
  const [liveReports, setLiveReports] = useState([])
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  // Subscribe to Firestore reports for live heatmap data
  useEffect(() => {
    const unsubscribe = subscribeToReports((reports) => {
      const mapped = reports
        .filter(r => r.lat && r.lng && r.severityScore)
        .map(r => ({
          lat: r.lat,
          lng: r.lng,
          weight: r.severityScore,
          wasteType: r.wasteType,
          aiVerified: r.aiVerified,
          id: r.id,
        }))
      setLiveReports(mapped)
    })
    return () => unsubscribe()
  }, [])

  // Merge static + live reports for map circles
  const allHeatmapData = [...staticHeatmapData, ...liveReports]

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null)
  }, [])

  const handleMapClick = (e) => {
    if (markMode) {
      onToast?.(`📍 Pinned at ${e.latLng.lat().toFixed(4)}, ${e.latLng.lng().toFixed(4)}`, 'success')
      setMarkMode(false)
    }
  }

  const handleZoom = (direction) => {
    if (map) {
      map.setZoom(map.getZoom() + direction)
    }
  }

  // Function to determine circle color based on weight (severity score)
  const getCircleOptions = (weight) => {
    let fillColor = '#22c55e' // green — low (1-3)
    if (weight >= 9) fillColor = '#dc2626'      // deep red — critical
    else if (weight >= 7) fillColor = '#ef4444'  // red — high
    else if (weight >= 4) fillColor = '#f59e0b'  // amber — medium
    
    return {
      strokeColor: fillColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: fillColor,
      fillOpacity: 0.35,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: weight * 60, // Scale radius based on severity
      zIndex: weight,
    }
  }

  // Build dynamic nearby issues from live reports
  const dynamicNearby = liveReports.slice(0, 3).map((r, i) => {
    const severityColor = r.weight >= 8 ? 'bg-red-500' : r.weight >= 5 ? 'bg-amber-500' : 'bg-eco-400'
    const timeAgo = 'Just now'
    return {
      title: `${r.wasteType || 'Waste'} Report ${r.aiVerified ? '🤖' : ''}`,
      dist: `${(Math.random() * 2 + 0.1).toFixed(1)} km · ${timeAgo}`,
      color: severityColor,
    }
  })
  const allNearby = [...dynamicNearby, ...nearby]

  return (
    <section id="map" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold text-eco-400 uppercase tracking-[2px] mb-4">
          <div className="w-5 h-0.5 bg-eco-400 rounded" />
          Community Map
        </div>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-tight leading-[1.1] mb-3">
          Waste Issues <span className="text-eco-400">Near You</span>
        </h2>
        <p className="text-eco-200/30 max-w-lg text-[0.92rem] leading-relaxed">
          Live map of reported issues. AI-verified reports appear in real-time with severity-based heatmap coloring.
          {liveReports.length > 0 && (
            <span className="text-eco-400 font-medium"> · {liveReports.length} AI-verified report{liveReports.length > 1 ? 's' : ''} live</span>
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-10"
      >
        {/* Map Container */}
        <div className="map-wrap relative rounded-2xl overflow-hidden border border-border-default h-[480px] bg-[#0c1e14]">
          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center text-eco-200/50">
              {loadError ? 'Error loading Google Maps' : 'Loading Map...'}
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
              options={{
                styles: mapStyles,
                disableDefaultUI: true,
                clickableIcons: false,
                draggableCursor: markMode ? 'crosshair' : 'grab',
              }}
            >
              {allHeatmapData.map((point, i) => (
                <Circle
                  key={`${point.id || 'static'}-${i}`}
                  center={{ lat: point.lat, lng: point.lng }}
                  options={getCircleOptions(point.weight)}
                />
              ))}
            </GoogleMap>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {[
              { icon: ZoomIn, label: 'Zoom In', action: () => handleZoom(1) },
              { icon: ZoomOut, label: 'Zoom Out', action: () => handleZoom(-1) },
              { icon: Locate, label: 'My Location', action: () => { map?.panTo(center); onToast?.('📍 Centered to Bengaluru', 'success') }, active: true },
              { icon: Pencil, label: 'Mark Area', action: () => { setMarkMode(!markMode); onToast?.('✏️ Draw mode ' + (!markMode ? 'ON (Click map to pin)' : 'OFF'), 'info') } },
              { icon: Grid3X3, label: 'Density View', action: () => onToast?.('🌡️ Density view activated', 'success') },
            ].map(({ icon: Icon, label, action, active }) => (
              <button
                key={label}
                onClick={action}
                title={label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 shadow-lg ${
                  active || (label === 'Mark Area' && markMode)
                    ? 'bg-eco-400 border border-eco-400 text-white'
                    : 'bg-[#0a1610] border border-border-subtle text-eco-200/50 hover:border-eco-400 hover:text-eco-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          
          {/* Fallback overlay if API key is missing */}
          {(!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center z-10 pointer-events-none">
              <div className="bg-black/80 backdrop-blur border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-xs font-medium">
                VITE_GOOGLE_MAPS_API_KEY missing in .env
              </div>
            </div>
          )}

          {/* Live reports badge */}
          {liveReports.length > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black/80 backdrop-blur-lg border border-eco-500/30 text-eco-300 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-eco-500 animate-pulse" />
                {liveReports.length} live AI report{liveReports.length > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Legend */}
          <div className="glass p-5">
            <h4 className="font-display font-bold text-sm mb-4 text-eco-100">Severity Legend</h4>
            <div className="flex flex-col gap-3 text-xs text-eco-200/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-600/35 border-2 border-red-600" />
                <span>Critical (9-10)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/35 border-2 border-red-500" />
                <span>High Severity (7-8)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500/35 border-2 border-amber-500" />
                <span>Medium Severity (4-6)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500/35 border-2 border-green-500" />
                <span>Low Severity (1-3)</span>
              </div>
            </div>
          </div>

          {/* Nearby Issues */}
          <div className="glass p-5 flex-1 overflow-hidden">
            <h4 className="font-display font-bold text-sm mb-4 text-eco-100">Nearby Issues</h4>
            <div className="space-y-0.5 max-h-[280px] overflow-y-auto">
              {allNearby.map(({ title, dist, color, isResolved }, i) => (
                <div
                  key={`${title}-${i}`}
                  className="flex items-start gap-3 py-2.5 border-b border-border-subtle last:border-0 cursor-pointer hover:pl-1.5 transition-all group"
                  onClick={loginWithGoogle}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${color}`} />
                  <div>
                    <div className={`text-xs font-medium ${isResolved ? 'text-eco-300' : 'text-eco-100/80'} group-hover:text-eco-200 transition-colors`}>
                      {title}
                    </div>
                    <div className="text-[0.68rem] text-eco-200/25 mt-0.5">{dist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
