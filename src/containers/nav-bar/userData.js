"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

import { deleteCurrentUser } from "@/actions/userSession";

export default function UserDataSection({ currentUser }) {
  const [openMenu, setOpenMenu] = useState(false);

  function signOut() {
    deleteCurrentUser();
    redirect("/");
  }

  return (
    <div>
      <div
        className="flex flex-row select-none nav-item-hover"
        onClick={() => {
          setOpenMenu((prev) => !prev);
        }}
      >
        <AcademicCapIcon className="size-6 fill-text-strong" />
        <p className="font-bold text-text-strong mr-1 ml-3">
          {currentUser?.name}
        </p>
        <ChevronDownIcon className="size-6 fill-text-weaker" />
      </div>

      {openMenu && (
        <div className="w-72 bg-background-weak border-2 border-stroke-weaker absolute top-13 left-4 py-3 px-4 flex flex-col gap-3 select-none rounded">
          <div className="flex flex-row justify-between align-top">
            <div className="flex flex-col gap-1">
              <p className="font-bold">{currentUser?.name}</p>
              <p className="text-sm text-text-weaker">#{currentUser?.id}</p>
            </div>
            <div className="bg-[#F0F0F0] px-4 py-1 mt-1 rounded-full text-text-weaker uppercase text-xs w-fit h-fit">
              {currentUser?.role}
            </div>
          </div>

          <hr className="mx-[-16px] border-stroke-weak"></hr>

          <div>
            <p
              className="text-ms text-text-weaker hover:text-text-weak nav-item-hover"
              onClick={signOut}
            >
              Log out
            </p>
          </div>
        </div>
      )}
    </div>
  );
}