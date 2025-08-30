'use client'

import { useEffect, useState } from 'react'
import Radio from '@/components/Radio'
import Icon from '@/components/Icon'
import {
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import formatDate from '@/utils/formatDate'
import { setCollectedAssignments } from '@/db/assignments/setCollectedAssignments.js'

export default function AssignmentStatus({ assignment, students }) {
  const [updatedStudents, setUpdatedStudents] = useState(students)
  const [isEdited, setIsEdited] = useState(false)
  const [isPendingSave, setIsPendingSave] = useState(false)
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [isStatsOpened, setIsStatsOpened] = useState(false)

  const stats = {
    submitted: updatedStudents?.filter(
      (student) => student.collected_date !== null
    ).length,
  }

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
    { id: 'submitted', name: 'On-time' },
    { id: 'absent', name: 'Absent' },
  ]

  const [search, setSearch] = useState('')

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

  function markAllSubmitted() {
    setUpdatedStudents((prev) => {
      const updated = prev.map((student) => {
        if (student.collected_date === null) {
          return {
            ...student,
            collected_date: new Date(),
          }
        }

        return student
      })
      return updated
    })
  }

  function closeMenus() {
    setIsMenuOpened(false)
    setIsStatsOpened(false)
  }

  return (
    <div onClick={closeMenus}>
      <div className="flex flex-row justify-between items-center">
        <Radio
          options={viewOptions}
          selected={selectedView}
          setSelected={setSelectedView}
        />

        <div className="flex flex-row items-center gap-2">
          <div className="relative">
            <input
              type="text"
              className="border-1 border-stroke-weak rounded focus:outline-text-weaker focus:outline-1 h-8 pl-2 pr-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-0 top-0">
              <Icon tooltip="Search">
                <MagnifyingGlassIcon className="text-text-weak size-5" />
              </Icon>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsStatsOpened((prev) => !prev)
              }}
            >
              <Icon tooltip={isStatsOpened ? null : 'Statistics'} border>
                <ChartBarIcon className="text-text-weak size-5" />
              </Icon>
            </button>

            {isStatsOpened && (
              <div
                className="border-1 border-stroke-weak bg-white py-1.5 px-2 rounded absolute right-[-4px] top-10 w-44 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-row items-center justify-between rounded py-1 px-2 transition-colors">
                  <div className="flex flex-row gap-1 items-center">
                    <CheckIcon className="size-4 text-text-weak" />
                    <p className="text-nowrap text-text-weak">Submitted</p>
                  </div>
                  <p className="text-nowrap">{stats.submitted}</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpened((prev) => !prev)
              }}
            >
              <Icon tooltip={isMenuOpened ? null : 'More actions'}>
                <EllipsisVerticalIcon className="text-text-weak size-5" />
              </Icon>
            </button>

            {isMenuOpened && (
              <div
                className="border-1 border-stroke-weak bg-white py-1.5 px-2 rounded absolute right-[-4px] top-10 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="flex flex-row gap-2 items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors"
                  onClick={markAllSubmitted}
                >
                  <CheckCircleIcon className="size-5 text-text-weak" />
                  <p className="text-nowrap">Mark all as submitted</p>
                </button>
              </div>
            )}
          </div>

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

      {updatedStudents && (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 mt-5">
          {updatedStudents
            .filter((student) => {
              if (selectedView === 'all') return true
              if (selectedView === 'late') {
                return student.collected_date > assignment.due_date
              }
              if (selectedView === 'submitted') {
                return (
                  student.collected_date &&
                  student.collected_date < assignment.due_date
                )
              }
            })
            .map((student) => {
              const late = student.collected_date > assignment.due_date
              return (
                <button
                  key={student.id}
                  className={clsx(
                    'flex flex-col items-start px-6 py-5 rounded-lg cursor-pointer transition-colors text-left text-nowrap',
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
                            collected_date: s.collected_date
                              ? null
                              : new Date(),
                          }
                        }
                        return s
                      })
                    )
                  }}
                  hidden={
                    search.length > 0 &&
                    !(
                      student.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      student.id.toLowerCase().includes(search.toLowerCase())
                    )
                  }
                >
                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold text-lg">{student.name}</p>
                    {student.collected_date &&
                      (late ? (
                        <p className="text-red-700">(Late submission)</p>
                      ) : (
                        <p className="text-green-700">
                          ({formatDate(student.collected_date)})
                        </p>
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
