"use client";

import { CheckIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function Select({
  options,
  selected,
  setSelected,
  placeholder = "No options selected",
  showId = false,
  allowSearch = false,
  multiSelect = false,
}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="relative">
      <div
        className="border-1 border-stroke-weak rounded p-2 cursor-pointer transition-colors w-full text-left"
        tabIndex="0"
        onClick={() => setIsMenuOpened((prev) => !prev)}
      >
        {selected?.length === 0 ? (
          placeholder
        ) : multiSelect ? (
          <div className="flex flex-row flex-wrap gap-2">
            {options
              .filter((option) => selected.includes(option.id))
              .map((option) => (
                <div
                  key={option.id}
                  className="py-1 px-2 rounded bg-fill-weak w-fit flex flex-row gap-2 items-center"
                >
                  <p>{option.name}</p>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected((prev) =>
                        prev.filter((id) => id !== option.id)
                      );
                    }}
                  >
                    <XCircleIcon className="size-4 text-text-weaker"></XCircleIcon>
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p>
            {options?.filter((option) => selected?.includes(option.id))[0]
              ?.name || placeholder}
          </p>
        )}
      </div>

      {isMenuOpened && (
        <div className="border-1 border-stroke-weak bg-white py-2 px-2 rounded absolute left-0 top-12 z-10 w-full">
          {allowSearch && (
            <input
              type="text"
              placeholder="Search..."
              className="border-b-1 border-text-weakest w-56 mx-2 mb-2 outline-0 p-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            ></input>
          )}
          <div className="max-h-32 overflow-scroll flex flex-col gap-1 overflow-x-hidden overflow-y-auto">
            {options
              ?.filter(
                (option) =>
                  option.name.toLowerCase().includes(search.toLowerCase()) ||
                  option.id.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="flex flex-row gap-2 justify-between items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors w-full"
                  onClick={() => {
                    if (multiSelect) {
                      setSelected((prev) => {
                        if (prev.includes(option.id)) {
                          return prev.filter((id) => id !== option.id);
                        } else {
                          return [...prev, option.id];
                        }
                      });
                    } else {
                      if (selected === option.id) {
                        setSelected(null);
                      } else {
                        setSelected(option.id);
                      }
                    }
                  }}
                >
                  <div className="flex flex-row gap-2 items-end">
                    <p className="text-left">{option.name}</p>
                    {showId && (
                      <p className="text-sm text-text-weak">{option.id}</p>
                    )}
                  </div>
                  {selected?.includes(option.id) && (
                    <CheckIcon className="size-4 text-text-weak" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
