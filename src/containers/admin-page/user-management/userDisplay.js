"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";

import { getAllUsers, deleteUsers } from "@/db/users";
import { useNotification } from "@/components/notification";
import { useFetchAdminDatabase } from "@/hooks/admin";

function UserDisplay({ userData, userSelect, setUserSelect }) {
  const { allSubjectData } = useFetchAdminDatabase();

  function toggleUserSelection() {
    setUserSelect((prev) => {
      let userIdsVar;
      if (prev.userIds.includes(userData.id)) {
        userIdsVar = prev.userIds.filter((id) => id !== userData.id);
      } else {
        userIdsVar = [...prev.userIds, userData.id];
      }
      return { ...prev, userIds: userIdsVar };
    });
  }

  useEffect(() => {
    if (userSelect.all && !userSelect.userIds.includes(userData.id)) {
      setUserSelect((prev) => {
        return {
          ...prev,
          userIds: [...prev.userIds, userData.id],
        };
      });
    }
  }, [userSelect.all]);

  function getSubjectByTeacherId(teacherId) {
    return allSubjectData.filter((data) => data.teacherId === teacherId);
  }

  return (
    <div className="border-1 border-stroke-weak rounded px-6 py-5 w-full flex flex-row items-center mb-4">
      <input
        type="checkbox"
        className="cursor-pointer mr-4"
        checked={userSelect.userIds.includes(userData.id)}
        onChange={toggleUserSelection}
      ></input>
      <div className="flex flex-col gap-1 flex-1/4">
        <p className="font-bold">{userData.name}</p>
        <p className="text-text-weaker text-sm">#{userData.id}</p>
      </div>

      {userData.role === "teacher" && (
        <div className="flex flex-col gap-1 flex-1/5">
          <p className="text-text-weaker text-sm">Subjects:</p>
          <p className="text-text-weaker text-sm">
            {getSubjectByTeacherId(userData.id)
              .map(
                (subject) =>
                  `${"G" + subject.grade || subject.class} ${
                    subject.subjectName
                  } ${
                    subject.block
                  }`
              )
              .join(", ") || "N/A"}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1 flex-1/4">
        <p className="text-text-weaker text-sm">{userData.role}</p>
        <p className="text-text-weaker text-sm">Created {userData.reg_date}</p>
      </div>
    </div>
  );
}

export default function UserDisplaySection() {
  const { allUserData } = useFetchAdminDatabase();
  const [allUserDataState, setAllUserData] = useState(allUserData);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userSelect, setUserSelect] = useState({ userIds: [], all: false });
  const [filters, setFilters] = useState({ role: "all" });
  const { addNotif, removeNotif, notifs } = useNotification();

  useEffect(() => {
    setAllUserData(allUserData);
  }, [allUserData]);

  async function refreshData() {
    setIsRefreshing(true);

    const { data } = await getAllUsers();
    setAllUserData(JSON.parse(data));

    setIsRefreshing(false);
  }

  async function handleDelete() {
    if (!notifs.some((notif) => notif.type === "confirm-delete")) {
      addNotif(
        "confirm-delete",
        "Delete selected users?",
        JSON.stringify(userSelect.userIds),
        "",
        {
          onConfirm: async () => {
            await deleteUsers(userSelect.userIds);
            removeNotif("confirm-delete");
            setUserSelect((prev) => ({ ...prev, userIds: [] }));
            refreshData();
          },
          confirmIcon: <TrashIcon className="size-5 text-red-500" />,
        }
      );
    }
  }

  const filteredUsers = allUserDataState?.filter(
    (user) => filters.role === "all" || user.role === filters.role
  );

  return (
    <div className="w-full">
      <div className="flex flex-row gap-4 items-center">
        <p className="text-text-weakest">Show:</p>
        <select
          className="flex flex-row gap-1 pl-3 pr-5 py-2 bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] text-text-weak focus:outline-2 focus:outline-stroke-weak w-fit text-center"
          value={filters.role}
          onChange={(e) =>
            setFilters((prev) => {
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
            disabled={isRefreshing}
          >
            <ArrowPathIcon
              className={`size-5 ${isRefreshing && "animate-rotating"}`}
            />
          </button>
          {userSelect.userIds.length > 0 && (
            <button
              className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50"
              onClick={handleDelete}
            >
              <TrashIcon className="size-5 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {isRefreshing ? (
        <p className="mt-3 text-text-weak">Loading...</p>
      ) : (
        <div className="mt-3">
          {filteredUsers?.map((user) => (
            <UserDisplay
              key={user.id}
              userData={user}
              userSelect={userSelect}
              setUserSelect={setUserSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
