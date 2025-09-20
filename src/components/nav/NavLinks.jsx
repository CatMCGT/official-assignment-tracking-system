'use client'

import { BookOpenIcon, ChartPieIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function NavLinks({ user }) {
  const pathname = usePathname()

  return (
    <>
      {user?.role === 'student' && (
        <>
          <Link href="/assignments" className={clsx(
                'nav-tab',
                pathname === '/assignments' ? 'active' : ''
              )}>
            <BookOpenIcon className="size-6 text-text-weaker" />
            <p
              className={clsx(
                'font-bold mr-1 ml-3',
                pathname === '/assignments' ? 'text-text-strong' : 'text-text-weaker'
              )}
            >
              Assignments
            </p>
          </Link>
        </>
      )}

      {user?.role === 'teacher' && (
        <>
          <Link href="/dashboard" className={clsx(
                'nav-tab',
                pathname === '/dashboard' ? 'active' : ''
              )}>
            <ChartPieIcon className="size-6 text-text-weaker" />
            <p
              className={clsx(
                'font-bold mr-1 ml-3',
                pathname === '/dashboard' ? 'text-text-strong' : 'text-text-weaker'
              )}
            >
              Dashboard
            </p>
          </Link>
        </>
      )}
    </>
  )
}
