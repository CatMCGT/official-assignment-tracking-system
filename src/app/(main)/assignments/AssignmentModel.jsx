'use client'

import Icon from '@/components/Icon'
import {
  XMarkIcon,
  ClockIcon,
  AcademicCapIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

import formatDate from '@/utils/formatDate'
import Properties from '@/components/Properties'
import { getSubjectAdmin } from '@/db/subjects/getSubjectAdmin'
import { useEffect,useState } from 'react'
import Skeleton from '@/components/Skeleton'

export default function AssignmentModel({ assignment, onClose }) {
  const [subjectAdmin, setSubjectAdmin] = useState({})

  useEffect(() => {
    async function fetchSubjectAdmin() {
      try {
        const res = await getSubjectAdmin(assignment.subjectId)
        setSubjectAdmin(res)
      } catch (error) {
        console.error('Failed to fetch subject admin:', error)
      }
    }
    fetchSubjectAdmin()
  }, [assignment.subjectId])

  return (
    <div className="border-l-1 border-l-stroke-weak bg-white z-10 absolute right-0 h-screen top-0 px-11 py-15">
      <div className="flex flex-row justify-between items-start gap-2 mb-4">
        <div className="flex flex-col gap-4 w-[560px]">
          <div className="flex flex-row gap-3 items-center">
            <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
              {assignment?.subjectInfo?.name}
            </div>

            <div className="px-5 py-[5px] rounded-full bg-fill-weak w-fit flex flex-row gap-1 items-center">
              <ClockIcon className="size-4 text-text-weaker" />
              <p className="text-sm text-text-weak">
                {formatDate(assignment?.due_date)}
              </p>
            </div>
          </div>
          <h2 className="font-semibold text-2xl ">
            {assignment?.assignment_title}
          </h2>

          {subjectAdmin?.teacher_id?.length > 0 ? (
            <Properties>
              <Properties.Property name="Teacher">
                <AcademicCapIcon className="size-5 text-text-weak" />
              </Properties.Property>
              <Properties.Property.Value>
                {subjectAdmin?.teacher_name}
              </Properties.Property.Value>

              <Properties.Property name="Subject Monitor">
                <PencilSquareIcon className="size-5 text-text-weak" />
              </Properties.Property>
              <Properties.Property.Value>
                {subjectAdmin?.monitor_name}
              </Properties.Property.Value>
            </Properties>
          ) : (
            <Properties>
              <Properties.Property name="Teacher">
                <AcademicCapIcon className="size-5 text-text-weak" />
              </Properties.Property>
              <Skeleton className="w-full h-8" />

              <Properties.Property name="Subject Monitor">
                <PencilSquareIcon className="size-5 text-text-weak" />
              </Properties.Property>
              <Skeleton className="w-full h-8" />
            </Properties>
          )}

          <hr className="text-stroke-weak mt-2 mb-2"></hr>

          {/* <div className="flex flex-row gap-2 items-center">
            <p className="text-text-weak">Actions:</p>
            {assignment?.status === 'todo' ? (
              <button
                type="button"
                className="flex flex-row gap-2 border-1 border-stroke-weak px-3 py-2 rounded-lg text-sm w-fit hover:bg-fill-weak cursor-pointer transition-colors"
                onClick={handleSetComplete}
              >
                Mark as complete
                <CheckIcon className="size-5 text-green-500" />
              </button>
            ) : (
              <button
                type="button"
                className="flex flex-row gap-2 border-1 border-stroke-weak px-3 py-2 rounded-lg text-sm w-fit hover:bg-fill-weak cursor-pointer transition-colors"
                onClick={handleSetTodo}
              >
                Mark as todo
                <ClockIcon className="size-5 text-text-weakest" />
              </button>
            )}
          </div> */}
        </div>

        <button type="button" onClick={onClose}>
          <Icon tooltip="Close">
            <XMarkIcon className="text-text-weaker size-5" />
          </Icon>
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-2">Description</h3>
      <p className="text-text-weak">{assignment?.assignment_description}</p>
    </div>
  )
}
