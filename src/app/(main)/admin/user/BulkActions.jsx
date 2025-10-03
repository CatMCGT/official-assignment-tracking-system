"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";
import { XCircleIcon } from "@heroicons/react/20/solid";
import toTitleCase from "@/utils/toTitleCase";

export default function BulkActions({
  selectedUserIds,
  setSelectedUserIds,
  editedUsers,
  setEditedUsers,
  setIsEdited,
  editedUsersDB,
  setEditedUsersDB,
}) {
  const [bulkMenuOpened, setBulkMenuOpened] = useState(null);

  function handleEdited(newUser) {
    setIsEdited(true);
    setEditedUsersDB((prev) => {
      let found = false;
      const newUsers = prev.map((user) => {
        console.log(user.id, newUser.id);
        if (user.id === newUser.id) {
          found = true;
          return newUser;
        }
        return user;
      });

      if (found) {
        return newUsers;
      } else {
        return [...prev, newUser];
      }
    });
  }

  function updateRole(role) {
    let updatedUser = {};
    setEditedUsers((prev) => {
      return prev.map((user) => {
        if (!selectedUserIds.includes(user.id)) return user;

        updatedUser = {
          ...user,
          role: role,
        };

        return {
          ...user,
          role: role,
        };
      });
    });

    handleEdited(updatedUser);
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-1 border-stroke-weak p-0.5 rounded">
        <div className="py-1 px-2 rounded bg-fill-weak w-fit flex flex-row gap-2 items-center">
          <p>{selectedUserIds.length} selected</p>
          <button
            type="button"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUserIds([]);
            }}
          >
            <XCircleIcon className="size-4 text-text-weaker"></XCircleIcon>
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setBulkMenuOpened(bulkMenuOpened === "role" ? null : "role");
          }}
        >
          <Icon border className="flex flex-row gap-1 items-center px-2">
            <UserIcon className="size-5 text-text-weak" />
            <p className="tracking-wide">Set role...</p>
          </Icon>
        </button>

        {bulkMenuOpened === "role" && (
          <div className="border-1 border-stroke-weak bg-white py-2 px-2 rounded absolute left-0 top-12 z-10 w-64">
            <div className="max-h-32 overflow-scroll flex flex-col gap-1 overflow-x-hidden overflow-y-auto">
              {["student", "teacher", "admin"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className="flex flex-row gap-2 justify-between items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateRole(option);
                    setBulkMenuOpened(null);
                  }}
                >
                  <div className="flex flex-row gap-2 items-end">
                    <p>{toTitleCase(option)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            let updatedUser = {};
            setEditedUsers((prev) => {
              return prev.map((user) => {
                if (!selectedUserIds.includes(user.id)) return user;

                updatedUser = {
                  ...user,
                  deactivated_date: new Date(),
                };

                return {
                  ...user,
                  deactivated_date: new Date(),
                };
              });
            });

            handleEdited(updatedUser);
          }}
        >
          <Icon border className="flex flex-row gap-1 items-center px-2">
            <TrashIcon className="size-5 text-red-500" />
            <p className="tracking-wide">Deactivate User(s)</p>
          </Icon>
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            let updatedUser = {};
            setEditedUsers((prev) => {
              return prev.map((user) => {
                if (!selectedUserIds.includes(user.id)) return user;

                updatedUser = {
                  ...user,
                  deactivated_date: null,
                };

                return {
                  ...user,
                  deactivated_date: null,
                };
              });
            });

            handleEdited(updatedUser);
          }}
        >
          <Icon border className="flex flex-row gap-1 items-center px-2">
            <ArrowUpTrayIcon className="size-5 text-green-500" />
            <p className="tracking-wide">Activate User(s)</p>
          </Icon>
        </button>
      </div>
    </div>
  );
}
