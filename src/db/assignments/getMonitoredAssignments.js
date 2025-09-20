'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getMonitoredSubjects } from '../subjects/getMonitoredSubjects'
import { getTaughtSubjects } from '../subjects/getTaughtSubjects'

export async function getMonitoredAssignments(subjectId) {
  const session = await verifySession()
  if (!session) return null

  const taughtSubjects = await getTaughtSubjects()
  const monitoredSubjects = await getMonitoredSubjects()
  if (
    monitoredSubjects.filter((s) => s.subject_id === subjectId).length === 0 &&
    taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0
  )
    return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const assignments =
    await sql`SELECT subject_id, st.name as monitor_name, monitor_id, a.id as assignment_id, a.title as assignment_title, a.description as assignment_description, assigned_date, due_date, t.id as teacher_id, t.name as teacher_name FROM subjects s, assignments a, teachers t, students st WHERE s.id = ${subjectId} AND s.id = a.subject_id AND s.teacher_id = t.id AND s.monitor_id = st.id ORDER BY due_date DESC;`

  const results = await Promise.all(
    assignments.map(async (a) => {
      const students =
        await sql`SELECT id, s.name as name, collected_date FROM student_assignment sa, students s WHERE assignment_id = ${a.assignment_id} AND sa.student_id = s.id ORDER BY name ASC;`

      return {
        ...a,
        students: students,
      }
    })
  )

  return results
}
