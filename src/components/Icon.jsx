export default function Icon({ children, tooltip }) {
  return (
    <div className="relative">
      <div className="hover:bg-fill-weak border-1 border-stroke-weak p-[6px] w-fit rounded flex justify-center items-center cursor-pointer peer transition-colors">
        {children}
      </div>

      <div className="rounded border-1 border-stroke-weak px-[5px] bg-white text-center text-sm absolute left-1/2 transform -translate-x-1/2 top-full mt-1 shadow-2xs peer-hover:opacity-100 opacity-0 transition-opacity text-text-strong text-nowrap">
        {tooltip}
      </div>
    </div>
  )
}