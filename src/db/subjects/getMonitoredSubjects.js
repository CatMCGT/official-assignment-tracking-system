"use server"

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getMonitoredSubjects() {
  const session = await verifySession()
  if (!session) return null
  
  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response = (await sql`SELECT su.id as subject_id, a.id as assignment_id, sa.student_id as student_id, st.name as student_name, sa.collected as collected FROM subjects su, assignments a, student_assignment sa, students st WHERE monitor_id = ${session.userId} AND a.subject_id = su.id AND sa.assignment_id = a.id AND st.id = sa.student_id;`)

  return response
}