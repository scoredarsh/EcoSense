import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'

const REPORTS_COLLECTION = 'waste_reports'
const COOLDOWN_DAYS = 4

/**
 * Save a new waste report to Firestore.
 * @param {Object} report - The report data
 * @returns {Promise<string>} The document ID
 */
export async function saveReport(report) {
  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    ...report,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Check whether the user is allowed to submit a new report (4-day cooldown).
 * @param {string} uid - Firebase user UID
 * @returns {Promise<{allowed: boolean, nextAllowedDate: Date|null, lastReportDate: Date|null}>}
 */
export async function canUserReport(uid) {
  if (!uid) return { allowed: true, nextAllowedDate: null, lastReportDate: null }

  try {
    // Simple query — no composite index needed
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where('reporterUid', '==', uid)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return { allowed: true, nextAllowedDate: null, lastReportDate: null }
    }

    // Find the most recent report client-side
    let latestDate = null
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      const d = data.createdAt?.toDate?.() || null
      if (d && (!latestDate || d > latestDate)) latestDate = d
    })

    if (!latestDate) {
      return { allowed: true, nextAllowedDate: null, lastReportDate: null }
    }

    const nextAllowed = new Date(latestDate.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000)
    const now = new Date()

    return {
      allowed: now >= nextAllowed,
      nextAllowedDate: nextAllowed,
      lastReportDate: latestDate,
    }
  } catch (error) {
    console.error('Error checking report cooldown:', error)
    // If index is missing or query fails, allow the report
    return { allowed: true, nextAllowedDate: null, lastReportDate: null }
  }
}

/**
 * Update the status of a report (e.g. pending → opted-in → resolved).
 * @param {string} reportId - Firestore document ID
 * @param {string} status - New status value
 */
export async function updateReportStatus(reportId, status) {
  const ref = doc(db, REPORTS_COLLECTION, reportId)
  await updateDoc(ref, { status })
}

/**
 * Subscribe to real-time report updates from Firestore.
 * @param {Function} callback - Called with array of reports on each update
 * @returns {Function} Unsubscribe function
 */
export function subscribeToReports(callback) {
  const q = query(
    collection(db, REPORTS_COLLECTION),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(reports)
  })
}

// ═══════════════════════════════════
// VOLUNTEER FUNCTIONS
// ═══════════════════════════════════
const VOLUNTEERS_COLLECTION = 'volunteers'

/**
 * Save or update a volunteer registration.
 * Uses the user's UID as the document ID for easy lookup.
 */
export async function saveVolunteer(uid, data) {
  const ref = doc(db, VOLUNTEERS_COLLECTION, uid)
  await setDoc(ref, {
    ...data,
    registeredAt: serverTimestamp(),
  })
}

/**
 * Get a volunteer record by UID.
 * @returns {Promise<Object|null>}
 */
export async function getVolunteer(uid) {
  if (!uid) return null
  const ref = doc(db, VOLUNTEERS_COLLECTION, uid)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Delete a volunteer registration.
 */
export async function deleteVolunteer(uid) {
  const ref = doc(db, VOLUNTEERS_COLLECTION, uid)
  await deleteDoc(ref)
}
