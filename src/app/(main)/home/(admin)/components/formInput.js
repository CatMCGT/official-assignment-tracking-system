export default function FormInput({
  type = "text",
  title,
  placeholder,
  name,
  required = true,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm w-full">{title}</label>
      <input
        className="p-3 bg-fill-weak rounded-xs w-full placeholder:text-text-weaker text-text-weak focus:outline-2 focus:outline-gray-300 disabled:placeholder:text-gray-300 disabled:text-gray-300"
        placeholder={!disabled ? placeholder : "Disabled"}
        name={name}
        required={required}
        type={type}
        disabled={disabled}
      ></input>
    </div>
  );
}
