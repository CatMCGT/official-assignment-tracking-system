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
      // https://www.geeksforgeeks.org/postgresql/understanding-lateral-joins-in-postgresql/

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
          JOIN (
            SELECT
              count(*) as total_assignments
            FROM
              assignments
            WHERE
              subject_id = ${subjectId}
          ) ta
        WHERE
          a.subject_id = ${subjectId} AND
          sa.collected_date <= a.due_date
        GROUP BY
          a.subject_id,
          sa.student_id,
          st.name,
          ta.total_assignments
      `

      return response
    } else {
      // The following pgsql statement was written with AI assistance (Grok)
      // Prompt: "update this sql statement to include students who have not submitted on-time for any assignments, i.e. on_time_count is 0. If the student has not submitted on-time, the status is "late" or "not submitted": `original code`"

      // https://www.postgresql.org/docs/current/queries-with.html

      const sql = neon(`${process.env.STORE_DATABASE_URL}`)
      const response = await sql`
        WITH subject_stats AS (
          SELECT 
            a.subject_id,
            COUNT(*) AS total_assignments
          FROM assignments a
          JOIN subjects s ON a.subject_id = s.id
          WHERE s.teacher_id = ${session.userId}
          GROUP BY a.subject_id
        ),

        students_in_subject AS (
          SELECT DISTINCT
            a.subject_id,
            sa.student_id
          FROM assignments a
          JOIN student_assignment sa ON sa.assignment_id = a.id
          JOIN subjects s ON a.subject_id = s.id
          WHERE s.teacher_id = ${session.userId}
        ),

        on_time_counts AS (
          SELECT 
            a.subject_id,
            sa.student_id,
            COUNT(*) AS on_time_count
          FROM assignments a
          JOIN student_assignment sa 
            ON sa.assignment_id = a.id
          AND sa.status = 'submitted'
          AND sa.collected_date <= a.due_date
          JOIN subjects s ON a.subject_id = s.id
          WHERE s.teacher_id = ${session.userId}
          GROUP BY a.subject_id, sa.student_id
        )

        SELECT
          ss.subject_id,
          ROUND(
            COALESCE(AVG(otc.on_time_count::FLOAT / ss.total_assignments), 0) * 100
          ) AS average_on_time_submit,

          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', st.id,
                'name', st.name,
                'on_time_submit_percentage',
                  ROUND(COALESCE(otc.on_time_count, 0)::FLOAT / ss.total_assignments * 100)
              )
              ORDER BY st.name
            ),
            '[]'::json
          ) AS students

        FROM subject_stats ss
        JOIN students_in_subject sis ON sis.subject_id = ss.subject_id
        JOIN students st ON st.id = sis.student_id
        LEFT JOIN on_time_counts otc 
          ON otc.subject_id = ss.subject_id 
        AND otc.student_id = st.id

        GROUP BY ss.subject_id, ss.total_assignments;
      `

      return response
    }
  } catch (err) {
    console.error('Error getting assignment statistics:', err)
  }
}
