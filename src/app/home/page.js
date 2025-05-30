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
      {currentUserState && (
        <p>
          Hi {currentUserState?.username.value}. You are{" "}
          {currentUserState?.role.value}.
        </p>
      )}

      <button
        onClick={() => {
          setCurrentUserState(undefined);
          deleteCurrentUser();
          redirect("/")
        }}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Sign out
      </button>
    </div>
  );
}
