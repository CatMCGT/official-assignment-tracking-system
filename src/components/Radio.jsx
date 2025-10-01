'use client'

import clsx from "clsx"

export default function Radio({ options, selected, setSelected }) {
  return (
    <div className="w-fit px-2 py-[6px] gap-3 flex flex-row bg-background-weak rounded">
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          onClick={() => {
            if (selected != option.id) {
              setSelected(option.id)
            }
          }}
          className={clsx(
            'px-4 py-[6px] cursor-pointer transition-colors rounded',
            selected === option.id
              ? 'bg-fill-weak text-text-strong'
              : 'text-text-weak'
          )}
        >
          {option.name}
        </button>
      ))}
    </div>
  )
}
