'use server'

import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'

export async function createUser(prevState, formData) {
  const session = await verifySession()
  if (!session) return null

  const user = await getUser()
  const userRole = user.role

  if (userRole !== 'admin') return null

  const id = formData.get('id')
  const name = formData.get('name')
  const encryptedPassword = formData.get('password')
  const role = formData.get('role')

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response = await sql``

  return userData
}
