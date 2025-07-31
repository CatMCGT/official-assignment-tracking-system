import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function getUser() {
  const session = await verifySession()
  if (!session) return null
  
  const sql = neon(`${process.env.DATABASE_URL}`)
  const userData = (await sql`SELECT * FROM users WHERE id = ${session.userId};`)[0]

  return userData
}