import Icon from '@/components/Icon'
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'

import formatDate from '@/utils/formatDate'

export default function AssignmentModel({ assignment, onClose }) {
  return (
    <div className="border-l-1 border-l-stroke-weak bg-white z-10 absolute right-0 h-screen top-0 px-11 py-15">
      <div className="flex flex-row justify-between items-start gap-2 mb-4">
        <div className="flex flex-col gap-4 w-[560px]">
          <h2 className="font-semibold text-2xl ">{assignment?.title}</h2>
          <div className="flex flex-row gap-3 items-center">
            <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
              {assignment?.subjectInfo.name}
            </div>

            <div className="px-5 py-[5px] rounded-full bg-fill-weak w-fit flex flex-row gap-1 items-center">
              <ClockIcon className="size-4 text-text-weaker" />
              <p className="text-sm text-text-weak">
                {formatDate(assignment?.due_date)}
              </p>
            </div>
          </div>
        </div>

        <button type="button" onClick={onClose}>
          <Icon tooltip="Close">
            <XMarkIcon className="text-text-weaker size-5" />
          </Icon>
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-2">Description</h3>
      <p className='text-text-weak'>{assignment?.description}</p>
    </div>
  )
}
