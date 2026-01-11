'use server'

import { neon } from '@neondatabase/serverless'
import { isSubjectAdmin } from '../subjects/isSubjectAdmin'
import { verifySession } from '@/actions/userSession'

export async function createAssignment(
  subjectId,
  assignment,
  assignedStudentIds,
  assignedDate
) {
  try {
    const session = await verifySession()
    if (!session) return null

    const isAdminOfSubject = await isSubjectAdmin(subjectId, session.userId)
    if (!isAdminOfSubject)
      throw new Error('User is not authorised to create assignment.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const response =
      await sql`INSERT INTO assignments (title, description, subject_id, assigned_date, due_date, grade) VALUES (${assignment.title}, ${assignment.description}, ${subjectId}, ${assignedDate}, ${assignment.dueDate}, ${assignment.grade}) RETURNING id;`

    console.log(response)

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
      assignmentId: aid,
    }
  } catch (err) {
    console.error('Error creating assignment:', err)
  }
}
