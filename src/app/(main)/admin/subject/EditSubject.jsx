'use client'

import Icon from '@/components/Icon'
import Select from '@/components/Select'
import { updateSubjectStudents } from '@/db/subjects/setSubject'
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

export default function EditSubject({
  subject,
  allUsers,
  setInspectingSubject,
}) {
  const allTeachers = allUsers.filter((user) => user.role === 'teacher')
  const allStudents = allUsers.filter((user) => user.role === 'student')

  const [subjectTeacherId, setSubjectTeacherId] = useState(subject.teacher_id)
  const [subjectMonitorId, setSubjectMonitorId] = useState(subject.monitor_id)

  const originalEnrolledIds = subject.students.map((s) => s.id)
  const [subjectStudentIds, setSubjectStudentIds] =
    useState(originalEnrolledIds)

  const isEdited =
    subjectTeacherId !== subject.teacher_id ||
    subjectMonitorId !== subject.monitor_id ||
    originalEnrolledIds.toString() !== subjectStudentIds.toString()
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit() {
    try {
      setIsPending(true)
      const newlyEnrolled = subjectStudentIds
        .filter((id) => !originalEnrolledIds.includes(id))
        .map((item) => {
          return {
            subjectId: subject.id,
            studentId: item,
          }
        })
      const removedEnrolled = originalEnrolledIds
        .filter((id) => !subjectStudentIds.includes(id))
        .map((item) => {
          return {
            subjectId: subject.id,
            studentId: item,
          }
        })
      if (newlyEnrolled.length > 0 || removedEnrolled.length > 0) {
        await updateSubjectStudents(newlyEnrolled, removedEnrolled)
      }
      setInspectingSubject(null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsPending(false)
    }
  }

  async function handleUndo() {
    setSubjectTeacherId(subject.teacher_id)
    setSubjectMonitorId(subject.monitor_id)
    setSubjectStudentIds(originalEnrolledIds)
  }

  return (
    <div className="flex flex-row gap-4 items-start border-1 rounded border-stroke-weak p-4">
      <button
        onClick={() => setInspectingSubject(null)}
        disabled={isPending || isEdited}
      >
        {isPending || isEdited ? (
          <Icon className="hover:bg-white">
            <ArrowLeftIcon className="size-4 text-text-weak" />
          </Icon>
        ) : (
          <Icon tooltip="Back">
            <ArrowLeftIcon className="size-4 text-text-weak" />
          </Icon>
        )}
      </button>
      <div className="p-4 pt-0 pl-0 w-72 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Edit Subject #{subject.id}</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="subjects">
            Subject Teacher <span className="text-red-500">*</span>
          </label>
          <Select
            options={allTeachers}
            selected={subjectTeacherId}
            setSelected={setSubjectTeacherId}
            placeholder="No subject teacher"
            allowSearch
            showId
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subjects">Subject Monitor</label>
          <Select
            options={allStudents}
            selected={subjectMonitorId}
            setSelected={setSubjectMonitorId}
            placeholder="No subject monitor"
            allowSearch
            showId
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subjects">Enrolled Students</label>
          <Select
            options={allStudents}
            selected={subjectStudentIds}
            setSelected={setSubjectStudentIds}
            placeholder="No enrolled students"
            allowSearch
            showId
            multiSelect
          />
        </div>

        <div className="flex flex-row gap-2">
          {isEdited && !isPending && (
            <button
              className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak w-fit"
              onClick={handleUndo}
            >
              Undo
            </button>
          )}

          <button
            type="submit"
            className={clsx(
              'px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit',
              isEdited ? 'bg-text-weak' : 'bg-text-weakest'
            )}
            disabled={isPending || !isEdited}
            onClick={handleSubmit}
          >
            {isPending ? (
              <ArrowPathIcon className="size-6 text-white" />
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
