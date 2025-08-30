"use server"

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getTaughtSubjects } from './getTaughtSubjects'

export async function setSubjectMonitor(subjectId, monitorId) {
  const session = await verifySession()
  if (!session) return null

  const taughtSubjects = await getTaughtSubjects()
  if (taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0)
    return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response =
    await sql`UPDATE subjects SET monitor_id = ${monitorId} WHERE id = ${subjectId};`

  return {
    success: response.ok
  }
}