import { cn } from '../../lib/cn'

/**
 * Skeleton — shimmer placeholder for loading states.
 *
 * @prop {string}  className  — width, height, and rounding via Tailwind
 * @prop {'none'|'sm'|'md'|'lg'|'full'} rounded
 */
export function Skeleton({ className, rounded = 'md', ...props }) {
  const radiusClass = {
    none: 'rounded-none',
    sm:   'rounded',
    md:   'rounded-md',
    lg:   'rounded-lg',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton', // defined in index.css — shimmer gradient animation
        radiusClass,
        className
      )}
      {...props}
    />
  )
}

/**
 * SkeletonText — multiple skeleton lines for text blocks.
 * @prop {number} lines
 */
export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          rounded="md"
          className={cn(
            'h-3',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

Skeleton.displayName = 'Skeleton'
SkeletonText.displayName = 'SkeletonText'
export default Skeleton
