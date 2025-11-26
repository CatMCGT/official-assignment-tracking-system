'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { isSubjectAdmin } from '../subjects/isSubjectAdmin'

export async function getMonitoredAssignments(subjectId) {
  try {
    const session = await verifySession()
    if (!session) return null

    const isAdminOfSubject = await isSubjectAdmin(subjectId, session.userId)
    if (!isAdminOfSubject)
      throw new Error('User is not authorised to get monitored assignments.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const assignments = await sql`
      SELECT
        s.id AS subject_id,
        a.id AS assignment_id,
        a.title AS assignment_title,
        a.description AS assignment_description,
        a.assigned_date,
        a.due_date,
        a.grade AS assignment_grade,
        t.id AS teacher_id,
        t.name AS teacher_name,
        m.id AS monitor_id,
        m.name AS monitor_name,
        count(*) as number_of_students,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', st.id,
              'name', st.name,
              'status', sa.status,
              'grade', sa.grade,
              'feedback', sa.feedback,
              'collected_date', sa.collected_date
            )
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'::json
        ) AS students
      FROM assignments a
      LEFT JOIN subjects s ON s.id = a.subject_id
      LEFT JOIN teachers t ON t.id = s.teacher_id
      LEFT JOIN students m ON m.id = s.monitor_id
      LEFT JOIN student_assignment sa ON sa.assignment_id = a.id
      LEFT JOIN student_subject ss ON ss.subject_id = s.id
      LEFT JOIN students st ON st.id = sa.student_id
      WHERE s.id = ${subjectId}
      GROUP BY
        s.id, a.id, a.title, a.description,
        a.assigned_date, a.due_date, a.grade,
        t.id, t.name, m.id, m.name
      ORDER BY a.due_date DESC
    `

    return assignments
  } catch (err) {
    console.error('Error getting monitored assignments:', err)
  }
}
