'use client'

import { Suspense, useEffect, useState } from 'react'
import MainLayout from '../layout'
import { getMyAssignments } from '@/db/assignments/getMyAssignments'
import {
  ClockIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import formatDate from '@/utils/formatDate'
import AssignmentModel from './AssignmentModel'
import Icon from '@/components/Icon'

export default function Page() {
  // const [selectedView, setSelectedView] = useState('all')
  // const viewOptions = [
  //   { id: 'all', name: 'All' },
  //   { id: 'high-priority', name: 'High Priority' },
  // ]

  const [assignments, setAssignments] = useState([])
  const notSubmitted = assignments?.filter((a) => a.collected_date === null)
  const submitted = assignments?.filter(
    (a) => a.collected_date !== null && new Date(a.due_date) >= new Date()
  )
  const archived = assignments?.filter(
    (a) => a.collected_date !== null && new Date(a.due_date) < new Date()
  )
  const [isArchivedOpen, setIsArchivedOpen] = useState(false)

  function refreshAssignments() {
    getMyAssignments().then((res) => setAssignments(res || []))
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
        {/* <div className="flex flex-row gap-4 items-center">
          <p className="text-text-weak">Show:</p>
          <Radio
            options={viewOptions}
            selected={selectedView}
            setSelected={setSelectedView}
          />
        </div> */}

        <div className="flex flex-col gap-6 mt-4 bg-background-weak border-1 border-stroke-weak px-6 py-5">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              Not submitted
            </p>
            {notSubmitted.length > 0 && (
              <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
                {notSubmitted.length}
              </div>
            )}
          </div>

          {notSubmitted.length > 0 ? (
            <div className="w-2xl flex flex-col gap-3">
              {notSubmitted?.map((a) => (
                <button
                  key={a.assignment_id}
                  className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors w-full"
                  onClick={() =>
                    setAssignmentModel({
                      isOpened: true,
                      assignmentId: a.assignment_id,
                    })
                  }
                >
                  <div className="flex flex-row gap-3">
                    <p className="font-bold">{a.assignment_title}</p>
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
              Wonderful! You have no items that are not submitted. 🎉
            </p>
          )}
        </div>

        {submitted?.length > 0 && (
          <div className="flex flex-col gap-6 mt-4 bg-background-weak border-1 border-stroke-weak px-6 py-5">
            <div className="flex flex-row gap-[6px] items-center">
              <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
                Submitted
              </p>
              <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
                {submitted.length}
              </div>
            </div>

            <div className="w-2xl flex flex-col gap-3">
              {submitted.map((a) => (
                <button
                  key={a.assignment_id}
                  className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors w-full"
                  onClick={() =>
                    setAssignmentModel({
                      isOpened: true,
                      assignmentId: a.assignment_id,
                    })
                  }
                >
                  <div className="flex flex-row gap-3">
                    <p className="font-bold">{a.assignment_title}</p>
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

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              Archived
            </p>
            <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
              {archived.length}
            </div>
            <button
              type="button"
              className="ml-2"
              onClick={() => setIsArchivedOpen((prev) => !prev)}
            >
              <Icon>
                {isArchivedOpen ? (
                  <ChevronUpIcon className="size-4 text-text-weak" />
                ) : (
                  <ChevronRightIcon className="size-4 text-text-weak" />
                )}
              </Icon>
            </button>
          </div>

          {isArchivedOpen && (
            <div className="w-2xl flex flex-col gap-3">
              {archived.map((a) => {
                return (
                  <button
                    key={a.assignment_id}
                    className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors w-full"
                    onClick={() =>
                      setAssignmentModel({
                        isOpened: true,
                        assignmentId: a.assignment_id,
                      })
                    }
                  >
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">{a.assignment_title}</p>
                      <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
                        {a.subjectInfo.name}
                      </div>
                    </div>

                    <div className="flex flex-row gap-3">
                      <div className="flex flex-row gap-1 items-center">
                        <ClockIcon className="size-4 text-text-weaker" />
                        <p className="text-sm text-text-weak">
                          {formatDate(a.due_date)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {assignmentModel.isOpened && (
          <AssignmentModel
            assignment={
              assignments.filter(
                (a) => a.assignment_id === assignmentModel.assignmentId
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
