import { Skeleton } from '../ui/Skeleton'

export function PageSkeleton() {
  return (
    <div className="flex flex-col h-full w-full p-6 gap-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-96 h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-24 h-9" />
          <Skeleton className="w-32 h-9" />
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        <Skeleton className="col-span-1 h-32 rounded-xl" />
        <Skeleton className="col-span-1 h-32 rounded-xl" />
        <Skeleton className="col-span-1 h-32 rounded-xl" />
        <Skeleton className="col-span-1 h-32 rounded-xl" />
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
        <Skeleton className="col-span-2 h-[400px] rounded-xl" />
        <Skeleton className="col-span-1 h-[400px] rounded-xl" />
      </div>
    </div>
  )
}
