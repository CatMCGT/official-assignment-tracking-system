'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getMonitoredSubjects } from '../subjects/getMonitoredSubjects'
import { revalidatePath } from 'next/cache'
import { getTaughtSubjects } from '../subjects/getTaughtSubjects'

export async function setCollectedAssignments(
  subjectId,
  assignmentId,
  students
) {
  const session = await verifySession()
  if (!session) return null

  const monitoredSubjects = await getMonitoredSubjects()
  const taughtSubjects = await getTaughtSubjects()
  if (monitoredSubjects.filter((s) => s.subject_id === subjectId).length === 0 && taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0 )
    return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const results = await Promise.all(
    students.map(async (student) => {
      const response =
        await sql`UPDATE student_assignment SET collected_date = ${student.collected_date}, status = ${student.status}, grade = ${student.grade}, feedback = ${student.feedback} WHERE assignment_id = ${assignmentId} AND student_id = ${student.id};`
    })
  )

  revalidatePath(`/monitor/${subjectId}/${assignmentId}`)

  return results
}
