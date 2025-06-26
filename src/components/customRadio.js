"use client";

export default function CustomRadio({
  options, //[{id: "", name: ""}]
  optionSelected, // React state
  setOptionSelected, // React state set function
}) {
  const optionsEle = options.map((option) => {
    return (
      <button
        type="button"
        key={option.id}
        name="optionSelect"
        onClick={() => {
          if (optionSelected !== option.id) {
            setOptionSelected(option.id);
          }
        }}
        className={`px-4 py-[6px] cursor-pointer transition-colors ${
          optionSelected === option.id
            ? "bg-fill-weak text-text-strong"
            : "text-text-weaker"
        }`}
      >
        {option.name}
      </button>
    );
  });
  return (
    <div className="w-full px-2 py-[6px] gap-3 flex flex-row bg-background-weak">
      {optionsEle}
    </div>
  );
}
