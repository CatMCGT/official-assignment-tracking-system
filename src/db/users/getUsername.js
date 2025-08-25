"use server"

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getUserInfo(userId) {
  const session = await verifySession()
  if (!session) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const username = (
    await sql`SELECT name FROM users WHERE id = ${session.userId};`
  )[0]

  return username
}
