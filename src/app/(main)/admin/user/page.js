import { getAllSubjects } from '@/db/subjects/getAllSubjects'
import { getAllUsers } from '@/db/users/getAllUsers'
import MainLayout from '../../layout'
import CreateUser from './CreateUser'
import AllUsers from './AllUsers'
import { getSubjectStudents } from '@/db/subjects/getSubjectStudents'

export default async function Page() {
  const allSubjects = await getAllSubjects()
  const allUsers = await getAllUsers()
  const subjectsWithStudents = await Promise.all(
    allSubjects.map(async (subject) => {
      const subjectStudents = await getSubjectStudents(subject.id)

      return {
        ...subject,
        students: subjectStudents.map(s => s.id),
      }
    })
  )

  return (
    <div>
      <MainLayout.Header>User Management</MainLayout.Header>

      <div className="flex flex-row gap-10">
        <div>
          <CreateUser allSubjects={allSubjects} />
        </div>

        <AllUsers allUsers={allUsers} allSubjects={subjectsWithStudents} />
      </div>
    </div>
  )
}
