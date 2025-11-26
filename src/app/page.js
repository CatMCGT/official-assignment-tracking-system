import { getTaughtSubjects } from '@/db/subjects/getTaughtSubjects'
import { getUser } from '@/db/users/getUser'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getUser()
  if (user.role === 'student') {
    redirect('/assignments')
  } else if (user.role === 'teacher') {
    const taughtSubjects = (await getTaughtSubjects()).filter(s => s.deactivated_date === null)
    const firstId = taughtSubjects[0].id
    redirect(`/teach/${firstId}`)
  } else if (user.role === 'admin') {
    redirect('/admin/user')
  }
}
