'use client'

import Icon from '@/components/Icon'
import Select from '@/components/Select'
import { setStudentSubject } from '@/db/subjects/setStudentSubject'
import { checkSubjectStudentChanges } from '@/utils/checkSubjectChanges'
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
  const [subjectStudentIds, setSubjectStudentIds] = useState(originalEnrolledIds)

  const isEdited =
    subjectTeacherId !== subject.teacher_id ||
    subjectMonitorId !== subject.monitor_id ||
    originalEnrolledIds.toString() !== subjectStudentIds.toString()
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit() {
    try {
      setIsPending(true)
      const studentChanges = checkSubjectStudentChanges(originalEnrolledIds, subjectStudentIds)
      if (studentChanges.newlyEnrolled.length > 0 && studentChanges.removedEnrolled.length > 0) {
        // db function
      }
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
