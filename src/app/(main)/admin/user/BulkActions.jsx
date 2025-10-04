'use client'

import { useState, useEffect } from 'react'
import {
  ArrowUpTrayIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Icon from '@/components/Icon'
import { XCircleIcon } from '@heroicons/react/20/solid'
import toTitleCase from '@/utils/toTitleCase'

export default function BulkActions({
  selectedUserIds,
  setSelectedUserIds,
  updatedUsers,
  setUpdatedUsers,
  setIsEdited,
}) {
  const [bulkMenuOpened, setBulkMenuOpened] = useState(null)

  function updateUsers(updateFunction) {
    setUpdatedUsers((prev) =>
      prev.map((user) =>
        selectedUserIds.includes(user.id) ? updateFunction(user) : user
      )
    )
    setIsEdited(true)
  }

  function handleRoleChange(role) {
    updateUsers((user) => ({ ...user, role: role }))
    setBulkMenuOpened(null)
  }

  function handleDeactivate() {
    updateUsers((user) => ({ ...user, deactivated_date: new Date() }))
  }

  function handleActivate() {
    updateUsers((user) => ({ ...user, deactivated_date: null }))
  }
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-1 border-stroke-weak p-0.5 rounded">
        <div className="py-1 px-2 rounded bg-fill-weak w-fit flex flex-row gap-2 items-center">
          <p>{selectedUserIds.length} selected</p>
          <button
            type="button"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedUserIds([])
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
            setBulkMenuOpened(bulkMenuOpened === 'role' ? null : 'role')
          }}
        >
          <Icon border className="flex flex-row gap-1 items-center px-2">
            <UserIcon className="size-5 text-text-weak" />
            <p className="tracking-wide">Set role...</p>
          </Icon>
        </button>

        {bulkMenuOpened === 'role' && (
          <div className="border-1 border-stroke-weak bg-white py-2 px-2 rounded absolute left-0 top-12 z-10 w-64">
            <div className="max-h-32 overflow-scroll flex flex-col gap-1 overflow-x-hidden overflow-y-auto">
              {['student', 'teacher', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  className="flex flex-row gap-2 justify-between items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRoleChange(role)
                  }}
                >
                  <div className="flex flex-row gap-2 items-end">
                    <p>{toTitleCase(role)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
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
            <p className="tracking-wide">Deactivate User(s)</p>
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
            <p className="tracking-wide">Activate User(s)</p>
          </Icon>
        </button>
      </div>
    </div>
  )
}
