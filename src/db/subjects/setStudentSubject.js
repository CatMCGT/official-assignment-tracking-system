'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getUser } from '../users/getUser'
import { revalidatePath } from 'next/cache'

export async function setStudentSubject(studentId, subjectChanges) {
  try {
    const session = await verifySession()
    if (!session) throw new Error('Session not found.')

    const user = await getUser()
    const userRole = user.role

    if (userRole !== 'admin')
      throw new Error('User not authorised to set student subjects.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const result = await Promise.all(
      subjectChanges.newlyEnrolled.map(async (subjectId) => {
        const res =
          await sql`INSERT INTO student_subject (student_id, subject_id) VALUES (${studentId}, ${subjectId});`
      }),
      subjectChanges.removedEnrolled.map(async (subjectId) => {
        const res =
          await sql`DELETE FROM student_subject WHERE student_id = ${studentId} AND subject_id = ${subjectId};`
      })
    )

    revalidatePath('/admin/user')

    return {
      success: true,
    }
  } catch (err) {
    console.error('Error creating user:', err)

    return {
      success: false,
      message: `Failed to create user. Please check the developer console.`,
    }
  }
}
