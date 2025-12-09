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
    await sql.transaction(
      users.map(async (user) => {
        if (
          user.id === '' ||
          user.name === '' ||
          user.password === '' ||
          user.role === ''
        ) {
          return ''
        }

        const hashedPassword = await bcrypt.hash(user.password, saltRounds)

        return sql`INSERT INTO users (id, name, password, role, reg_date, deactivated_date) VALUES (${
          user.id
        }, ${user.name}, ${hashedPassword}, ${
          user.role
        }, ${new Date().toISOString()}, null)`
      })
    )

    revalidatePath('/admin/user')

    return {
      success: true,
      message: `Successfully created users ${users
        .filter(
          (user) =>
            user.id !== '' &&
            user.name !== '' &&
            user.password !== '' &&
            user.role !== ''
        )
        .map((u) => u.id)
        .join(', ')}.`,
    }
  } catch (err) {
    console.error('Error creating users:', err)

    return {
      success: false,
      message: `Failed to create users. Please check the developer console and upload again.`,
    }
  }
}
