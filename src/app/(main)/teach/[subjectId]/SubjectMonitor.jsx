'use client'

import Icon from '@/components/Icon'
import { updateSubjects } from '@/db/subjects/setSubject'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SubjectMonitorProperty({ subject }) {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [search, setSearch] = useState('')
  const [subjectMonitorState, setSubjectMonitorState] = useState({
    id: subject.monitor_id,
    name: subject.monitor_name,
  })
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    setIsMenuOpened(false)
    setIsPending(true)
    await updateSubjects([
      {
        ...subject,
        monitor_id: subjectMonitorState.id,
      },
    ])
    setIsPending(false)
    router.refresh
  }

  return (
    <div className="relative">
      <div className="flex flex-row gap-2">
        <button
          className="border-1 border-stroke-weak rounded py-1 px-2 hover:bg-fill-weak cursor-pointer transition-colors w-full text-left"
          onClick={() => setIsMenuOpened((prev) => !prev)}
        >
          {subjectMonitorState.name || "No subject monitor"}
        </button>

        {subjectMonitorState.id !== subject.monitor_id && (
          <>
            <button
              type="button"
              className="disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isPending}
            >
              <Icon tooltip="Confirm" border>
                <CheckIcon className="size-5 text-green-600" />
              </Icon>
            </button>
            <button
              type="button"
              className="disabled:cursor-not-allowed"
              onClick={() =>
                setSubjectMonitorState({
                  id: subject.monitor_id,
                  name: subject.monitor_name,
                })
              }
              disabled={isPending}
            >
              <Icon tooltip="Undo" border>
                <XMarkIcon className="size-5 text-red-600" />
              </Icon>
            </button>
          </>
        )}
      </div>

      {isMenuOpened && (
        <div className="border-1 border-stroke-weak bg-white py-2 px-2 rounded absolute left-0 top-10 z-10 w-64">
          <input
            type="text"
            placeholder="Search..."
            className="border-b-1 border-text-weakest w-56 mx-2 mb-2 outline-0 p-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          ></input>
          <div className="max-h-32 overflow-scroll flex flex-col gap-1">
            {subject.students
              ?.filter(
                (student) =>
                  student.name.toLowerCase().includes(search.toLowerCase()) ||
                  student.id.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className={clsx(
                    'flex flex-row gap-2 items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors w-full',
                    subjectMonitorState.id === student.id && 'bg-fill-weak'
                  )}
                  onClick={() => {
                    setIsMenuOpened(false)
                    setSubjectMonitorState({
                      id: student.id,
                      name: student.name,
                    })
                  }}
                >
                  {student.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
