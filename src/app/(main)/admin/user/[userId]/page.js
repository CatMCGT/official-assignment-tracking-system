'use server'

import MainLayout from '@/app/(main)/layout'
import { getAllSubjects } from '@/db/subjects/getAllSubjects'
import { getUser } from '@/db/users/getUser'
import EditUser from './EditUser'

export default async function Page({ params }) {
  const { userId } = await params
  const allSubjects = await getAllSubjects()
  const user = await getUser(userId)

  return (
    <div>
      <MainLayout.Header>User {userId}</MainLayout.Header>

      <EditUser allSubjects={allSubjects} user={user} />
    </div>
  )
}
