'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getTaughtSubjects(subjectId = '') {
  try {
    const session = await verifySession()
    if (!session) return null

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    // const subjects = await sql`SELECT id as subject_id, teacher_id, monitor_id FROM subjects WHERE teacher_id = ${session.userId}`
    if (subjectId === '') {
      const subjects = await sql`
      SELECT
        s.id AS id,
        t.id AS teacher_id,
        t.name AS teacher_name,
        m.id AS monitor_id,
        m.name AS monitor_name,
        deactivated_date,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', st.id, 'name', st.name)
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS students
      FROM
        subjects s
        LEFT JOIN teachers t ON s.teacher_id = t.id
        LEFT JOIN students m ON s.monitor_id = m.id
        LEFT JOIN student_subject ss ON ss.subject_id = s.id
        LEFT JOIN students st ON ss.student_id = st.id
      WHERE
        s.teacher_id = ${session.userId}
      GROUP BY
        s.id, t.id, t.name, m.id, m.name, deactivated_date
    `
      return subjects
    } else {
      const subjects = await sql`
      SELECT
        s.id AS id,
        t.id AS teacher_id,
        t.name AS teacher_name,
        m.id AS monitor_id,
        m.name AS monitor_name,
        deactivated_date,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', st.id, 'name', st.name)
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS students
      FROM
        subjects s
        LEFT JOIN teachers t ON s.teacher_id = t.id
        LEFT JOIN students m ON s.monitor_id = m.id
        LEFT JOIN student_subject ss ON ss.subject_id = s.id
        LEFT JOIN students st ON ss.student_id = st.id
      WHERE
        s.teacher_id = ${session.userId} AND
        s.id = ${subjectId}
      GROUP BY
        s.id, t.id, t.name, m.id, m.name, deactivated_date
    `
      return subjects
    }
  } catch (err) {
    console.error('Error fetching subjects:', err)
  }
}
