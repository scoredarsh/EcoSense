import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

const REPORTS_COLLECTION = 'waste_reports'

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
