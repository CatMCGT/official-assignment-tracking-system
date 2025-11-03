'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { getUser } from './getUser'
import { revalidatePath } from 'next/cache'

export async function setUsers(updatedUsers) {
  try {
    const session = await verifySession()
    if (!session) throw new Error('Session not found.')

    const user = await getUser()
    const userRole = user.role

    if (userRole !== 'admin')
      throw new Error('User not authorised to create user.')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const results = await Promise.all(
      updatedUsers.map(async (user) => {
        const response =
          await sql`UPDATE users SET name=${user.name}, role=${user.role}, deactivated_date=${user.deactivated_date} WHERE id=${user.id}`
      })
    )

    revalidatePath('/admin/user')

    return {
      success: true,
    }
  } catch (err) {
    console.error('Error updating user:', err)

    return {
      success: false,
      message: `Failed to update user. Please check the developer console.`,
    }
  }
}
