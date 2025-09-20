import { getUser } from '@/db/users/getUser'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getUser()
  if (user.role === 'student') {
    redirect('/assignments')
  } else if (user.role === 'teacher') {
    redirect('/dashboard')
  } else if (user.role === 'admin') {
    redirect('/admin/user')
  }
}
