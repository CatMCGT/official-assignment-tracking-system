'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function verifySession() {
  const sessionUserId = (await cookies()).get('session')?.value

  if (!sessionUserId) {
    redirect('/signin')
  }

  return { isAuth: true, userId: sessionUserId }
}

export async function createSession(userId) {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 7)

  const cookieStore = await cookies()

  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: true,
    expires: expirationDate,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
