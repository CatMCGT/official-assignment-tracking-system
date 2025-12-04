import formatDate from '@/utils/formatDate'
import { ClockIcon } from '@heroicons/react/24/outline'

export default function AssignmentItem({ a, setAssignmentModel }) {
  return (
    <button
      className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors w-full"
      onClick={() =>
        setAssignmentModel({
          isOpened: true,
          assignmentId: a.assignment_id,
        })
      }
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 ">
          <p className="font-bold">{a.assignment_title}</p>
          <div
            className="px-5 py-[5px] rounded-full w-fit flex justify-center items-center uppercase text-xs font-semibold"
            style={{ backgroundColor: a.subjectInfo.color }}
          >
            {a.subjectInfo.name}
          </div>
        </div>
        {a.grade && <p className="text-text-weaker">graded</p>}
      </div>

      <div className="flex flex-row gap-3">
        <div className="flex flex-row gap-1 items-center">
          <ClockIcon className="size-4 text-text-weaker" />
          <p className="text-sm text-text-weak">{formatDate(a.due_date)}</p>
        </div>
      </div>
    </button>
  )
}
