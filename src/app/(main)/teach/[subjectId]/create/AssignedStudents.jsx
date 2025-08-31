'use client'

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/20/solid'

export default function AssignedStudents({
  subjectStudents,
  subjectStudentIds = [],
  assignedStudentIds,
  setAssignedStudentIds,
}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="relative">
      <div className="flex flex-row gap-2">
        <div
          className="border-1 border-stroke-weak rounded p-2 cursor-pointer transition-colors w-full text-left"
          onClick={() => setIsMenuOpened((prev) => !prev)}
        >
          {assignedStudentIds.length == subjectStudentIds.length ? (
            'All students enrolled'
          ) : assignedStudentIds.length === 0 ? (
            'No students'
          ) : (
            <div>
              {subjectStudents
                .filter((s) => assignedStudentIds.includes(s.id))
                .map((s) => (
                  <div
                    key={s.id}
                    className="py-1 px-2 rounded bg-fill-weak w-fit flex flex-row gap-2 items-center"
                  >
                    <p>{s.name}</p>
                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        setAssignedStudentIds((prev) =>
                          prev.filter((id) => id !== s.id)
                        )
                      }}
                    >
                      <XCircleIcon className="size-4 text-text-weaker" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {isMenuOpened && (
        <div className="border-1 border-stroke-weak bg-white py-2 px-2 rounded absolute left-0 top-14 z-10 w-64">
          <input
            type="text"
            placeholder="Search..."
            className="border-b-1 border-text-weakest w-56 mx-2 mb-2 outline-0 p-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          ></input>
          <div className="max-h-32 overflow-scroll flex flex-col gap-1">
            {subjectStudents
              ?.filter(
                (option) =>
                  option.name.toLowerCase().includes(search.toLowerCase()) ||
                  option.id.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="flex flex-row gap-2 justify-between items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors w-full"
                  onClick={() => {
                    setAssignedStudentIds((prev) => {
                      if (prev.includes(option.id)) {
                        return prev.filter((id) => id !== option.id)
                      } else {
                        return [...prev, option.id]
                      }
                    })
                  }}
                >
                  {option.name}
                  {assignedStudentIds.includes(option.id) && (
                    <CheckIcon className="size-4 text-text-weak" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
