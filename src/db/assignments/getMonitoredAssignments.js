'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getMonitoredSubjects } from '../subjects/getMonitoredSubjects'
import { getTaughtSubjects } from '../subjects/getTaughtSubjects'

export async function getMonitoredAssignments(subjectId) {
  const session = await verifySession()
  if (!session) return null

  const taughtSubjects = await getTaughtSubjects()
  const monitoredSubjects = await getMonitoredSubjects()
  if (
    monitoredSubjects.filter((s) => s.subject_id === subjectId).length === 0 &&
    taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0
  )
    return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const assignments = await sql`
      SELECT
        subject_id,
        a.id as assignment_id,
        a.title as assignment_title,
        a.description as assignment_description,
        assigned_date,
        due_date,
        a.grade as assignment_grade,
        t.id as teacher_id,
        t.name as teacher_name,
        monitor_id,
        m.name as monitor_name,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', st.id, 'name', st.name, 'status', sa.status, 'grade', sa.grade, 'feedback', sa.feedback, 'collected_date', sa.collected_date)
          ) FILTER (WHERE st.id IS NOT NULL),
           '[]'
        ) AS students
      FROM
        subjects s,
        assignments a,
        teachers t,
        students st,
        students m,
        student_assignment sa
      WHERE
        s.id = ${subjectId} AND
        s.id = a.subject_id AND
        s.teacher_id = t.id AND
        s.monitor_id = m.id AND
        sa.assignment_id = a.id AND
        sa.student_id = st.id
      GROUP BY
        subject_id, st.name, monitor_id, a.id, a.title, a.description, assigned_date, due_date, a.grade, t.id, t.name
      ORDER BY
        due_date DESC,
        name ASC;
    `

  // const results = await Promise.all(
  //   assignments.map(async (a) => {
  //     const students =
  //       await sql`SELECT id, s.name as name, status, grade, feedback, collected_date FROM student_assignment sa, students s WHERE assignment_id = ${a.assignment_id} AND sa.student_id = s.id ORDER BY name ASC;`

  //     return {
  //       ...a,
  //       students: students,
  //     }
  //   })
  // )

  return results
}
