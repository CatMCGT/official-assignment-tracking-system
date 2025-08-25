import Icon from '@/components/Icon'
import { XMarkIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline'

import formatDate from '@/utils/formatDate'
import { setStatus } from '@/db/assignments/setStatus'

export default function AssignmentModel({
  assignment,
  onClose,
  refreshAssignments,
}) {
  async function handleSetComplete() {
    try {
      await setStatus(assignment.id, 'complete')
      refreshAssignments()
    } catch (err) {
      console.error('Error marking assignment as complete:', err)
    }
  }

  async function handleSetTodo() {
    try {
      await setStatus(assignment.id, 'todo')
      refreshAssignments()
    } catch (err) {
      console.error('Error marking assignment as todo:', err)
    }
  }

  return (
    <div className="border-l-1 border-l-stroke-weak bg-white z-10 absolute right-0 h-screen top-0 px-11 py-15">
      <div className="flex flex-row justify-between items-start gap-2 mb-4">
        <div className="flex flex-col gap-4 w-[560px]">
          <h2 className="font-semibold text-2xl ">{assignment?.title}</h2>
          <div className="flex flex-row gap-3 items-center">
            <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
              {assignment?.subjectInfo?.name}
            </div>

            <div className="px-5 py-[5px] rounded-full bg-fill-weak w-fit flex flex-row gap-1 items-center">
              <ClockIcon className="size-4 text-text-weaker" />
              <p className="text-sm text-text-weak">
                {formatDate(assignment?.due_date)}
              </p>
            </div>
          </div>

          <hr className="text-stroke-weak mt-2 mb-2"></hr>

          <div className="flex flex-row gap-2 items-center">
            <p className="text-text-weak">Actions:</p>
            {assignment?.status === 'todo' ? (
              <button
                type="button"
                className="flex flex-row gap-2 border-1 border-stroke-weak px-3 py-2 rounded-lg text-sm w-fit hover:bg-fill-weak cursor-pointer transition-colors"
                onClick={handleSetComplete}
              >
                Mark as complete
                <CheckIcon className="size-5 text-green-500" />
              </button>
            ) : (
              <button
                type="button"
                className="flex flex-row gap-2 border-1 border-stroke-weak px-3 py-2 rounded-lg text-sm w-fit hover:bg-fill-weak cursor-pointer transition-colors"
                onClick={handleSetTodo}
              >
                Mark as todo
                <ClockIcon className="size-5 text-text-weakest" />
              </button>
            )}
          </div>
        </div>

        <button type="button" onClick={onClose}>
          <Icon tooltip="Close">
            <XMarkIcon className="text-text-weaker size-5" />
          </Icon>
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-2">Description</h3>
      <p className="text-text-weak">{assignment?.description}</p>
    </div>
  )
}
