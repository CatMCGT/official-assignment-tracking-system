'use server'

import { requireAdmin } from '@/actions/requireAdmin'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'

export default async function bulkCreateUsers(users, prevState, formData) {
  try {
    await requireAdmin()
    const saltRounds = 10

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)

    const validUsers = users.filter(
      (user) =>
        user.id !== '' &&
        user.name !== '' &&
        user.password !== '' &&
        user.role !== ''
    )

    if (validUsers.legnth === 0) {
      return {
        sucess: false,
        message:
          'No valid users provided. Please check that all users have their ids, names, passwords, and roles specified in the correct format.',
      }
    }

    const hashedUsers = await Promise.all(
      validUsers.map(async (user) => ({
        ...user,
        hashedPassword: await bcrypt.hash(user.password, saltRounds),
      }))
    )

    const queries = hashedUsers.map(
      (user) =>
        sql`INSERT INTO users (id, name, password, role, reg_date, deactivated_date) VALUES (${
          user.id
        }, ${user.name}, ${user.hashedPassword}, ${
          user.role
        }, ${new Date().toISOString()}, null)`
    )

    await sql.transaction(queries)

    revalidatePath('/admin/user')

    return {
      success: true,
      message: `Successfully created users ${validUsers
        .map((u) => u.id)
        .join(', ')}.`,
    }
  } catch (err) {
    console.error('Error creating users:', err)

    return {
      success: false,
      message: `${err.message}. ${err.detail}` || 'Error creating users.',
    }
  }
}
