'use client'

import { useEffect, useState } from 'react'
import MainLayout from '../layout'
import Radio from '@/components/Radio'
import { getAssignments } from '@/db/assignments/getAssignments'
import { ClockIcon } from '@heroicons/react/24/outline'
import formatDate from '@/utils/formatDate'

export default function Page() {
  const [selectedView, setSelectedView] = useState('all')
  const viewOptions = [
    { id: 'all', name: 'All' },
    { id: 'high-priority', name: 'High Priority' },
  ]

  const [assignments, setAssignments] = useState([])
  useEffect(() => {
    getAssignments().then((res) => setAssignments(res || []))
  }, [])

  return (
    <div>
      <MainLayout.Header>Assignments</MainLayout.Header>

      <MainLayout.Body>
        <div className="flex flex-row gap-4 items-center">
          <p className="text-text-weakest">Show:</p>
          <Radio
            options={viewOptions}
            selected={selectedView}
            setSelected={setSelectedView}
          />
        </div>

        <div className="flex flex-col gap-6 mt-4 bg-background-weak border-1 border-stroke-weak px-6 py-5">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              Todo
            </p>
            <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
              2
            </div>
          </div>

          <div className="w-2xl">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors"
              >
                <div className="flex flex-row gap-3">
                  <p className="font-bold">{a.title}</p>
                  <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center">
                    <p className="uppercase text-xs font-semibold">
                      {a.subjectInfo.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-1 items-center">
                  <ClockIcon className="size-4 text-text-weaker" />
                  <p className="text-sm text-text-weaker">
                    {formatDate(a.due_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout.Body>
    </div>
  )
}
