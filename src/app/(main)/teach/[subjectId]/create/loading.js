import Skeleton from '@/components/Skeleton'
import Properties from '@/components/Properties'
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDateRangeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

export default function Loading() {
  return (
    <div className="flex flex-col gap-10 justify-between items-start">
      <div className="flex flex-col gap-4 w-2xl">
        <div className="flex flex-row gap-3 items-center">
          <Skeleton className="w-16 h-6" />
        </div>
        <Skeleton className="w-full h-10 mb-2" />

        <Properties>
          <Properties.Property name="Due Date">
            <CalendarDateRangeIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Skeleton className="w-full h-8" />

          <Properties.Property name="Teacher">
            <AcademicCapIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Skeleton className="w-full h-8" />

          <Properties.Property name="Student Monitor">
            <PencilSquareIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Skeleton className="w-full h-8" />

          <Properties.Property name="Assigned to">
            <BookOpenIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Skeleton className="w-full h-8" />
        </Properties>

        <hr className="text-stroke-weak mt-2 mb-2 w-3xl"></hr>

        <h3 className="font-semibold text-lg">
          Description <span className="text-text-weaker">(Optional)</span>
        </h3>
        <Skeleton className="w-2xl h-48" />
      </div>

      <Skeleton className="w-24 h-8" />
    </div>
  )
}
