'use client'

import { createUser } from '@/db/users/createUser'
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Form from 'next/form'
import { useState, useActionState, useEffect } from 'react'
import EnrolledSubjects from './EnrolledSubjects'
import { toTitleCase } from '@/utils/toTitleCase'

export default function CreateUser({ allSubjects }) {
  const [role, setRole] = useState('student')
  const roleOptions = ['student', 'teacher', 'admin']
  const [isMenuOpened, setIsMenuOpened] = useState(false)
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
          <div
            className="border-1 border-stroke-weak rounded p-2 cursor-pointer transition-colors w-full text-left"
            onClick={() => setIsMenuOpened((prev) => !prev)}
          >
            <p>{toTitleCase(role)}</p>
          </div>

          {isMenuOpened && (
            <div className="border-1 border-stroke-weak bg-white py-2 px-2 rounded absolute left-0 top-18 z-10 w-64">
              <div className="flex flex-col gap-1">
                {roleOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="flex flex-row gap-2 justify-between items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors w-full"
                    onClick={() => {
                      setRole(option)
                    }}
                  >
                    <p>{toTitleCase(option)}</p>
                    {role === option && (
                      <CheckIcon className="size-4 text-text-weak" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* <div className="flex flex-col gap-1">
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
          </select>
        </div> */}

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
            <EnrolledSubjects
              allSubjects={allSubjects}
              enrolledSubjectIds={enrolledSubjectIds}
              setEnrolledSubjectIds={setEnrolledSubjectIds}
            />
          </div>
        )}

        {role === 'teacher' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="subjects">Taught Subjects</label>
            <EnrolledSubjects
              allSubjects={availableSubjectsToTeach}
              enrolledSubjectIds={taughtSubjectIds}
              setEnrolledSubjectIds={setTaughtSubjectIds}
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
