'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import bcrypt from 'bcrypt'
import { getUser } from './getUser'
import { revalidatePath } from 'next/cache'
import {
  updateSubjectStudents,
  updateSubjectTeachers,
} from '../subjects/setSubject'

export async function createUser(additionalData, prevState, formData) {
  try {
    const session = await verifySession()
    if (!session) throw new Error('Session not found.')

    const user = await getUser()
    const userRole = user.role

    if (userRole !== 'admin')
      throw new Error('User not authorised to create user.')

    const userId = formData.get('id')
    const name = formData.get('name')
    const password = formData.get('password')
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const { enrolledSubjectIds, taughtSubjectIds, role } = additionalData

    if (enrolledSubjectIds && enrolledSubjectIds.length > 0) {
      await updateSubjectStudents(
        enrolledSubjectIds.map((item) => {
          return {
            subjectId: item.id,
            studentId: userId,
          }
        })
      )
    } else if (taughtSubjectIds && taughtSubjectIds.length > 0) {
      await updateSubjectTeachers(
        taughtSubjectIds.map((item) => {
          return {
            subjectId: item.id,
            teacherId: userId,
          }
        })
      )
    }

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    await sql`INSERT INTO users (id, name, password, role, reg_date, deactivated_date) VALUES (${userId}, ${name}, ${hashedPassword}, ${role}, ${new Date().toISOString()}, null)`

    revalidatePath('/admin/user')

    return {
      success: true,
      message: 'Success!',
    }
  } catch (err) {
    console.error('Error creating user:', err)

    return {
      success: false,
      message: `Failed to create user. Please check the developer console.`,
    }
  }
}
