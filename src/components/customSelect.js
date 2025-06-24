"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function CustomSelect({
  options,
  optionsSelect,
  setOptionsSelect,
  placeholder = "Search...",
  multiSelect = false,
  createNewText,
  onCreateNew,
}) {
  const [searchFilter, setSearchFilter] = useState("");

  function toggleOptionsSelect(optionId) {
    if (optionsSelect.includes(optionId)) {
      setOptionsSelect((prev) => prev.filter((option) => option !== optionId));
    } else {
      setOptionsSelect((prev) => [...prev, optionId]);
    }
  }

  const filteredOptions = options.filter((option) =>
    `${option.title} ${option.subtitle}`
      .toLowerCase()
      .includes(searchFilter.toLowerCase())
  );

  const ele = filteredOptions.map((option) => {
    return (
      <button
        type="button"
        className="p-2 flex flex-row justify-between items-center hover:bg-gray-50 rounded cursor-pointer"
        onClick={() => {
          if (multiSelect) {
            toggleOptionsSelect(option.id);
          } else {
            if (!optionsSelect.includes(option.id))
              setOptionsSelect([option.id]);
          }
        }}
        key={option.id}
      >
        <div className="flex flex-row gap-2 items-center">
          <p className="">{option.title}</p>
          <p className="text-sm text-text-weaker uppercase">
            {option.subtitle}
          </p>
        </div>
        {optionsSelect.includes(option.id) && (
          <CheckIcon className="size-4 text-text-weak" />
        )}
      </button>
    );
  });

  return (
    <div className="border-1 border-stroke-weak px-2 py-4 w-60 flex flex-col gap-2 rounded bg-white">
      <input
        className="border-b-1 border-b-stroke-weak focus:outline-0 px-2 pb-1 placeholder:text-text-weakest"
        type="text"
        name="search"
        placeholder={placeholder}
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      ></input>
      <div className="flex flex-col max-h-52 overflow-y-auto">{ele}</div>
      {createNewText && searchFilter && (
        <p
          className="text-sm text-text-weakest mx-2 hover:underline cursor-pointer"
          onClick={() => onCreateNew(searchFilter)}
        >
          {createNewText + ": "}
          <span className="text-text-weak">{searchFilter}</span>
        </p>
      )}
    </div>
  );
}
