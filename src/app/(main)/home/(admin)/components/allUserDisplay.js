"use client";

import {
  ArrowPathIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { getAllUsers, deleteUsers } from "@/lib/adminPortal";
import { useNotification } from "@/components/notification";

function UserDisplay({ userData, userSelect, setUserSelect }) {
  function removeUserIdFromUserSelect() {
    setUserSelect((prev) => {
      const newArray = [...prev.userIds];
      newArray.splice(newArray.indexOf(userData.id), 1);
      return { ...prev, userIds: newArray };
    });
  }

  function addUserIdToUserSelect() {
    setUserSelect((prev) => {
      const newArray = [...prev.userIds];
      newArray.push(userData.id);
      return { ...prev, userIds: newArray };
    });
  }

  useEffect(() => {
    if (userSelect.all && !userSelect.userIds.includes(userData.id)) {
      addUserIdToUserSelect();
    }
  }, [userSelect.all]);

  return (
    <div className="border-1 border-stroke-weak rounded px-6 py-5 w-full flex flex-row items-center mb-4">
      <input
        type="checkbox"
        className="cursor-pointer mr-4"
        name="user-select"
        value={userData.id}
        checked={userSelect.userIds.includes(userData.id)}
        onChange={() => {
          if (userSelect.userIds.includes(userData.id)) {
            removeUserIdFromUserSelect();
          } else {
            addUserIdToUserSelect();
          }
        }}
      ></input>
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
  const [refreshLoadingState, setRefreshLoadingState] = useState(false);
  const [userSelect, setUserSelect] = useState({ userIds: [], all: false });
  const [filter, setFilter] = useState({ role: "all" });
  const { addNotif } = useNotification();

  const allUserEle = allUserData
    ?.filter((userData) => {
      if (filter.role === "all") {
        return true;
      }
      return userData.role === filter.role;
    })
    .map((userData) => (
      <UserDisplay
        userData={userData}
        key={userData.id}
        userSelect={userSelect}
        setUserSelect={setUserSelect}
      />
    ));

  async function refreshData() {
    setRefreshLoadingState(true);
    const getAllUsersData = await getAllUsers();
    const allUserDataString = getAllUsersData?.data;
    const allUserData = JSON.parse(allUserDataString);

    setAllUserData(allUserData);
    setRefreshLoadingState(false);
  }

  async function deleteUsers() {
    addNotif("Confirm delete?", "Click the buttons to confirm.")
    // const response = await deleteUsers(userSelect.userIds);
  }

  return (
    <div className="w-full">
      <div className="flex flex-row gap-4 items-center">
        <p className="text-text-weakest">Show me</p>
        <select
          className="flex flex-row gap-1 pl-3 pr-5 py-2 bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] text-text-weak focus:outline-2 focus:outline-stroke-weak w-fit text-center"
          name="show users"
          value={filter.role}
          onChange={(e) =>
            setFilter((prev) => {
              return { ...prev, role: e.target.value };
            })
          }
        >
          <option value="all">All Users</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex flex-row gap-2">
          <p className="text-text-weaker">Select all</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            name="user-select"
            value="all"
            checked={userSelect.all}
            onChange={() => {
              setUserSelect((prev) => {
                if (!userSelect.all) {
                  return { ...prev, all: true };
                } else {
                  return { userIds: [], all: false };
                }
              });
            }}
          ></input>
        </div>
        <div className="flex flex-row gap-2 relative">
          <button
            className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50"
            onClick={refreshData}
          >
            <ArrowPathIcon
              className={`size-5 ${refreshLoadingState && "animate-rotating"}`}
            />
          </button>
          <button
            className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50"
            onClick={() => {
              deleteUsers();
            }}
          >
            <TrashIcon className={`size-5 text-red-500`} />
          </button>
        </div>
      </div>

      {refreshLoadingState ? (
        <p className="mt-3 text-text-weak">Loading...</p>
      ) : (
        <div className="mt-3">{allUserEle}</div>
      )}
    </div>
  );
}
