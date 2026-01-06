'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { isSubjectAdmin } from '../subjects/isSubjectAdmin'

export async function getOnTimeSubmitPercentages(subjectId) {
  try {
    const session = await verifySession()
    if (!session) return null

    if (subjectId) {
      const isAdminOfSubject = await isSubjectAdmin(subjectId, session.userId)
      if (!isAdminOfSubject)
        throw new Error('User is not authorised to view assignment statistics.')

      // https://www.w3schools.com/mysql/mysql_join_cross.asp

      const sql = neon(`${process.env.STORE_DATABASE_URL}`)
      const response = await sql`
        SELECT
          a.subject_id as subject_id,
          sa.student_id as student_id,
          st.name as student_name,
          round((count(*)::FLOAT / ta.total_assignments) * 100) as on_time_submit_percentage
        FROM
          student_assignment sa
          JOIN students st ON st.id = sa.student_id
          JOIN assignments a ON sa.assignment_id = a.id
          JOIN subjects s ON a.subject_id = s.id
          CROSS JOIN (
            SELECT
              count(*) as total_assignments
            FROM
              assignments
            WHERE
              subject_id = ${subjectId}
          ) ta
        WHERE
          a.subject_id = ${subjectId} AND
          sa.collected_date <= a.due_date AND
          s.deactivated_date is null AND
          st.deactivated_date is null
        GROUP BY
          a.subject_id,
          sa.student_id,
          st.name,
          ta.total_assignments
      `

      return response
    }
  } catch (err) {
    console.error('Error getting assignment statistics:', err)
  }
}
