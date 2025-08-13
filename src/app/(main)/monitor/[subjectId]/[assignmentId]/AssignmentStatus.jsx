'use client'

import { useEffect, useState } from 'react'
import Radio from '@/components/Radio'
import Icon from '@/components/Icon'
import {
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { setCollectedAssignments } from '@/db/assignments/setCollectedAssignments.js'

export default function AssignmentStatus({ assignment, students }) {
  const [updatedStudents, setUpdatedStudents] = useState(students)
  const [isEdited, setIsEdited] = useState(false)
  const [isPendingSave, setIsPendingSave] = useState(false)

  useEffect(() => {
    if (
      updatedStudents.length > 0 &&
      JSON.stringify(updatedStudents) != JSON.stringify(students)
    ) {
      setIsEdited(true)
    } else {
      setIsEdited(false)
    }
  }, [updatedStudents])

  useEffect(() => {
    setUpdatedStudents(students)
    setIsPendingSave(false)
  }, [students])

  const [selectedView, setSelectedView] = useState('all')
  const viewOptions = [
    { id: 'all', name: 'All' },
    { id: 'late', name: 'Late' },
    { id: 'submitted', name: 'Submitted' },
    { id: 'absent', name: 'Absent' },
  ]

  async function handleSubmit() {
    try {
      setIsPendingSave(true)
      await setCollectedAssignments(
        assignment.subject_id,
        assignment.assignment_id,
        updatedStudents
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <Radio
          options={viewOptions}
          selected={selectedView}
          setSelected={setSelectedView}
        />

        <div className="flex flex-row items-center gap-2">
          <button type="button">
            <Icon tooltip="Search" border>
              <MagnifyingGlassIcon className="text-text-weak size-5" />
            </Icon>
          </button>

          <button type="button">
            <Icon tooltip="Statistics" border>
              <ChartBarIcon className="text-text-weak size-5" />
            </Icon>
          </button>

          <button type="button">
            <Icon tooltip="More actions">
              <EllipsisVerticalIcon className="text-text-weak size-5" />
            </Icon>
          </button>

          {isEdited && !isPendingSave && (
            <button
              className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak"
              onClick={() => {
                setUpdatedStudents(students)
              }}
            >
              Undo
            </button>
          )}

          <button
            type="submit"
            className={clsx(
              'px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest',
              isEdited ? 'bg-text-weak' : 'bg-text-weakest'
            )}
            disabled={isPendingSave}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>

      {updatedStudents && (
        <div className="grid grid-cols-3 mt-5">
          {updatedStudents.map((student) => {
            const late = student.collected_date > assignment.due_date
            return (
              <button
                key={student.id}
                className={clsx(
                  'flex flex-col items-start px-6 py-5 rounded-lg cursor-pointer transition-colors',
                  student.collected_date
                    ? late
                      ? 'border-red-400 border-1 bg-red-50 hover:border-red-500'
                      : 'border-green-400 border-1 bg-green-50 hover:border-green-500'
                    : 'border-stroke-weak border-1 hover:border-1 hover:border-text-weakest'
                )}
                onClick={() => {
                  setUpdatedStudents((prev) =>
                    prev.map((s) => {
                      if (s.id == student.id) {
                        return {
                          ...s,
                          collected_date: s.collected_date ? null : new Date(),
                        }
                      }
                    })
                  )
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  <p className="font-bold text-lg">{student.name}</p>
                  {student.collected_date &&
                    (late ? (
                      <p className="text-red-700">(Late submission)</p>
                    ) : (
                      <p className="text-green-700">(Submitted)</p>
                    ))}
                </div>
                <p className="text-text-weak">#{student.id}</p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
