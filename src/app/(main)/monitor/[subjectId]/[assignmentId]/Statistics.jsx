import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Statistics({ updatedStudents }) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

  const stats = {
    submitted: updatedStudents?.filter(
      (student) => student.collected_date !== null
    ).length,
    late: updatedStudents?.filter((s) => s.status === 'late').length,
  }

  return (
    <div
      className="border-1 border-stroke-weak bg-white py-1.5 px-2 rounded absolute right-[-4px] top-10 w-44 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row items-center justify-between rounded py-1 px-2">
        <div className="flex flex-row gap-1 items-center">
          <CheckIcon className="size-4 text-text-weak" />
          <p className="text-nowrap text-text-weak">Submitted</p>
        </div>
        <p className="text-nowrap">{stats.submitted}</p>
      </div>

      <div className="flex flex-row items-center justify-between rounded py-1 px-2">
        <div className="flex flex-row gap-1 items-center">
          <ExclamationTriangleIcon className="size-4 text-text-weak" />
          <p className="text-nowrap text-text-weak">Late</p>
        </div>
        <p className="text-nowrap">{stats.late}</p>
      </div>

      <hr className='mx-1 text-stroke-weak'></hr>
    </div>
  )
}
