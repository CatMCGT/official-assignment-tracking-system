import { verifySession } from '@/actions/userSession'
import { neon } from '@neondatabase/serverless'

export async function getAllUsers() {
//   const session = await verifySession()
//   if (!session) return null

  const sql = neon(`${process.env.DATABASE_URL}`)
  const users = await sql`SELECT * FROM users;`

  return users
}
