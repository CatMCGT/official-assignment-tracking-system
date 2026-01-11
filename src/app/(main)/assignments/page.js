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
import AssignmentItem from './AssignmentItem'

export default function Page() {
  const [assignments, setAssignments] = useState([])
  const notSubmitted = assignments?.filter((a) => a.collected_date === null)
  const submitted = assignments?.filter(
    (a) => a.collected_date !== null && new Date(a.due_date) >= new Date()
  )
  const archived = assignments?.filter(
    (a) =>
      a.collected_date !== null &&
      new Date(a.due_date) < new Date() &&
      a.deactivated_date === null
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
            <div className="max-w-2xl lg:w-2xl flex flex-col gap-3">
              {notSubmitted?.map((a) => (
                <AssignmentItem
                  key={a.assignment_id}
                  a={a}
                  setAssignmentModel={setAssignmentModel}
                />
              ))}
            </div>
          ) : (
            <p className="text-text-weak mt-[-8px]">
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

            <div className="max-w-2xl lg:w-2xl flex flex-col gap-3">
              {submitted.map((a) => (
                <AssignmentItem
                  key={a.assignment_id}
                  a={a}
                  setAssignmentModel={setAssignmentModel}
                />
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
            {archived.length > 0 && (
              <button
                type="button"
                aria-label="expand archived assignments"
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
            )}
          </div>

          {isArchivedOpen && (
            <div className="lg:w-2xl flex flex-col gap-3">
              {archived.map((a) => (
                <AssignmentItem
                  key={a.assignment_id}
                  a={a}
                  setAssignmentModel={setAssignmentModel}
                />
              ))}
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
