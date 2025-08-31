import Skeleton from '@/components/Skeleton'
import { Fragment } from 'react'

export default function Loading() {
  return (
    <div className="mt-3">
      <div className="flex flex-col gap-4 w-full max-w-6xl">
        <div className="flex flex-row gap-3 items-center">
          <Skeleton className="w-16 h-6" />

          <Skeleton className="w-32 h-6" />
        </div>
        <Skeleton className="w-2xl h-10" />
        <Skeleton className="w-xl h-8 mt-2 mb-4" />

        <hr className="text-stroke-weak mt-2 mb-5"></hr>
      </div>

      <div>
        <div className="flex flex-row justify-between items-center">
          <Skeleton className="w-80 h-10" />
          <Skeleton className="w-80 h-10" />
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 mt-5">
          {[1,2,3,4,5,6,7,8,9,10].map((x) => (
            <Fragment key={x}>
              <Skeleton className="h-20" />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
