import getSubjectInfo from '@/utils/getSubjectInfo'
import CreateAssignment from './CreateAssignment'
import { getTaughtSubjects } from '@/db/subjects/getTaughtSubjects'

export async function generateMetadata({ params }) {
  const { subjectId } = await params

  return {
    title: `${subjectId} · Create Assignment`,
  }
}

export default async function Page({ params }) {
  const { subjectId } = await params
  const taughtSubject = (await getTaughtSubjects(subjectId))[0]
  const subjectInfo = getSubjectInfo(subjectId)

  return <CreateAssignment subject={taughtSubject} subjectInfo={subjectInfo} />
}
