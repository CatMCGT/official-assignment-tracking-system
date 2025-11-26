import { Fragment } from 'react'

import { getUser } from '@/db/users/getUser'
import UserDisplaySection from './UserDisplay'
import NavLinks from './NavLinks'
import { getMonitoredSubjects } from '@/db/subjects/getMonitoredSubjects'
import SubjectNavLink from './SubjectNavLink'
import { getTaughtSubjects } from '@/db/subjects/getTaughtSubjects'
import Feedback from './Feedback'
import Link from 'next/link'
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/20/solid'

export default async function Navbar() {
  const user = await getUser()
  const role = user.role
  const taughtSubjects = await getTaughtSubjects()
  const monitoredSubjects = await getMonitoredSubjects()

  const activatedTaughtSubjects = taughtSubjects.filter(
    (s) => s.deactivated_date === null
  )
  const deactivatedTaughtSubjects = taughtSubjects.filter(
    (s) => s.deactivated_date !== null
  )

  const activatedMonitoredSubjects = monitoredSubjects.filter(
    (s) => s.deactivated_date === null
  )
  const deactivatedMonitoredSubjects = monitoredSubjects.filter(
    (s) => s.deactivated_date !== null
  )

  return (
    <div className="h-full fixed z-20">
      <nav className="bg-background-weak flex flex-col justify-between px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weak">
        <div className="flex flex-col gap-5">
          <UserDisplaySection user={user} />

          <NavLinks user={user} />

          {role === 'teacher' && activatedTaughtSubjects.length > 0 && (
            <div>
              <div>
                <p className="text-sm text-text-weak tracking-wide">
                  Taught Subjects
                </p>
                <div className="flex flex-col gap-2 mt-3">
                  {activatedTaughtSubjects.map((subject) => (
                    <Fragment key={subject.id}>
                      <SubjectNavLink subject={subject} action="teach" />
                    </Fragment>
                  ))}
                </div>
              </div>

              {deactivatedTaughtSubjects.length > 0 && (
                <Link
                  href="/deactivated"
                  className="nav-tab mt-10 hover:mt-9"
                >
                  <ArchiveBoxArrowDownIcon className="size-6 text-text-weaker" />
                  <p className="font-bold mr-1 ml-3 text-text-weak">
                    Deactivated Subjects
                  </p>
                </Link>
              )}
            </div>
          )}

          {role === 'student' && activatedMonitoredSubjects.length > 0 && (
            <div>
              <p className="text-sm text-text-weak tracking-wide">
                Monitored Subjects
              </p>
              <div className="flex flex-col gap-2 mt-3">
                {activatedMonitoredSubjects.map((subject) => (
                  <Fragment key={subject.id}>
                    <SubjectNavLink subject={subject} action="monitor" />
                  </Fragment>
                ))}
              </div>

              {deactivatedMonitoredSubjects.length > 0 && (
                <Link
                  href="/deactivated"
                  className="nav-tab mt-10 hover:mt-9"
                >
                  <ArchiveBoxArrowDownIcon className="size-6 text-text-weaker" />
                  <p className="font-bold mr-1 ml-3 text-text-weak">
                    Deactivated Subjects
                  </p>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="">
          <Feedback />
          <p className="text-text-weak">© 2025 Lau Ka Yue</p>
        </div>
      </nav>
    </div>
  )
}
