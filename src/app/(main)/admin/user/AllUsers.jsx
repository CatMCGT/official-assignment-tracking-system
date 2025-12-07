'use client'

import { useState } from 'react'
import formatDate from '@/utils/formatDate'
import toTitleCase from '@/utils/toTitleCase'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Icon from '@/components/Icon'
import BulkActions from './BulkActions'
import clsx from 'clsx'
import { setUsers } from '@/db/users/setUsers'
import EditUser from './EditUser'

export default function AllUsers({ allUsers, allSubjects }) {
  const [updatedUsers, setUpdatedUsers] = useState(allUsers)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [search, setSearch] = useState('')
  const [isEdited, setIsEdited] = useState(false)
  const [isPendingSave, setIsPendingSave] = useState(false)

  const [inspectingUser, setInspectingUser] = useState(null)

  const filteredUsers = search
    ? updatedUsers.filter((user) => {
        return (
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.id.toLowerCase().includes(search.toLowerCase()) ||
          formatDate(user.reg_date)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase())
        )
      })
    : updatedUsers

  function isUserEdited(user) {
    const originalUser = allUsers.find((u) => u.id === user.id)
    return (
      originalUser.name !== user.name ||
      originalUser.role !== user.role ||
      originalUser.deactivated_date !== user.deactivated_date
    )
  }

  async function handleSubmit() {
    try {
      setIsPendingSave(true)
      await setUsers(updatedUsers.filter((user) => isUserEdited(user)))
      setIsEdited(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsPendingSave(false)
    }
  }

  async function handleUndo() {
    setUpdatedUsers(allUsers)
    setIsEdited(false)
  }

  return (
    <div className="flex flex-col gap-2 w-4xl">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="font-semibold text-xl">All Users</h2>
        <div className="w-6 h-6 text-sm text-text-weak bg-fill-weak rounded flex justify-center items-center">
          {updatedUsers.length}
        </div>
      </div>
      {!inspectingUser ? (
        <div>
          <div className="flex flex-row justify-between items-center mb-2">
            <div>{/* Radio goes here */}</div>

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

              {isEdited && !isPendingSave && (
                <button
                  className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak"
                  onClick={handleUndo}
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
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_6fr_3fr_3fr_5fr_3fr_1fr] items-center px-3 py-2 text-sm text-text-weak">
              {!search ? (
                <input
                  type="checkbox"
                  className="border-1 border-text-weak accent-text-weak"
                  checked={selectedUserIds.length === updatedUsers.length}
                  onChange={(e) =>
                    setSelectedUserIds(
                      e.target.checked ? filteredUsers.map((u) => u.id) : []
                    )
                  }
                />
              ) : (
                <div></div>
              )}
              <p>Name</p>
              <p>ID</p>
              <p>Password</p>
              <p>Registration Date</p>
              <p>Role</p>
            </div>
            <div className="flex flex-col gap-2 h-[340px] overflow-y-auto overflow-x-hidden">
              {filteredUsers.map((user) => {
                return (
                  <div
                    key={user.id}
                    className={clsx(
                      'grid grid-cols-[1fr_6fr_3fr_3fr_5fr_3fr_1fr] items-center border-1 rounded px-3 py-2',
                      isUserEdited(user)
                        ? 'border-neutral-500 bg-neutral-50 border-dashed'
                        : 'border-stroke-weak'
                    )}
                  >
                    <input
                      type="checkbox"
                      className="border-1 border-text-weak accent-text-weak cursor-pointer"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => {
                        if (selectedUserIds.includes(user.id)) {
                          setSelectedUserIds((prev) =>
                            prev.filter((id) => id !== user.id)
                          )
                        } else {
                          setSelectedUserIds((prev) => [...prev, user.id])
                        }
                      }}
                    />
                    <div className="flex flex-row gap-1 items-center">
                      <p>{user.name}</p>
                      {user.deactivated_date !== null && (
                        <div className="w-fit">
                          <Icon
                            tooltip={formatDate(user.deactivated_date)}
                            className="hover:bg-white"
                          >
                            <span className="text-red-500">(deactivated)</span>
                          </Icon>
                        </div>
                      )}
                    </div>
                    <p className="text-text-weak text-sm">#{user.id}</p>
                    <p className="text-text-weaker text-sm">
                      {' '}
                      &#8226; &#8226; &#8226; &#8226;
                    </p>
                    <p className="text-sm">{formatDate(user.reg_date)}</p>
                    <p className="text-sm">{toTitleCase(user.role)}</p>
                    <button onClick={() => setInspectingUser(user)}>
                      <Icon tooltip="See details">
                        <ArrowRightIcon className="size-4 text-text-weak" />
                      </Icon>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          {selectedUserIds.length > 0 && (
            <BulkActions
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
              updatedUsers={updatedUsers}
              setUpdatedUsers={setUpdatedUsers}
              setIsEdited={setIsEdited}
            />
          )}
        </div>
      ) : (
        <EditUser
          allSubjects={allSubjects}
          user={inspectingUser}
          setInspectingUser={setInspectingUser}
        />
      )}
    </div>
  )
}
