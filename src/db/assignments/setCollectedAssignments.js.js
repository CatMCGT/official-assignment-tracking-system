'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { revalidatePath } from 'next/cache'
import { isSubjectAdmin } from '../subjects/isSubjectAdmin'

export async function setCollectedAssignments(
  subjectId,
  assignmentId,
  students
) {
  try {
    const session = await verifySession()
    if (!session) return null

    const isAdminOfSubject = await isSubjectAdmin(subjectId, session.userId)
    if (!isAdminOfSubject)
      throw new Error('User is not authorised to set collected assignments.')

    const conn = neon(`${process.env.STORE_DATABASE_URL}`)
    await conn.begin(async (sql) => {
      for (const student of students) {
        await sql`UPDATE student_assignment SET collected_date = ${student.collected_date}, status = ${student.status}, grade = ${student.grade}, feedback = ${student.feedback} WHERE assignment_id = ${assignmentId} AND student_id = ${student.id};`
      }
    })

    revalidatePath(`/monitor/${subjectId}/${assignmentId}`)
  } catch (err) {
    console.error('Error setting collected assignments:', err)
  }
}
