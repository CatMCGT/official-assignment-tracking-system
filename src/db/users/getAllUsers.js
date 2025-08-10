import { neon } from '@neondatabase/serverless'

export async function getAllUsers() {
  //   const session = await verifySession()
  //   if (!session) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const users = await sql`SELECT id, password FROM users;`

  return users
}
