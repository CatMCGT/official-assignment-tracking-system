'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getTaughtSubjects } from './getTaughtSubjects'

export async function getSubjectStudents(subjectId) {
  const session = await verifySession()
  if (!session) return null

  const taughtSubjects = await getTaughtSubjects()
  if (taughtSubjects.filter((s) => s.subject_id === subjectId).length === 0)
    return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const students =
    await sql`SELECT id, name FROM student_subject su, students st WHERE su.student_id = st.id AND subject_id = ${subjectId};`

  return students
}
