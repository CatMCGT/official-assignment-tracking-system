'use client'

import Properties from '@/components/Properties'
import Select from '@/components/Select'
import { setCollectedAssignments } from '@/db/assignments/setCollectedAssignments.js'
import formatDate from '@/utils/formatDate'
import {
  AcademicCapIcon,
  ArrowPathIcon,
  CalendarDateRangeIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export default function StuAssignmentDetails({
  subjectInfo,
  assignment,
  student,
}) {
  const [updatedStudent, setUpdatedStudent] = useState(student)
  const [isEdited, setIsEdited] = useState(false)
  const [isPendingSave, setIsPendingSave] = useState(false)

  useEffect(() => {
    if (JSON.stringify(updatedStudent) != JSON.stringify(student)) {
      setIsEdited(true)
    } else {
      setIsEdited(false)
    }
  }, [updatedStudent])

  useEffect(() => {
    setUpdatedStudent(student)
    setIsPendingSave(false)
  }, [student])

  async function handleSubmit() {
    try {
      setIsPendingSave(true)
      const newStudents = assignment.students.map((s) => {
        if (s.id === student?.id) {
          return updatedStudent
        } else {
          return s
        }
      })
      await setCollectedAssignments(
        assignment.subject_id,
        assignment.assignment_id,
        newStudents
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-2xl">
      <div className="flex flex-row gap-3 items-center">
        <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
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

      <Properties>
        <Properties.Property name="Inspecting Student">
          <AcademicCapIcon className="size-5 text-text-weak" />
        </Properties.Property>

        <p>
          {student?.name}{' '}
          <span className="text-text-weaker">(#{student?.id})</span>
        </p>

        <Properties.Property name="Collected Date">
          <CalendarDateRangeIcon className="size-5 text-text-weak" />
        </Properties.Property>

        <input
          type="datetime-local"
          className="border-1 border-stroke-weak rounded py-1 px-2 hover:bg-fill-weak cursor-pointer transition-colors w-full outline-text-weakest focus:outline-1"
          value={
            new Date(
              updatedStudent?.collected_date === null
                ? ''
                : updatedStudent?.collected_date
            ).toLocaleDateString('en-CA') + 'T00:00'
          }
          onChange={(e) =>
            setUpdatedStudent((prev) => ({
              ...prev,
              collected_date: e.target.value,
            }))
          }
        />

        <Properties.Property name="Status">
          <UserCircleIcon className="size-5 text-text-weak" />
        </Properties.Property>
        <Select
          options={[
            { id: null, name: 'Not submitted 📄' },
            { id: 'submitted', name: 'Submitted ✅' },
            { id: 'absent', name: 'Absent 😷' },
          ]}
          selected={[updatedStudent?.status]}
          setSelected={(newStatus) =>
            setUpdatedStudent((prev) => ({
              ...prev,
              status: newStatus,
              collected_date: ['submitted', 'late'].includes(newStatus)
                ? new Date()
                : '',
            }))
          }
        />
      </Properties>

      <hr className="text-stroke-weak mt-2 mb-2"></hr>
      {assignment?.grade !== null && (
        <div className="flex flex-row justify-between items-center">
          <h3 className="font-semibold text-lg">Grade</h3>
          <div>
            <input
              type="number"
              className="w-12 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
              min="0"
              max={assignment?.assignment_grade}
              value={updatedStudent?.grade != null ? updatedStudent?.grade : ''}
              onChange={(e) => {
                setUpdatedStudent((prev) => ({
                  ...prev,
                  grade: e.target.value,
                }))
              }}
            />{' '}
            / {assignment?.assignment_grade}
          </div>
        </div>
      )}

      <h3 className="font-semibold text-lg">
        Feedback <span className="text-text-weaker">(Optional)</span>
      </h3>
      <textarea
        className="border-1 border-stroke-weak h-48 focus:outline-1 outline-text-weakest p-4 rounded resize-none"
        placeholder="Enter feedback..."
        value={updatedStudent?.feedback != null ? updatedStudent?.feedback : ''}
        onChange={(e) =>
          setUpdatedStudent((prev) => {
            return {
              ...prev,
              feedback: e.target.value,
            }
          })
        }
      ></textarea>

      <div className="flex flex-row gap-2">
        {isEdited && !isPendingSave && (
          <button
            className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak"
            onClick={() => {
              setUpdatedStudent(student)
            }}
          >
            Undo
          </button>
        )}

        <button
          type="submit"
          className={clsx(
            'px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed',
            isEdited ? 'bg-text-weak' : 'bg-text-weakest'
          )}
          disabled={isPendingSave || !isEdited}
          onClick={handleSubmit}
        >
          {isPendingSave ? (
            <ArrowPathIcon className="size-6 text-white" />
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  )
}
