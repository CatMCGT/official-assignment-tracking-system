'use client'

import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline'
import Icon from '@/components/Icon'
import { XCircleIcon } from '@heroicons/react/20/solid'

export default function BulkActions({
  selectedSubjectIds,
  setSelectedSubjectIds,
  setUpdatedSubjects,
  setIsEdited,
}) {
  function updateSubjects(updateFunction) {
    setUpdatedSubjects((prev) =>
      prev.map((subject) =>
        selectedSubjectIds.includes(subject.id)
          ? updateFunction(subject)
          : subject
      )
    )

    setIsEdited(true)
  }

  function handleDeactivate() {
    updateSubjects((subject) => ({ ...subject, deactivated_date: new Date() }))
  }

  function handleActivate() {
    updateSubjects((subject) => ({ ...subject, deactivated_date: null }))
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-1 border-stroke-weak p-0.5 rounded">
        <div className="py-1 px-2 rounded bg-fill-weak w-fit flex flex-row gap-2 items-center">
          <p>{selectedSubjectIds.length} selected</p>
          <button
            type="button"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedSubjectIds([])
            }}
          >
            <XCircleIcon className="size-4 text-text-weaker"></XCircleIcon>
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleDeactivate()
          }}
        >
          <Icon border className="flex flex-row gap-1 items-center px-2">
            <TrashIcon className="size-5 text-red-500" />
            <p className="tracking-wide">Deactivate Subject(s)</p>
          </Icon>
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleActivate()
          }}
        >
          <Icon border className="flex flex-row gap-1 items-center px-2">
            <ArrowUpTrayIcon className="size-5 text-green-500" />
            <p className="tracking-wide">Activate Subject(s)</p>
          </Icon>
        </button>
      </div>
    </div>
  )
}
