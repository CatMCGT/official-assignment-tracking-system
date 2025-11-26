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
    } else {
      // The following pgsql statement was written with AI assistance (Grok)
      // Prompt: "update this sql statement to include students who have not submitted on-time for any assignments, i.e. on_time_count is 0. If the student has not submitted on-time, the status is "late" or "not submitted": `original code`"

      // https://www.postgresql.org/docs/current/queries-with.html

      // const sql = neon(`${process.env.STORE_DATABASE_URL}`)
      // const response = await sql`
      //   WITH subject_stats AS (
      //     SELECT 
      //       a.subject_id,
      //       COUNT(*) AS total_assignments
      //     FROM assignments a
      //     JOIN subjects s ON a.subject_id = s.id
      //     WHERE
      //       s.teacher_id = ${session.userId} AND
      //       a.due_date <= NOW()
      //     GROUP BY a.subject_id
      //   ),

      //   active_students_in_subject AS (
      //     SELECT DISTINCT
      //       a.subject_id,
      //       sa.student_id
      //     FROM assignments a
      //     JOIN student_assignment sa ON sa.assignment_id = a.id
      //     JOIN students st ON sa.student_id = st.id
      //     JOIN subjects s ON a.subject_id = s.id
      //     WHERE
      //       s.teacher_id = ${session.userId} AND
      //       st.deactivated_date is null AND
      //       a.due_date <= NOW()
      //   ),

      //   on_time_counts AS (
      //     SELECT 
      //       a.subject_id,
      //       sa.student_id,
      //       COUNT(*) AS on_time_count
      //     FROM assignments a
      //     JOIN student_assignment sa ON sa.assignment_id = a.id 
      //     JOIN subjects s ON a.subject_id = s.id
      //     WHERE 
      //       s.teacher_id = ${session.userId} AND
      //       sa.collected_date <= a.due_date AND
      //       sa.collected_date is not null AND
      //       a.due_date <= NOW()
      //     GROUP BY a.subject_id, sa.student_id
      //   ),

      //   student_percentages AS (
      //     SELECT
      //       sis.subject_id,
      //       sis.student_id,
      //       st.name,
      //       ss.total_assignments,
      //       COALESCE(otc.on_time_count, 0) AS on_time_count,
      //       ROUND(COALESCE(otc.on_time_count, 0) / ss.total_assignments ) * 100) AS on_time_percentages
      //     FROM subject_stats ss
      //     JOIN active_students_in_subject sis ON sis.subject_id = ss.subject_id
      //     JOIN students st ON st.id = sis.student_id
      //     LEFT JOIN on_time_counts otc
      //       ON otc.subject_id = ss.subject_id
      //       AND otc.student_id = sis.student_id
      //   )

      //   SELECT
      //     sp.subject_id,
      //     ROUND(AVG(sp.on_time_percentage)) AS average_on_time_submit,

      //     COALESCE(
      //       JSON_AGG(
      //         JSON_BUILD_OBJECT(
      //           'id', sp.student_id,
      //           'name', sp.name,
      //           'on_time_submit_percentage', sp.on_time_percentages
      //         ) ORDER BY st.name
      //       ),
      //       '[]'::json
      //     ) AS students

      //   FROM student_percentages sp
      //   GROUP BY sp.subject_id
      //   ORDER BY sp.subject_id
      // `

      // return response
    }
  } catch (err) {
    console.error('Error getting assignment statistics:', err)
  }
}
