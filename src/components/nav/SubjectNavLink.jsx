'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

import { BookmarkIcon } from '@heroicons/react/20/solid'
import getSubjectInfo from '@/utils/getSubjectInfo'

export default function SubjectNavLink({ subject, action }) {
  if (!action in ['monitor', 'teacher']) return

  const pathname = usePathname()
  const subjectInfo = getSubjectInfo(subject.id)
  const subjectPathname = `/${action}/${subject.id}`

  return (
    <Link
      href={subjectPathname}
      className={clsx('nav-tab', pathname === subjectPathname ? 'active' : '')}
    >
      <BookmarkIcon
        className="size-6 text-text-weaker"
        style={{ color: subjectInfo.color }}
      />
      <p
        className={clsx(
          'font-bold mr-1 ml-3',
          pathname === subjectPathname ? 'text-text-strong' : 'text-text-weaker'
        )}
      >
        {subjectInfo.grade && `G${subjectInfo.grade}`}{' '}
        {subjectInfo.block && `(block ${subjectInfo.block})`}
        {subjectInfo.class && subjectInfo.class.toUpperCase()}
        {' | '}
        {subjectInfo.name}
      </p>
    </Link>
  )
}
