'use client'

import { getAllSubjects } from '@/db/subjects/getAllSubjects'
import { getAllUsers } from '@/db/users/getAllUsers'
import { createContext, useEffect, useState } from 'react'

export const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [allUsers, setAllUsers] = useState(null)
  const [allSubjects, setAllSubjects] = useState(null)

  useEffect(() => {
    async function fetchDatabase() {
      const res1 = await getAllUsers()
      setAllUsers(res1)

      const res2 = await getAllSubjects()
      setAllSubjects(res2)
    }

    fetchDatabase()
  }, [])

  return (
    <AdminContext.Provider value={{ allUsers, allSubjects }}>
      {children}
    </AdminContext.Provider>
  )
}
