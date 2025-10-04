'use server'

import MainLayout from '@/app/(main)/layout'
import { getAllSubjects } from '@/db/subjects/getAllSubjects'
import { getUser } from '@/db/users/getUser'
import EditUser from './EditUser'
import { getSubjectStudents } from '@/db/subjects/getSubjectStudents'

export default async function Page({ params }) {
  const { userId } = await params
  const allSubjects = await getAllSubjects()
  allSubjects.map(async (subject) => {
    const subjectStudents = await getSubjectStudents(subject.id)
    
    return {
      ...subject,
      students: subjectStudents
    }
  })
  const user = await getUser(userId)

  return (
    <div>
      <MainLayout.Header>User {userId}</MainLayout.Header>

      <EditUser allSubjects={allSubjects} user={user} />
    </div>
  )
}
