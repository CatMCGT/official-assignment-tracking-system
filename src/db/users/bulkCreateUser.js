'use server'

import { requireAdmin } from '@/actions/requireAdmin'
import { Pool } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'

export default async function bulkCreateUsers(users, prevState, formData) {
  const pool = new Pool({ connectionString: process.env.STORE_DATABASE_URL })
  const client = await pool.connect()

  try {
    requireAdmin()
    const saltRounds = 10

    await client.query('BEGIN')
    for (const user of users) {
      if (
        user.id === '' ||
        user.name === '' ||
        user.password === '' ||
        user.role === ''
      ) {
        continue
      }

      const hashedPassword = await bcrypt.hash(user.password, saltRounds)

      await client.query(
        'INSERT INTO users (id, name, password, role, reg_date, deactivated_date) VALUES ($1, $2, $3, $4, $5, null)',
        [
          user.id,
          user.name,
          hashedPassword,
          user.role,
          new Date().toISOString(),
        ]
      )
    }

    await client.query('COMMIT')

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

    await client.query('ROLLBACK')

    return {
      success: false,
      message: `Failed to create users. Please check the developer console and upload again.`,
    }
  }
}
