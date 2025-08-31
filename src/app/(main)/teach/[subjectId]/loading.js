import Skeleton from '@/components/Skeleton'
import MainLayout from '../../layout'
import Properties from '@/components/Properties'
import {
  AcademicCapIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'

export default function Loading() {
  return (
    <div>
      <MainLayout.Header>
        <Skeleton className="w-xl h-10 mb-2" />
      </MainLayout.Header>

      <Properties>
        <Properties.Property name="Teacher">
          <AcademicCapIcon className="size-5 text-text-weak" />
        </Properties.Property>
        <Skeleton className="w-full h-6" />

        <Properties.Property name="Student Monitor">
          <PencilSquareIcon className="size-5 text-text-weak" />
        </Properties.Property>
        <Skeleton className="w-full h-6" />
      </Properties>

      <hr className="text-stroke-weak w-full mt-8 mb-10"></hr>

      <div>
        <div className="flex flex-row gap-3 items-center mb-2">
          <h2 className="font-semibold text-xl">All Students</h2>
          <Skeleton className="w-6 h-6" />
        </div>

        <div className="grid grid-cols-[200px_300px_auto] items-center px-3 py-2 text-sm text-text-weak">
          <p>Name</p>
          <p>ID</p>
          <p>On-time Submission</p>
        </div>
        <Skeleton className="w-2xl h-72" />
      </div>

      <div className='w-2xl mt-4'>
        <div className="flex flex-row gap-3 items-center justify-between mb-3">
          <h2 className="font-semibold text-xl">Assignments</h2>
          <Skeleton className="w-20 h-8" />
        </div>

        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
