import { Fragment } from 'react'

import { getUser } from '@/db/users/getUser'
import UserDisplaySection from './UserDisplay'
import NavLinks from './NavLinks'
import { getMonitoredSubjects } from '@/db/subjects/getMonitoredSubjects'
import SubjectNavLink from './SubjectNavLink'

export default async function Navbar() {
  const user = await getUser()
  const monitoredSubjects = await getMonitoredSubjects()

  return (
    <div className="h-full">
      <nav className="bg-background-weak flex flex-col gap-5 px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weak">
        <UserDisplaySection user={user} />

        <NavLinks user={user} />

        {monitoredSubjects.length > 0 && (
          <div>
            <p className="text-sm text-text-weak tracking-wide">
              Monitored Subjects
            </p>
            <div className='flex flex-col gap-2 mt-3'>
              {monitoredSubjects.map((subject) => (
                <Fragment key={subject.subject_id}>
                  <SubjectNavLink subject={subject} />
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
