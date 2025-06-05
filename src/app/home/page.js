"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

import { deleteCurrentUser, getCurrentUser } from "@/lib/userManagement";

export default function Page() {
  const [currentUserState, setCurrentUserState] = useState(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser !== undefined) {
        setCurrentUserState(currentUser);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div>
      <nav className="w-full px-4 py-3 bg-gray-50 border-b-gray-200 border-b-2 flex-row justify-between items-center">
        <div id="right" className="flex-4/5">
          Awesome Homework System!
        </div>
        <div
          id="left"
          onClick={() => {
            setCurrentUserState(undefined);
            deleteCurrentUser();
            redirect("/");
          }}
        >
          Sign out
        </div>
      </nav>

      <main className="flex justify-center items-center">
        <div className="flex flex-row justify-center w-3/5 mt-10 gap-6">
          <div className="border-2 border-gray-200 p-4 rounded flex-1/4">
            {currentUserState ? (
              <div className="flex flex-row gap-3">
                <div className="size-12 bg-gray-200 rounded"></div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold">
                    {currentUserState?.username.value}
                  </p>
                  <div className="py-1 px-3 uppercase bg-gray-100 text-gray-500 tracking-wider text-xs rounded-full w-fit">
                    {currentUserState?.role.value}
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="flex-3/4">
            <p>Helllooo, here is some content!</p>
          </div>
        </div>
      </main>
    </div>
  );

  // return (
  //   <div>
  //     {currentUserState && (
  //       <p>
  //         Hi {currentUserState?.username.value}. You are{" "}
  //         {currentUserState?.role.value}.
  //       </p>
  //     )}

  //     <button
  //       onClick={() => {
  //         setCurrentUserState(undefined);
  //         deleteCurrentUser();
  //         redirect("/")
  //       }}
  //       className="bg-black text-white px-4 py-2 rounded"
  //     >
  //       Sign out
  //     </button>
  //   </div>
  // );
}
