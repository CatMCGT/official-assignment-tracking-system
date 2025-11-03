'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { isSubjectAdmin } from './isSubjectAdmin'

export async function setSubjectMonitor(subjectId, monitorId) {
  try {
    const session = await verifySession()
    if (!session) return null

    const isAdminOfSubject = await isSubjectAdmin(subjectId, session.userId)
    if (!isAdminOfSubject) throw new Error('User is not authorised to set subject monitor.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const response =
      await sql`UPDATE subjects SET monitor_id = ${monitorId} WHERE id = ${subjectId};`

    return {
      success: response.ok,
    }
  } catch (err) {
    console.error('Error setting subject monitor:', err)
  }
}
