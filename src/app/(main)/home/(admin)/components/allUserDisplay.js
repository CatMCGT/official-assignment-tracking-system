"use client";

import { ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { getAllUsers } from "@/lib/adminPortal";

function UserDisplay({ userData }) {
    console.log(userData.reg_date)

  return (
    <div className="border-1 border-stroke-weak rounded px-6 py-5 w-full flex flex-row items-center mb-4">
      <div className="flex flex-col gap-1 flex-1/4">
        <p className="font-bold">{userData.name}</p>
        <p className="text-text-weaker text-sm">#{userData.id}</p>
      </div>
      <div className="flex flex-col gap-1 flex-1/5">
        <p className="text-text-weaker text-sm">Email:</p>
        <p className="text-text-weaker text-sm">{userData.email || "null"}</p>
      </div>
      <div className="flex flex-col gap-1 flex-1/4">
        <p className="text-text-weaker text-sm">{userData.role}</p>
        <p className="text-text-weaker text-sm">Created {userData.reg_date}</p>
      </div>
    </div>
  );
}

export default function AllUserDisplay({ allUserDataServer }) {
  const [allUserData, setAllUserData] = useState(allUserDataServer);

  const allUserEle = allUserData?.map((userData) => (
    <UserDisplay userData={userData} key={userData.id} />
  ));

  async function refreshData() {
    const getAllUsersData = await getAllUsers();
    const allUserDataString = getAllUsersData?.data;
    const allUserData = JSON.parse(allUserDataString);

    setAllUserData(allUserData);
  }

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <p className="text-sm text-text-weakest">Show me</p>
          <div className="flex flex-row gap-1 px-3 py-2 bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] transition-colors">
            <p className="text-text-weak">All Users</p>
            <ChevronDownIcon className="size-6 text-text-weaker" />
          </div>
        </div>

        <button
          className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50"
          onClick={refreshData}
        >
          <ArrowPathIcon className="size-5" />
        </button>
      </div>

      <div className="mt-4">{allUserEle}</div>
    </div>
  );
}
