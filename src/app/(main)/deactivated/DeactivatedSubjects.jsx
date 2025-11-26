import formatDate from '@/utils/formatDate'
import getSubjectInfo from '@/utils/getSubjectInfo'
import Link from 'next/link'

export default function DeactivatedSubjects({
  deactivatedSubjects,
  action
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1200px]">
      {deactivatedSubjects.map((subject) => {
        const subjectInfo = getSubjectInfo(subject.id)

        return (
          <Link
            href={`/${action}/${subject.id}`}
            key={subject.id}
            className="border-1 rounded border-stroke-weak px-4 py-4 w-fit"
          >
            <div className="flex flex-row gap-4 items-center">
              <h2 className="text-lg font-bold">{subjectInfo.name}</h2>
              <div className="px-3 py-2 rounded-full bg-fill-weak w-fit flex justify-center items-center text-xs text-text-weak tracking-wide">
                #{subject.id}
              </div>
            </div>

            <div>
              <p className="text-text-weak">
                Deactivated on {formatDate(new Date(subject.deactivated_date))}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
