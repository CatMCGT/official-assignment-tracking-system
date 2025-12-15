import formatDate from "@/utils/formatDate";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function AssignmentItem({ a, setAssignmentModel }) {
  return (
    <button
      className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors"
      onClick={() =>
        setAssignmentModel({
          isOpened: true,
          assignmentId: a.assignment_id,
        })
      }
    >
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1 mb-2 sm:flex-row sm:gap-3 sm:mb-0">
          <p className="font-bold text-left">{a.assignment_title}</p>
          <div
            className="px-5 py-[5px] rounded-full w-fit h-fit flex justify-center items-center uppercase text-xs font-semibold"
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
  );
}
