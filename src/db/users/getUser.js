'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getUser(userId) {
  const session = await verifySession()
  if (!session) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  if (userId) {
    const userData = (await sql`SELECT * FROM users WHERE id = ${userId};`)[0]
    return userData
  } else {
    const userData = (
      await sql`SELECT * FROM users WHERE id = ${session.userId};`
    )[0]
    return userData
  }
}
