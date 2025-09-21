'use client'

import { useState, useEffect } from 'react'
import formatDate from '@/utils/formatDate'
import toTitleCase from '@/utils/toTitleCase'
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  EllipsisVerticalIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline'
import Icon from '@/components/Icon'

export default function AllUsers({ allUsers }) {
  const [selectedUsers, setSelectedUsers] = useState([])
  const [viewUsers, setViewUsers] = useState(allUsers)
  const viewUserIds = viewUsers.map((u) => u.id)

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search.length > 0) {
      setViewUsers(
        allUsers?.filter((user) => {
          return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.id.toLowerCase().includes(search.toLowerCase()) ||
            formatDate(user.reg_date)
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
          )
        })
      )
    } else {
      setViewUsers(allUsers)
    }
  }, [search])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="font-semibold text-xl">All Users</h2>
        <div className="w-6 h-6 text-sm text-text-weak bg-fill-weak rounded flex justify-center items-center">
          {allUsers.length}
        </div>
      </div>

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

          <div className="relative">
            <button type="button">
              <Icon tooltip="Statistics" border>
                <ChartBarIcon className="text-text-weak size-5" />
              </Icon>
            </button>
          </div>

          <div className="relative">
            <button type="button">
              <Icon tooltip="More actions">
                <EllipsisVerticalIcon className="text-text-weak size-5" />
              </Icon>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[30px_180px_100px_80px_140px_76px_auto] items-center px-3 py-2 text-sm text-text-weak">
          {search.length === 0 ? (
            <input
              type="checkbox"
              className="border-1 border-text-weak accent-text-weak"
              checked={selectedUsers.length === viewUsers.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedUsers(viewUserIds)
                } else {
                  setSelectedUsers([])
                }
              }}
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
        <div className="w-2xl flex flex-col gap-2 h-[400px] overflow-y-auto overflow-x-hidden">
          {viewUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[30px_180px_100px_80px_140px_76px_auto] items-center border-1 border-stroke-weak rounded px-3 py-2"
            >
              <input
                type="checkbox"
                className="border-1 border-text-weak accent-text-weak"
                checked={selectedUsers.includes(user.id)}
                onChange={() => {
                  if (selectedUsers.includes(user.id)) {
                    setSelectedUsers((prev) =>
                      prev.filter((id) => id !== user.id)
                    )
                  } else {
                    setSelectedUsers((prev) => [...prev, user.id])
                  }
                }}
              />
              <p className="">{user.name}</p>
              <p className="text-text-weak text-sm">#{user.id}</p>
              {true ? (
                <p className="text-text-weaker text-sm">
                  {' '}
                  &#8226; &#8226; &#8226; &#8226;
                </p>
              ) : (
                <p>{user.password}</p>
              )}
              <p className="text-sm">{formatDate(user.reg_date)}</p>
              <p className="text-sm">{toTitleCase(user.role)}</p>
              <Icon tooltip="See details">
                <ArrowUpRightIcon className="size-4 text-text-weak" />
              </Icon>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
