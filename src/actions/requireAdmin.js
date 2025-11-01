import { getUser } from '@/db/users/getUser'
import { verifySession } from './userSession'

export async function requireAdmin() {
  const session = await verifySession()
  if (!session) throw new Error('Session not found.')

  const user = await getUser()
  if (user.role !== 'admin')
    throw new Error('User not authorised to perform this action.')

  return user
}
