'use client'

import Icon from '@/components/Icon'
import { UserIcon } from '@heroicons/react/24/outline'
import Form from 'next/form'

export default function CreateUser() {
  return (
    <Form className="border-1 border-stroke-weak rounded p-4 w-72">
      <h2 className="text-lg font-bold mb-3">Create User</h2>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="role">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            className="border-0 rounded bg-fill-weak px-2 py-2 text-text-strong focus:outline-1 outline-text-weakest cursor-pointer w-fit"
            required
          >
            <option name="role" value="student">
              Student
            </option>
            <option name="role" value="teacher">
              Teacher
            </option>
            <option name="role" value="admin">
              Admin
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="userId">
            ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="px-3 py-2 bg-fill-weak rounded-xs placeholder:text-text-weaker text-text-weak focus:outline-1 focus:outline-text-weakest"
            placeholder="ID"
            id="id"
            name="id"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="userId">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="px-3 py-2 bg-fill-weak rounded-xs placeholder:text-text-weaker text-text-weak focus:outline-1 focus:outline-text-weakest"
            placeholder="Name"
            id="name"
            name="name"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="px-3 py-2 bg-fill-weak rounded-xs placeholder:text-text-weaker text-text-weak focus:outline-1 focus:outline-text-weakest"
            placeholder="Password"
            id="password"
            name="password"
            required
          />
        </div>

        <button className='w-fit mt-4'>
          <Icon border className="border-text-weakest">
            <div className="flex flex-row gap-1 items-center px-1">
              Create
              <UserIcon className="size-5 text-text-weak font-bold" />
            </div>
          </Icon>
        </button>
      </div>
    </Form>
  )
}
