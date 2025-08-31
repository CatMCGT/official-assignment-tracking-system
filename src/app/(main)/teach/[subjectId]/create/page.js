import { getSubjectAdmin } from '@/db/subjects/getSubjectAdmin'
import { getSubjectStudents } from '@/db/subjects/getSubjectStudents'
import getSubjectInfo from '@/utils/getSubjectInfo'
import CreateAssignment from './CreateAssignment'
import { getUser } from '@/db/users/getUser'

export default async function Page({ params }) {
  const { subjectId } = await params
  const user = await getUser()
  const subjectStudents = await getSubjectStudents(subjectId)
  const subjectStudentIds = subjectStudents?.map((s) => s.id)
  const subjectInfo = getSubjectInfo(subjectId)
  const subjectAdmin = await getSubjectAdmin(subjectId)

  return (
    <CreateAssignment
      user={user}
      subjectStudents={subjectStudents}
      subjectStudentIds={subjectStudentIds}
      subjectInfo={subjectInfo}
      subjectAdmin={subjectAdmin}
    />
  )
}
