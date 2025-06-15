"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

function CustomSelect({
  options,
  optionsSelect,
  setOptionsSelect,
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
        className="p-2 flex flex-row justify-between items-center hover:bg-gray-50 rounded cursor-pointer"
        onClick={() => toggleOptionsSelect(option.id)}
        key={option.id}
      >
        <div className="flex flex-row gap-2 items-center">
          <p className="">{option.title}</p>
          <p className="text-sm text-text-weaker">{option.subtitle}</p>
        </div>
        {optionsSelect.includes(option.id) && (
          <CheckIcon className="size-4 text-text-weak" />
        )}
      </button>
    );
  });

  return (
    <div className="border-1 border-stroke-weak px-2 py-4 w-60 flex flex-col gap-2 rounded">
      <input
        className="border-b-1 border-b-stroke-weak focus:outline-0 px-2 placeholder:text-text-weakest"
        type="text"
        name="search"
        placeholder="Search..."
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      ></input>
      <div className="flex flex-col">{ele}</div>
      {searchFilter && (
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

export default function Page() {
  const [optionsSelect, setOptionsSelect] = useState([]);

  return (
    <div className="flex justify-center items-center h-full">
      <CustomSelect
        options={[
          { id: "g11-bio1", title: "Biology 1", subtitle: "G11" },
          { id: "g11-bio2", title: "Biology 2", subtitle: "G11" },
        ]}
        optionsSelect={optionsSelect}
        setOptionsSelect={setOptionsSelect}
        createNewText="Create new subject"
      />
    </div>
  );
}
