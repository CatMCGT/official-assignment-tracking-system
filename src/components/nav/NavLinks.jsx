'use client'
import { BookOpenIcon, UserIcon, ChartPieIcon, ChartBarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function NavLinks({ user }) {
  const pathname = usePathname()

  return (
    <>
      {user?.role === 'student' && (
        <>
          <Link
            href="/assignments"
            className={clsx(
              'nav-tab',
              pathname === '/assignments' ? 'active' : ''
            )}
          >
            <BookOpenIcon className="size-6 text-text-weaker" />
            <p
              className={clsx(
                'font-bold mr-1 ml-3',
                pathname === '/assignments'
                  ? 'text-text-strong'
                  : 'text-text-weaker'
              )}
            >
              Assignments
            </p>
          </Link>
        </>
      )}

      {user?.role === 'admin' && (
        <div className='flex flex-col gap-4'>
          <Link
            href="/admin/user"
            className={clsx(
              'nav-tab',
              pathname === '/admin/user' ? 'active' : ''
            )}
          >
            <UserIcon className="size-6 text-text-weaker" />
            <p
              className={clsx(
                'font-bold mr-1 ml-3',
                pathname === '/admin/user'
                  ? 'text-text-strong'
                  : 'text-text-weaker'
              )}
            >
              User management
            </p>
          </Link>

          <Link
            href="/admin/subject"
            className={clsx(
              'nav-tab',
              pathname === '/admin/subject' ? 'active' : ''
            )}
          >
            <BookOpenIcon className="size-6 text-text-weaker" />
            <p
              className={clsx(
                'font-bold mr-1 ml-3',
                pathname === '/admin/subject'
                  ? 'text-text-strong'
                  : 'text-text-weaker'
              )}
            >
              Subject management
            </p>
          </Link>
        </div>
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
