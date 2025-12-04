import { ClockIcon } from '@heroicons/react/24/outline'
import { getMonitoredAssignments } from '@/db/assignments/getMonitoredAssignments'
import getSubjectInfo from '@/utils/getSubjectInfo'
import formatDate from '@/utils/formatDate'
import AssignmentStatus from './AssignmentStatus'
import { Suspense } from 'react'
import Loading from './loading'
import { getUser } from '@/db/users/getUser'
import Charts from './Charts'

export async function generateMetadata({ params }) {
  const { subjectId, assignmentId } = await params

  return {
    title: `${subjectId} · Assignment #${assignmentId}`,
  }
}

export default async function Page({ params }) {
  const { subjectId, assignmentId } = await params
  const subjectInfo = getSubjectInfo(subjectId)
  const subjectAssignments = await getMonitoredAssignments(subjectId)
  const assignment = subjectAssignments?.filter(
    (a) => a.assignment_id == assignmentId
  )[0]
  const user = await getUser()

  return (
    <Suspense fallback={<Loading />}>
      <div className="mt-3">
        <div className="flex flex-col gap-4 w-full max-w-6xl">
          <div className="flex flex-row gap-3 items-center">
            <div
              className="px-5 py-[5px] rounded-full w-fit flex justify-center items-center uppercase text-xs font-semibold"
              style={{ backgroundColor: subjectInfo.color }}
            >
              {subjectInfo.name}
            </div>

            <div className="px-5 py-[5px] rounded-full bg-fill-weak w-fit flex flex-row gap-1 items-center">
              <ClockIcon className="size-4 text-text-weaker" />
              <p className="text-sm text-text-weak">
                {formatDate(assignment?.due_date)}
              </p>
            </div>
          </div>
          <h2 className="font-semibold text-2xl ">
            {assignment?.assignment_title}
          </h2>
          <p className="text-text-weak mb-4">
            {assignment?.assignment_description}
          </p>

          <hr className="text-stroke-weak mt-2 mb-5"></hr>
        </div>

        {user.role === 'teacher' && (
          <div className="mb-4">
            <Charts assignment={assignment} />
          </div>
        )}

        <AssignmentStatus
          assignment={assignment}
          students={assignment.students}
          userRole={user.role}
        />
      </div>
    </Suspense>
  )
}
