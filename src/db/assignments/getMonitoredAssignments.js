'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getMonitoredSubjects } from '../subjects/getMonitoredSubjects'

export async function getMonitoredAssignments(subjectId) {
  const session = await verifySession()
  if (!session) return null

  const monitoredSubjects = await getMonitoredSubjects()
  if (monitoredSubjects.filter((s) => s.subject_id === subjectId).length === 0) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const assignments =
    await sql`SELECT subject_id, a.id as assignment_id, a.title as assignment_title, a.description as assignment_description, assigned_date, due_date, t.id as teacher_id, t.name as teacher_name FROM subjects s, assignments a, teachers t WHERE s.id = a.subject_id AND s.teacher_id = t.id;`

  assignments.map(async (a) => {
    const students =
      await sql`SELECT student_id, collected FROM student_assignment WHERE assignment_id = ${a.assignment_id};`

    return {
      ...a,
      students: students,
    }
  })

  return assignments
}
