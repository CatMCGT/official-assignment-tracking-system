'use server'

import { neon } from '@neondatabase/serverless'
import { getTaughtSubjects } from '../subjects/getTaughtSubjects'

export async function createAssignment(
  subjectId,
  assignment,
  assignedStudentIds
) {
  const taughtSubjects = await getTaughtSubjects()
  console.log(taughtSubjects, subjectId)
  if (taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0)
    return null

  console.log('pass 1')

  const assignedDate = new Date()
  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const { id } =
    await sql`INSERT INTO assignments (title, description, subject_id, assigned_date, due_date) VALUES (${assignment.title}, ${assignment.description}, ${subjectId}, ${assignedDate}, ${assignedDate.dueDate}) RETURNING id;`

  if (id) {
    const results = await Promise.all(
      assignedStudentIds.map(async (sid) => {
        const response =
          await sql`INSERT INTO student_assignment(assignment_id, student_id) VALUES (${id}
          , ${sid});`

        return response.ok
      })
    )
    return results
  }
}
