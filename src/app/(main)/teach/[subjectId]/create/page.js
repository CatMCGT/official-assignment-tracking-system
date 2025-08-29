'use client'

import Properties from '@/components/Properties'
import { getSubjectStudents } from '@/db/subjects/getSubjectStudents'
import { getUser } from '@/db/users/getUser'
import getSubjectInfo from '@/utils/getSubjectInfo'
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDateRangeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { getSubjectAdmin } from '@/db/subjects/getSubjectAdmin'
import DueDate from './DueDate'
import clsx from 'clsx'
import AssignedStudents from './AssignedStudents'
import { createAssignment } from '@/db/assignments/createAssignment'

export default function Page({ params }) {
  const [user, setUser] = useState()
  const [subjectId, setSubjectId] = useState("")
  const [subjectStudents, setSubjectStudents] = useState()
  const [assignedStudentIds, setAssignedStudentIds] = useState([])
  const [subjectInfo, setSubjectInfo] = useState()
  const [subjectAdmin, setSubjectAdmin] = useState()

  useEffect(() => {
    async function fetchData() {
      const { subjectId } = await params
      setSubjectId(subjectId)
      const subjectStudents = await getSubjectStudents(subjectId)
      setSubjectStudents(subjectStudents)
      const subjectStudentIds = subjectStudents.map((s) => s.id)
      setAssignedStudentIds(subjectStudentIds)

      setSubjectInfo(getSubjectInfo(subjectId))
      const subjectAdmin = await getSubjectAdmin(subjectId)
      setSubjectAdmin(subjectAdmin)

      const user = await getUser()
      setUser(user)
    }

    fetchData()
  }, [])

  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    dueDate: new Date().toLocaleDateString('en-CA') + 'T00:00',
  })
  const [isFilledIn, setIsFilledIn] = useState(false)

  useEffect(() => {
    console.log(assignment, assignedStudentIds)
    if (
      assignment.title != '' &&
      assignment.dueDate &&
      assignedStudentIds.length > 0
    ) {
      setIsFilledIn(true)
    } else {
      setIsFilledIn(false)
    }
  }, [assignment, assignedStudentIds])

  function handleCreateAssignment() {
    createAssignment(subjectId, assignment, assignedStudentIds)
  }

  return (
    <div className="flex flex-col gap-10 justify-between items-start">
      <div className="flex flex-col gap-4 w-2xl">
        <div className="flex flex-row gap-3 items-center">
          <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
            {subjectInfo?.name}
          </div>
        </div>
        <input
          className="border-1 border-stroke-weak rounded py-1 px-3 transition-colors w-full font-semibold text-2xl focus:outline-1 mb-2 placeholder:font-normal outline-text-weakest"
          placeholder="Enter title..."
          value={assignment.title}
          onChange={(e) =>
            setAssignment((prev) => {
              return {
                ...prev,
                title: e.target.value,
              }
            })
          }
        ></input>

        <Properties>
          <Properties.Property name="Due Date">
            <CalendarDateRangeIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <DueDate assignment={assignment} setAssignment={setAssignment} />

          <Properties.Property name="Teacher">
            <AcademicCapIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>{user?.name}</Properties.Property.Value>

          <Properties.Property name="Student Monitor">
            <PencilSquareIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>
            {subjectAdmin?.monitor_name}
          </Properties.Property.Value>

          <Properties.Property name="Assigned to">
            <BookOpenIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <AssignedStudents
            subjectStudents={subjectStudents}
            subjectStudentIds={subjectStudents?.map((s) => s.id)}
            assignedStudentIds={assignedStudentIds}
            setAssignedStudentIds={setAssignedStudentIds}
          />
        </Properties>

        <hr className="text-stroke-weak mt-2 mb-2 w-3xl"></hr>

        <h3 className="font-semibold text-lg">
          Description <span className="text-text-weaker">(Optional)</span>
        </h3>
        <textarea
          className="border-1 border-stroke-weak h-48 focus:outline-1 outline-text-weakest p-4 rounded resize-none"
          placeholder="Enter description..."
        ></textarea>
      </div>

      <button
        type="submit"
        className={clsx(
          'px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed',
          isFilledIn ? 'bg-text-weak' : 'bg-text-weakest'
        )}
        disabled={!isFilledIn}
        onClick={handleCreateAssignment}
      >
        Create assignment
      </button>
    </div>
  )
}
