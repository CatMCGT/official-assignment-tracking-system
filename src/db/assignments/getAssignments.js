"use server"

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import getSubjectInfo from '@/utils/getSubjectInfo'

export async function getAssignments() {
  const session = await verifySession()
  if (!session) return null

  const sql = neon(`${process.env.DATABASE_URL}`)
  const assignments =
    await sql`SELECT id, title, description, subject_id, assigned_date, due_date FROM assignments a, student_assignment s where a.id = s.assignment_id and s.student_id = ${session?.userId}`

  const formattedAssignments = assignments.map((a) => {
    const subjectInfo = getSubjectInfo(a.subject_id)

    return {
      ...a,
      subjectInfo: subjectInfo
    }
  })

  return formattedAssignments;
}
