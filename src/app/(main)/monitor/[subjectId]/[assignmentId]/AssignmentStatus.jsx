'use client'

import { useEffect, useState } from 'react'
import Radio from '@/components/Radio'
import Icon from '@/components/Icon'
import {
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

export default function AssignmentStatus({ students }) {
  const [studentsState, setStudentsState] = useState(students)

  const [selectedView, setSelectedView] = useState('all')
  const viewOptions = [
    { id: 'all', name: 'All' },
    { id: 'late', name: 'Late' },
    { id: 'submitted', name: 'Submitted' },
    { id: 'absent', name: 'Absent' },
  ]

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <Radio
          options={viewOptions}
          selected={selectedView}
          setSelected={setSelectedView}
        />

        <div className="flex flex-row items-center gap-2">
          <button type="button">
            <Icon tooltip="Search" border>
              <MagnifyingGlassIcon className="text-text-weak size-5" />
            </Icon>
          </button>

          <button type="button">
            <Icon tooltip="Statistics" border>
              <ChartBarIcon className="text-text-weak size-5" />
            </Icon>
          </button>

          <button type="button">
            <Icon tooltip="More actions">
              <EllipsisVerticalIcon className="text-text-weak size-5" />
            </Icon>
          </button>
        </div>
      </div>

      {studentsState && (
        <div className="grid grid-cols-3 mt-3">
          {studentsState.map((student) => (
            <button key={student.id} className="flex flex-col items-start px-6 py-5 border-1 border-stroke-weak rounded-lg hover:border-text-weakest cursor-pointer">
              <p className="font-bold text-lg">{student.name}</p>
              <p className="text-text-weak">#{student.id}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
