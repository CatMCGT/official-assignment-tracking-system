'use client'

import { useEffect, useState } from 'react'
import MainLayout from '../layout'
import Radio from '@/components/Radio'
import { getAssignments } from '@/db/assignments/getAssignments'
import { ClockIcon } from '@heroicons/react/24/outline'
import formatDate from '@/utils/formatDate'
import AssignmentModel from './AssignmentModel'
import { getSubjectsAsMonitor } from '@/db/subjects/getMonitoredSubjects'

export default function Page() {
  const [selectedView, setSelectedView] = useState('all')
  const viewOptions = [
    { id: 'all', name: 'All' },
    { id: 'high-priority', name: 'High Priority' },
  ]

  const [assignments, setAssignments] = useState([])
  const todo = assignments?.filter((a) => a.status === 'todo')
  const complete = assignments?.filter((a) => a.status === 'complete')

  function refreshAssignments() {
    getAssignments().then((res) => setAssignments(res || []))
  }
  
  useEffect(() => {
    refreshAssignments()
  }, [])

  const [assignmentModel, setAssignmentModel] = useState({
    isOpened: false,
    assignmentId: '',
  })

  return (
    <div>
      <MainLayout.Header>Assignments</MainLayout.Header>

      <MainLayout.Body>
        <div className="flex flex-row gap-4 items-center">
          <p className="text-text-weak">Show:</p>
          <Radio
            options={viewOptions}
            selected={selectedView}
            setSelected={setSelectedView}
          />
        </div>

        <div className="flex flex-col gap-6 mt-4 bg-background-weak border-1 border-stroke-weak px-6 py-5">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              Todo
            </p>
            {todo.length > 0 && (
              <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
                {todo.length}
              </div>
            )}
          </div>

          {todo.length > 0 ? (
            <div className="w-2xl">
              {assignments.map((a) => (
                <button
                  key={a.id}
                  className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors w-full"
                  onClick={() =>
                    setAssignmentModel({ isOpened: true, assignmentId: a.id })
                  }
                >
                  <div className="flex flex-row gap-3">
                    <p className="font-bold">{a.title}</p>
                    <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
                      {a.subjectInfo.name}
                    </div>
                  </div>

                  <div className="flex flex-row gap-1 items-center">
                    <ClockIcon className="size-4 text-text-weaker" />
                    <p className="text-sm text-text-weak">
                      {formatDate(a.due_date)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="w-2xl text-text-weak mt-[-8px]">
              Wonderful! You have no items left to do. 🎉
            </p>
          )}
        </div>

        {complete.length > 0 && (
          <div className="flex flex-col gap-6 mt-4 bg-background-weak border-1 border-stroke-weak px-6 py-5">
            <div className="flex flex-row gap-[6px] items-center">
              <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
                Completed
              </p>
              <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
                {complete.length}
              </div>
            </div>

            <div className="w-2xl">
              {assignments.map((a) => (
                <button
                  key={a.id}
                  className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors w-full"
                  onClick={() =>
                    setAssignmentModel({ isOpened: true, assignmentId: a.id })
                  }
                >
                  <div className="flex flex-row gap-3">
                    <p className="font-bold">{a.title}</p>
                    <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
                      {a.subjectInfo.name}
                    </div>
                  </div>

                  <div className="flex flex-row gap-1 items-center">
                    <ClockIcon className="size-4 text-text-weaker" />
                    <p className="text-sm text-text-weak">
                      {formatDate(a.due_date)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {assignmentModel.isOpened && (
          <AssignmentModel
            assignment={
              assignments.filter(
                (a) => a.id === assignmentModel.assignmentId
              )[0]
            }
            onClose={() =>
              setAssignmentModel({ isOpened: false, assignment: [] })
            }
            refreshAssignments={refreshAssignments}
          />
        )}
      </MainLayout.Body>
    </div>
  )
}
