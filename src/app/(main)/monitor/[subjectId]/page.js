import { ClockIcon } from '@heroicons/react/24/outline'
import formatDate from '@/utils/formatDate'
import { getMonitoredAssignments } from '@/db/assignments/getMonitoredAssignments'
import MainLayout from '../../layout'
import getSubjectInfo from '@/utils/getSubjectInfo'
import Link from 'next/link'

export default async function Page({ params }) {
  const { subjectId } = await params
  const subjectInfo = getSubjectInfo(subjectId)
  const subjectAssignments = await getMonitoredAssignments(subjectId)
  const inProgress = subjectAssignments?.filter(
    (a) => new Date(a.due_date) > new Date()
  )
  
  return (
    <div>
      <MainLayout.Header>
        <div className="flex flex-row gap-3">
          {subjectInfo.grade
            ? `Grade ${subjectInfo.grade}`
            : `Class ${subjectInfo.class}`}{' '}
          {subjectInfo.name} {subjectInfo.block && `Block ${subjectInfo.block}`}
          <div className="px-3 py-2 rounded-full bg-fill-weak w-fit flex justify-center items-center text-xs text-text-weak tracking-wide">
            #{subjectId}
          </div>
        </div>
      </MainLayout.Header>

      <MainLayout.Body>
        <p className="text-text-weak">
          Managed by {subjectAssignments[0].teacher_name}.
        </p>
        <div className="flex flex-col gap-6 mt-2 bg-background-weak border-1 border-stroke-weak px-6 py-5">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              In progress
            </p>
            {inProgress?.length > 0 && (
              <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
                {inProgress.length}
              </div>
            )}
          </div>

          {inProgress?.length > 0 ? (
            <div className="w-2xl">
              {inProgress.map((a) => (
                <Link
                  href={`/monitor/${subjectId}/${a.assignment_id}`}
                  key={a.assignment_id}
                >
                  <div className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors">
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">{a.assignment_title}</p>
                      <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
                        {subjectInfo.name}
                      </div>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                      <ClockIcon className="size-4 text-text-weaker" />
                      <p className="text-sm text-text-weak">
                        {formatDate(a.due_date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="w-2xl text-text-weak mt-[-8px]">
              Wonderful! There are no assignments to be collected 🎉
            </p>
          )}
        </div>
      </MainLayout.Body>
    </div>
  )
}
