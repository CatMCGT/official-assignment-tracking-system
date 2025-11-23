import Link from 'next/link'
import {
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import MainLayout from '../../layout'
import formatDate from '@/utils/formatDate'
import getSubjectInfo from '@/utils/getSubjectInfo'
import { getMonitoredAssignments } from '@/db/assignments/getMonitoredAssignments'
import ArchivedAssignments from '@/components/ArchivedAssignments'
import Properties from '@/components/Properties'
import Icon from '@/components/Icon'
import SubjectMonitorProperty from './SubjectMonitor'
import { Suspense } from 'react'
import Loading from './loading'
import { getTaughtSubjects } from '@/db/subjects/getTaughtSubjects'
import { getOnTimeSubmitPercentages } from '@/db/assignments/assignmentStatistics'

export async function generateMetadata({ params }) {
  const { subjectId } = await params

  return {
    title: `${subjectId}`,
  }
}

export default async function Page({ params }) {
  const { subjectId } = await params
  const subjectInfo = getSubjectInfo(subjectId)
  const subject = (await getTaughtSubjects(subjectId))[0]
  const assignments = await getMonitoredAssignments(subjectId)
  const onTimeSubmitPercentages = await getOnTimeSubmitPercentages(subjectId)

  const inProgress = assignments?.filter(
    (a) => new Date(a.due_date) >= new Date()
  )
  const archived = assignments?.filter((a) => new Date(a.due_date) < new Date())

  //return <Loading />

  return (
    <Suspense fallback={<Loading />}>
      <MainLayout.Header>
        <div className="flex flex-row gap-3 mb-2">
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
        <Properties>
          <Properties.Property name="Teacher">
            <AcademicCapIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>
            {subject?.teacher_name}
          </Properties.Property.Value>

          <Properties.Property name="Subject Monitor">
            <PencilSquareIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <SubjectMonitorProperty subject={subject} />

          {/* <Properties.Property name="Number of Students">
            <HashtagIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>
            {subject?.students.length}
          </Properties.Property.Value> */}
        </Properties>

        <hr className="text-stroke-weak w-full"></hr>

        <div>
          <div className="flex flex-row gap-3 items-center mb-2">
            <h2 className="font-semibold text-xl">All Students</h2>
            <div className="w-6 h-6 text-sm text-text-weak bg-fill-weak rounded flex justify-center items-center">
              {subject?.students?.length}
            </div>
          </div>

          <div className="grid grid-cols-[200px_300px_auto] items-center px-3 py-2 text-sm text-text-weak">
            <p>Name</p>
            <p>ID</p>
            <p>On-time Submission</p>
          </div>
          <div className="w-2xl flex flex-col gap-2 max-h-72 overflow-scroll">
            {subject?.students?.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-[200px_300px_auto] items-center border-1 border-stroke-weak rounded px-3 py-2"
              >
                <p className="text-lg">{student.name}</p>
                <p className="text-text-weak">#{student.id}</p>
                <p>
                  {onTimeSubmitPercentages?.filter(
                    (s) => s.student_id === student.id
                  )[0]?.on_time_submit_percentage || '0'}
                  %
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-row gap-3 items-center justify-between mb-3">
            <h2 className="font-semibold text-xl">Assignments</h2>
            <Link href={`/teach/${subjectId}/create`}>
              <Icon tooltip="Create new assignment" border>
                <div className="flex flex-row gap-1 items-center px-1">
                  New
                  <BookOpenIcon className="size-5 text-text-weak font-bold" />
                </div>
              </Icon>
            </Link>
          </div>

          <div className="flex flex-col gap-6 bg-background-weak border-1 border-stroke-weak px-6 py-5 mb-4">
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
              <div className="w-2xl flex flex-col gap-2">
                {inProgress.map((a) => {
                  const submittedCount = a.students.filter(
                    (student) => student.collected_date !== null
                  ).length
                  const stats = {
                    submitted: submittedCount,
                    not_submitted: a.students.length - submittedCount,
                  }

                  return (
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

                        <div className="flex flex-row gap-3">
                          <div className="flex flex-row gap-1 items-center">
                            <ClockIcon className="size-4 text-text-weaker" />
                            <p className="text-sm text-text-weak">
                              {formatDate(a.due_date)}
                            </p>
                          </div>

                          <div className="flex flex-row gap-1 items-center">
                            <CheckCircleIcon className="size-4 text-text-weaker" />
                            <p className="text-sm text-text-weak">
                              {stats.submitted} Submitted, {stats.not_submitted}{' '}
                              Left
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="w-2xl text-text-weak mt-[-8px]">
                Wonderful! There are no assignments to be collected 🎉
              </p>
            )}
          </div>

          {archived?.length > 0 && (
            <ArchivedAssignments
              archived={archived}
              subjectId={subjectId}
              subjectInfo={subjectInfo}
            />
          )}
        </div>
      </MainLayout.Body>
    </Suspense>
  )
}
