'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function setStatus(assignment_id, status) {
  const session = await verifySession()
  if (!session) return null

  // if (!['todo, complete'].includes(status)) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response =
    await sql`UPDATE student_assignment SET status = ${status} WHERE assignment_id = ${assignment_id} AND student_id = ${session.userId};`

  return {
    success: response.ok
  }
}
