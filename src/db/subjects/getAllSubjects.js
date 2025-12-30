'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getUser } from '../users/getUser'
import getSubjectInfo from '@/utils/getSubjectInfo'

export async function getAllSubjects() {
  try {
    const session = await verifySession()
    if (!session) throw new Error('Session not found.')

    const user = await getUser()
    const userRole = user.role

    if (userRole !== 'admin')
      throw new Error('User not authorised to get all subjects.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    // const response = await sql`SELECT s.id as id, t.id as teacher_id, t.name as teacher_name, st.id as monitor_id, st.name as monitor_name FROM subjects s, teachers t, students st WHERE s.teacher_id = t.id AND s.monitor_id = st.id;`;

    // https://neon.com/docs/functions/json_agg -> prevent N+1 query problem
    // https://neon.com/postgresql/postgresql-tutorial/postgresql-coalesce -> return [] instead of null

    const response = await sql`
      SELECT
        s.id AS id,
        t.id AS teacher_id,
        t.name AS teacher_name,
        m.id AS monitor_id,
        m.name AS monitor_name,
        s.deactivated_date,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', st.id, 'name', st.name)
          ) FILTER (WHERE st.id IS NOT NULL),
          '[]'
        ) AS students
      FROM
        subjects s
        LEFT JOIN teachers t ON s.teacher_id = t.id
        LEFT JOIN students m ON s.monitor_Id = m.id
        LEFT JOIN student_subject ss ON ss.subject_id = s.id
        LEFT JOIN students st ON ss.student_id = st.id
      GROUP BY
        s.id, t.id, t.name, m.id, m.name, s.deactivated_date
    `

    const subjects = await Promise.all(
      response.map(async (subject) => {
        const subjectInfo = getSubjectInfo(subject.id)

        return {
          ...subject,
          ...subjectInfo,
        }
      })
    )

    return subjects
  } catch (err) {
    console.error('Error fetching subjects:', err)
  }
}
