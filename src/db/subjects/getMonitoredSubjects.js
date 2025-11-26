'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getMonitoredSubjects() {
  const session = await verifySession()
  if (!session) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response = await sql`
    SELECT
      s.id as id,
      s.teacher_id as teacher_id,
      t.name as teacher_name,
      s.monitor_id as monitor_id,
      m.name as monitor_name,
      count(*) as number_of_students,
      s.deactivated_date
    FROM subjects s
    JOIN teachers t ON s.teacher_id = t.id
    LEFT JOIN students m ON s.monitor_id = m.id
    LEFT JOIN student_subject ss ON ss.subject_id = s.id
    WHERE monitor_id = ${session.userId}
    GROUP BY s.id, s.teacher_id, t.name, s.monitor_id, m.name, s.deactivated_date
    `

  return response
}

// const response = (await sql`SELECT su.id as subjectId, a.id as assignmentId, sa.studentId as studentId, st.name as studentName, sa.collected as collected FROM subjects su, assignments a, student_assignment sa, students st WHERE monitor_id = ${session.userId} AND a.subject_id = su.id AND sa.assignment_id = a.id AND st.id = sa.student_id;`)
