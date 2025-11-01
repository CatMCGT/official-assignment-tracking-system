'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getUser } from '../users/getUser'
import { revalidatePath } from 'next/cache'

export async function setSubjects(updatedSubjects) {
  try {
    const session = await verifySession()
    if (!session) throw new Error('Session not found.')

    const user = await getUser()
    const userRole = user.role

    if (userRole !== 'admin')
      throw new Error('User not authorised to update user.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const results = await Promise.all(
      updatedSubjects.map(async (subject) => {
        const response =
          await sql`UPDATE subjects SET teacher_id = ${subject.teacher_id}, monitor_id = ${subject.monitor_id}, deactivated_date = ${subject.deactivated_date} where id = ${subject.id}`
      })
    )

    revalidatePath('/admin/subject')

    return {
      success: true,
    }
  } catch (err) {
    console.error('Error updating subject:', err)

    return {
      success: false,
      message: `Failed to update subject. Please check the developer console.`,
    }
  }
}
