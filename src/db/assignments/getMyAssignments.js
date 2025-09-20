'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import getSubjectInfo from '@/utils/getSubjectInfo'

export async function getMyAssignments() {
  const session = await verifySession()
  if (!session) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const assignments =
    await sql`SELECT assignment_id, title as assignment_title, description as assignment_description, subject_id, assigned_date, due_date, collected_date FROM assignments a, student_assignment s, subjects su WHERE a.id = s.assignment_id AND s.student_id = ${session?.userId} AND a.subject_id = su.id ORDER BY due_date DESC;`

  const formattedAssignments = assignments.map((a) => {
    const subjectInfo = getSubjectInfo(a.subject_id)

    return {
      ...a,
      subjectInfo: subjectInfo,
    }
  })

  return formattedAssignments
}