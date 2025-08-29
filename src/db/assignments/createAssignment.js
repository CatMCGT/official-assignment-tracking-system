'use server'

import { neon } from '@neondatabase/serverless'
import { getTaughtSubjects } from '../subjects/getTaughtSubjects'

export async function createAssignment(
  subjectId,
  assignment,
  assignedStudentIds
) {
  const taughtSubjects = await getTaughtSubjects()
  if (taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0)
    return null

  const assignedDate = new Date()
  console.log(assignment.description)
  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response =
    await sql`INSERT INTO assignments (title, description, subject_id, assigned_date, due_date) VALUES (${assignment.title}, ${assignment.description}, ${subjectId}, ${assignedDate}, ${assignment.dueDate}) RETURNING id;`

  const aid = response[0].id

  if (aid) {
    const results = await Promise.all(
      assignedStudentIds.map(async (sid) => {
        const response =
          await sql`INSERT INTO student_assignment(assignment_id, student_id) VALUES (${aid}
          , ${sid});`
      })
    )
  }

  return {
    assignmentId: aid
  }
}
