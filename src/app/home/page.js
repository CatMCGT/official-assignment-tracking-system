"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

import { deleteCurrentUser, getCurrentUser } from "@/lib/userManagement";

export default function Page() {
  const [currentUserState, setCurrentUserState] = useState(undefined);

  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser !== undefined) {
        setCurrentUserState(currentUser);
      }
    };

    fetchCurrentUser();
  }, []);

  function hidePopUps() {
    if (menuOpened) setMenuOpened(false);
  }

  function signOut() {
    setCurrentUserState(undefined);
    deleteCurrentUser();
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="h-full" onClick={hidePopUps}>
        <nav className="bg-background-weak flex flex-col gap-7 px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weaker">
          <div
            className="flex flex-row hover:bg-fill-weak hover:mx-[-8px] hover:px-2 hover:my-[-6px] hover:py-[6px] ounded select-none"
            onClick={() => {
              setMenuOpened((prev) => {
                return !prev;
              });
            }}
          >
            <AcademicCapIcon className="size-6 fill-text-strong" />
            <p className="font-bold text-text-strong mr-1 ml-3">
              {currentUserState?.name}
            </p>
            <ChevronDownIcon className="size-6 fill-text-weaker" />
          </div>
        </nav>
      </div>

      {menuOpened && (
        <div className="w-72 bg-background-weak border-2 border-stroke-weaker absolute top-13 left-4 py-3 px-4 flex flex-col gap-3 select-none">
          <div className="flex flex-row justify-between align-top">
            <div className="flex flex-col gap-1">
              <p className="font-bold">{currentUserState?.name}</p>
              <p className="text-sm text-text-weaker">
                #{currentUserState?.id}
              </p>
            </div>
            <div className="bg-[#F0F0F0] px-4 py-1 mt-1 rounded-full text-text-weaker uppercase text-xs w-fit h-fit">
              {currentUserState?.role}
            </div>
          </div>

          <hr className="mx-[-16px] border-stroke-weak"></hr>

          <div>
            <p
              className="text-ms text-text-weaker hover:text-text-weak hover:bg-fill-weak hover:mx-[-8px] hover:px-2 hover:my-[-6px] hover:py-[6px] rounded"
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
