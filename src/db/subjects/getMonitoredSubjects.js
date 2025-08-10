"use server"

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getMonitoredSubjects() {
  const session = await verifySession()
  if (!session) return null
  
  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response = (await sql`SELECT id as subject_id, teacher_id FROM subjects WHERE monitor_id = ${session.userId}`)

  return response
}

// const response = (await sql`SELECT su.id as subjectId, a.id as assignmentId, sa.studentId as studentId, st.name as studentName, sa.collected as collected FROM subjects su, assignments a, student_assignment sa, students st WHERE monitor_id = ${session.userId} AND a.subject_id = su.id AND sa.assignment_id = a.id AND st.id = sa.student_id;`)