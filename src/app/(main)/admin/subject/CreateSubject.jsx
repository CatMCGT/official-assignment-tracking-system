'use client'

import Radio from '@/components/Radio'
import Select from '@/components/Select'
import Form from 'next/form'
import { useActionState, useEffect, useState } from 'react'
import { subjectShorthands } from '@/utils/getSubjectInfo'
import { createSubject } from '@/db/subjects/createSubject'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default function CreateSubject({ allUsers, allSubjects }) {
  const [subjectType, setSubjectType] = useState('grade')
  const [subjectTeacherId, setSubjectTeacherId] = useState(null)
  const [subjectMonitorId, setSubjectMonitorId] = useState(null)
  const [subjectStudentIds, setSubjectStudentIds] = useState([])
  const [subjectShorthand, setSubjectShorthand] = useState(null)

  const allTeachers = allUsers?.filter((user) => user.role === 'teacher')
  const allStudents = allUsers?.filter((user) => user.role === 'student')

  const subjectShorthandOptions = Object.keys(subjectShorthands).map(
    (shorthand) => {
      return {
        id: shorthand,
        name: subjectShorthands[shorthand].name,
      }
    }
  )

  const additionalData = {
    subjectType: subjectType,
    subjectShorthand: subjectShorthand,
    subjectTeacherId: subjectTeacherId,
    subjectMonitorId: subjectMonitorId,
    subjectStudentIds: subjectStudentIds.filter(
      (id) => id !== null && id !== undefined
    ),
  }

  useEffect(() => {
    if (
      !subjectStudentIds.includes(subjectMonitorId) &&
      subjectMonitorId !== null
    ) {
      setSubjectStudentIds((prev) => [...prev, subjectMonitorId])
    }
  }, [subjectMonitorId])

  useEffect(() => {
    if (
      !subjectStudentIds.includes(subjectMonitorId) &&
      subjectMonitorId !== null
    ) {
      setSubjectMonitorId(null)
    }
  }, [subjectStudentIds])

  const [createSubjectState, createSubjectAction, isPending] = useActionState(
    createSubject.bind(null, additionalData),
    {
      grade: '',
      class: '',
      block: '',
    }
  )

  return (
    <Form
      action={createSubjectAction}
      className="border-1 border-stroke-weak rounded p-4 w-72 flex flex-col gap-3"
    >
      <h2 className="text-lg font-bold">Create Subject</h2>

      <Radio
        options={[
          {
            id: 'grade',
            name: 'Grade',
          },
          {
            id: 'class',
            name: 'Class',
          },
        ]}
        selected={subjectType}
        setSelected={setSubjectType}
      />

      {subjectType === 'grade' && (
        <div>
          <div className="flex flex-row justify-between items-center mb-3">
            <label htmlFor="grade">
              Grade <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-12 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
              min="1"
              max="12"
              id="grade"
              name="grade"
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center">
            <label htmlFor="block">
              Block <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-12 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
              min="1"
              id="block"
              name="block"
              required
            />
          </div>
        </div>
      )}

      {subjectType === 'class' && (
        <div className="flex flex-row justify-between items-center">
          <label htmlFor="class">
            Class <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-16 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
            id="class"
            name="class"
            maxLength="3"
            required
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="subjectName">
          Subject <span className="text-red-500">*</span>
        </label>
        <Select
          options={subjectShorthandOptions}
          selected={subjectShorthand}
          setSelected={setSubjectShorthand}
          placeholder="No selected subject"
          allowSearch
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subjects">
          Subject Teacher <span className="text-red-500">*</span>
        </label>
        <Select
          options={allTeachers}
          selected={subjectTeacherId}
          setSelected={setSubjectTeacherId}
          placeholder="No subject teacher"
          allowSearch
          showId
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subjects">Subject Monitor</label>
        <Select
          options={allStudents}
          selected={subjectMonitorId}
          setSelected={setSubjectMonitorId}
          placeholder="No subject monitor"
          allowSearch
          showId
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subjects">Enrolled Students</label>
        <Select
          options={allStudents}
          selected={subjectStudentIds}
          setSelected={setSubjectStudentIds}
          placeholder="No enrolled students"
          allowSearch
          showId
          multiSelect
        />
      </div>

      {createSubjectState?.message && (
        <p
          className={clsx(
            'font-bold text-sm mt-0' && true,
            createSubjectState?.success ? 'text-green-400' : 'text-red-400'
          )}
        >
          {createSubjectState.message}
        </p>
      )}

      <button
        type="submit"
        className="px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit mt-2 bg-text-weak"
        disabled={isPending}
      >
        {isPending ? <ArrowPathIcon className="size-6 text-white" /> : 'Create'}
      </button>
    </Form>
  )
}
