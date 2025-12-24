'use client'

import { useEffect, useState } from 'react'

export default function DueDate({ assignment, setAssignment }) {
  const [dueDate, setDueDate] = useState(
    new Date().toLocaleDateString('en-CA') + 'T00:00'
  )

  useEffect(() => {
    setAssignment((prev) => {
      return {
        ...prev,
        dueDate: dueDate,
      }
    })
  }, [dueDate])

  return (
    <div>
      <input
        type="datetime-local"
        className="border-1 border-stroke-weak rounded py-1 px-2 hover:bg-fill-weak cursor-pointer transition-colors w-full outline-text-weakest focus:outline-1"
        value={dueDate}
        min={new Date().toLocaleDateString('en-CA') + 'T00:00'}
        onChange={(e) => setDueDate(e.target.value)}
      ></input>
    </div>
  )
}
