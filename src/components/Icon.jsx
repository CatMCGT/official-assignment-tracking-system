import clsx from 'clsx'

export default function Icon({ children, tooltip, border, className }) {
  return (
    <div className="relative">
      <div
        className={clsx(
          `hover:bg-fill-weak border-stroke-weak p-[6px] w-fit rounded flex justify-center items-center cursor-pointer peer transition-colors ${className}`,
          border ? 'border-1' : ''
        )}
      >
        {children}
      </div>

      {tooltip && (
        <div className="rounded border-1 border-stroke-weak px-[5px] bg-white text-center text-sm absolute left-1/2 transform -translate-x-1/2 top-full mt-1 shadow-2xs peer-hover:opacity-100 opacity-0 transition-opacity text-text-strong text-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  )
}
