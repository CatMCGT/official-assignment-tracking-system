'use client'

import { createUser } from '@/db/users/createUser'
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Form from 'next/form'
import { useState, useActionState, useEffect } from 'react'
import toTitleCase from '@/utils/toTitleCase'
import Select from '@/components/Select'

export default function CreateUser({ allSubjects }) {
  const [role, setRole] = useState('student')
  const roleOptions = [
    {
      id: 'student',
      name: 'Student',
    },
    {
      id: 'teacher',
      name: 'Teacher',
    },
    {
      id: 'admin',
      name: 'Admin',
    },
  ]
  const [enrolledSubjectIds, setEnrolledSubjectIds] = useState([])
  const [taughtSubjectIds, setTaughtSubjectIds] = useState([])
  const availableSubjectsToTeach = allSubjects.filter(
    (s) => s.teacherId === null
  )

  const additionalData =
    role === 'student'
      ? {
          enrolledSubjectIds: enrolledSubjectIds,
          role: role,
        }
      : role === 'teacher'
      ? {
          taughtSubjectIds: taughtSubjectIds,
          role: role,
        }
      : {
          role: role,
        }

  const [createUserState, createUserAction, isPending] = useActionState(
    createUser.bind(null, additionalData),
    {
      id: '',
      name: '',
      password: '',
    }
  )

  return (
    <Form
      action={createUserAction}
      className="border-1 border-stroke-weak rounded p-4 w-72"
    >
      <h2 className="text-lg font-bold mb-3">Create User</h2>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <label>
            Role <span className="text-red-500">*</span>
          </label>
          <Select options={roleOptions} selected={role} setSelected={setRole} />
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

        {role === 'student' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="subjects">Enrolled Subjects</label>
            <Select
              options={allSubjects}
              selected={enrolledSubjectIds}
              setSelected={setEnrolledSubjectIds}
              placeholder="No enrolled subjects"
              allowSearch
              multiSelect
              showId
            />
          </div>
        )}

        {role === 'teacher' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="subjects">Taught Subjects</label>
            <Select
              options={allSubjects}
              selected={taughtSubjectIds}
              setSelected={setTaughtSubjectIds}
              placeholder="No taught subjects"
              allowSearch
              multiSelect
              showId
            />
          </div>
        )}

        {createUserState?.message && (
          <p
            className={clsx(
              'font-bold text-sm mt-0' && true,
              createUserState?.success ? 'text-green-400' : 'text-red-400'
            )}
          >
            {createUserState.message}
          </p>
        )}

        <button
          type="submit"
          className="px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit mt-2 bg-text-weak"
          disabled={isPending}
        >
          {isPending ? (
            <ArrowPathIcon className="size-6 text-white" />
          ) : (
            'Create'
          )}
        </button>
      </div>
    </Form>
  )
}
