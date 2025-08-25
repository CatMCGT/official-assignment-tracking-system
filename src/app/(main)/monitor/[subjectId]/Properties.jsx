export default function Properties({ children }) {
  return (
    <div className="grid grid-cols-[200px_auto] grid-rows-3 gap-2 text-nowrap">
      {children}
    </div>
  )
}

function Property({ children, name }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {children}
      <p className="text-text-weak">{name}</p>{' '}
    </div>
  )
}

Properties.Property = Property

function Value({ children }) {
  return <p className="text-lg">{children}</p>
}

Properties.Property.Value = Value
