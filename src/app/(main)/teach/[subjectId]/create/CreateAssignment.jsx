'use client'

import Properties from '@/components/Properties'
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CalendarDateRangeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import DueDate from './DueDate'
import clsx from 'clsx'
import AssignedStudents from './AssignedStudents'
import { createAssignment } from '@/db/assignments/createAssignment'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback, useState, Suspense } from 'react'
import Loading from './loading'

export default function CreateAssignment({ subject, subjectInfo }) {
  const router = useRouter()

  const [assignedStudentIds, setAssignedStudentIds] = useState(
    subject.students.map((s) => s.id)
  )
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    dueDate: new Date().toLocaleDateString('en-CA') + 'T00:00',
    grade: '',
  })
  const [isFilledIn, setIsFilledIn] = useState(false)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (
      assignment.title != '' &&
      assignment.dueDate &&
      assignedStudentIds.length > 0 &&
      (assignment.grade != '' || assignment.grade === null)
    ) {
      setIsFilledIn(true)
    } else {
      setIsFilledIn(false)
    }
  }, [assignment, assignedStudentIds])

  const handleCreateAssignment = useCallback(async () => {
    setIsPending(true)
    const res = await createAssignment(
      subject.id,
      assignment,
      assignedStudentIds
    )
    const assignmentId = res?.assignmentId
    router.push(`/monitor/${subject.id}/${assignmentId}`)
  }, [isFilledIn])

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-10 justify-between items-start">
        <div className="flex flex-col gap-4 w-2xl">
          <div className="flex flex-row gap-3 items-center">
            <div
              className="px-5 py-[5px] rounded-full w-fit flex justify-center items-center uppercase text-xs font-semibold"
              style={{ backgroundColor: subjectInfo?.color }}
            >
              {subjectInfo?.name}
            </div>
          </div>
          <input
            className="border-1 border-stroke-weak rounded py-1 px-3 transition-colors w-full font-semibold text-2xl focus:outline-1 mb-2 placeholder:font-normal outline-text-weakest"
            placeholder="Enter title..."
            value={assignment.title}
            onChange={(e) =>
              setAssignment((prev) => {
                return {
                  ...prev,
                  title: e.target.value,
                }
              })
            }
          ></input>

          <Properties>
            <Properties.Property name="Due Date">
              <CalendarDateRangeIcon className="size-5 text-text-weak" />
            </Properties.Property>
            <DueDate assignment={assignment} setAssignment={setAssignment} />

            <Properties.Property name="Teacher">
              <AcademicCapIcon className="size-5 text-text-weak" />
            </Properties.Property>
            <Properties.Property.Value>
              {subject.teacher_name}
            </Properties.Property.Value>

            <Properties.Property name="Student Monitor">
              <PencilSquareIcon className="size-5 text-text-weak" />
            </Properties.Property>
            <Properties.Property.Value>
              {subject.monitor_name}
            </Properties.Property.Value>

            <Properties.Property name="Assigned to">
              <BookOpenIcon className="size-5 text-text-weak" />
            </Properties.Property>
            <AssignedStudents
              subjectStudents={subject.students}
              subjectStudentIds={subject.students?.map((s) => s.id)}
              assignedStudentIds={assignedStudentIds}
              setAssignedStudentIds={setAssignedStudentIds}
            />
          </Properties>

          <hr className="text-stroke-weak mt-2 mb-2 w-3xl"></hr>

          <div>
            {assignment.grade !== null && (
              <div className="flex flex-row justify-between items-center">
                <h3 className="font-semibold text-lg">
                  Grade<span className="text-red-500">*</span>
                </h3>
                <div className="flex flex-row items-center gap-2">
                  <p>- /</p>
                  <input
                    type="number"
                    className="w-14 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
                    min="1"
                    required
                    value={assignment.grade}
                    onChange={(e) =>
                      setAssignment((prev) => {
                        return {
                          ...prev,
                          grade: e.target.value,
                        }
                      })
                    }
                  />
                </div>
              </div>
            )}
            <div className="flex flex-row items-center gap-2 text-text-weak">
              (
              <input
                type="checkbox"
                id="disable-grade"
                className="accent-text-weak cursor-pointer"
                checked={assignment.grade === null}
                onChange={(e) =>
                  setAssignment((prev) => {
                    return {
                      ...prev,
                      grade: e.target.checked ? null : '',
                    }
                  })
                }
              />
              <label htmlFor="disable-grade" className="cursor-pointer">
                Disable Grade
              </label>
              )
            </div>
          </div>

          <h3 className="font-semibold text-lg">
            Description <span className="text-text-weaker">(Optional)</span>
          </h3>
          <textarea
            className="border-1 border-stroke-weak h-48 focus:outline-1 outline-text-weakest p-4 rounded resize-none"
            placeholder="Enter description..."
            value={assignment.description}
            onChange={(e) =>
              setAssignment((prev) => {
                return {
                  ...prev,
                  description: e.target.value,
                }
              })
            }
          ></textarea>
        </div>

        <button
          type="submit"
          className={clsx(
            'px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed',
            isFilledIn ? 'bg-text-weak' : 'bg-text-weakest'
          )}
          disabled={isPending || !isFilledIn}
          onClick={handleCreateAssignment}
        >
          {isPending ? (
            <ArrowPathIcon className="size-5 text-white" />
          ) : (
            'Create assignment'
          )}
        </button>
      </div>
    </Suspense>
  )
}
