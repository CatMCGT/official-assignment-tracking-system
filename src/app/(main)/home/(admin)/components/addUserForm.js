"use client";

import { useActionState, useState } from "react";
import Form from "next/form";
import { PlusIcon } from "@heroicons/react/24/outline";

import FormInput from "./formInput";
import { createUser } from "@/lib/userManagement";
import CustomSelect from "@/components/customSelect";
import toTitleCase from "@/lib/toTitleCase";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import TeacherSubjectsSelect from "./teacherSubjectsSelect";

export default function AddUserForm() {
  const [useDefaultPW, setUseDefaultPW] = useState(false);
  const [addUserState, addUserAction, isPending] = useActionState(
    createUser,
    null
  );
  const [userRole, setUserRole] = useState(["teacher"]);
  const [openRoleSelect, setOpenRoleSelect] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  return (
    <Form
      action={addUserAction}
      className="border-1 border-stroke-weak px-6 py-5 flex flex-col items-end gap-4 w-fit"
    >
      <h2 className="font-bold w-full text-lg">Add User</h2>
      <div className="flex flex-col gap-3 w-70">
        <div className="relative">
          <div
            className="flex flex-row gap-2 px-4 py-1.5 items-center justify-center bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] text-text-weak focus:outline-2 focus:outline-stroke-weak w-fit"
            onClick={() => setOpenRoleSelect((prev) => !prev)}
          >
            <p>{toTitleCase(userRole[0])}</p>
            <ChevronDownIcon
              className={`size-4 ${openRoleSelect && "rotate-180"}`}
            />
          </div>

          {openRoleSelect && (
            <div className="absolute top-11 left-0 z-10">
              <CustomSelect
                options={[
                  { id: "student", title: "Student", subtitle: "" },
                  { id: "teacher", title: "Teacher", subtitle: "" },
                  { id: "admin", title: "Admin", subtitle: "" },
                ]}
                optionsSelect={userRole}
                setOptionsSelect={setUserRole}
                placeholder="Search role..."
                multiSelect={false}
              />
            </div>
          )}

          <input
            className="hidden"
            name="role"
            defaultValue={userRole[0]}
          ></input>
        </div>

        <FormInput title="ID*" placeholder="ID" name="id" />

        <FormInput title="Name*" placeholder="Name" name="name" />

        <div className="relative mt-1">
          <div className="flex flex-row gap-2 absolute right-0 top-0">
            <span className="text-ms text-text-weaker">Use default</span>
            <input
              type="checkbox"
              className="cursor-pointer"
              onChange={(e) => setUseDefaultPW(e.target.checked)}
              checked={useDefaultPW}
            ></input>
          </div>
          <FormInput
            title="Password*"
            placeholder="Password"
            name="password"
            required={useDefaultPW}
            disabled={useDefaultPW}
          />
        </div>

        <FormInput
          type="email"
          title="Email"
          placeholder="Email"
          name="email"
          required={false}
        />

        {userRole[0] === "teacher" && (
          <TeacherSubjectsSelect
            teacherSubjects={teacherSubjects}
            setTeacherSubjects={setTeacherSubjects}
          />
        )}

        <input
          className="hidden"
          name="subjects"
          defaultValue={teacherSubjects.length > 0 ? teacherSubjects : null}
        ></input>
      </div>

      {addUserState?.message && (
        <p
          className={`font-bold text-sm ${
            addUserState?.success ? "text-green-400" : "text-red-400"
          }`}
        >
          {addUserState.message}
        </p>
      )}

      <button
        type="submit"
        className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50"
        disabled={isPending}
        onClick={() => setUseDefaultPW(false)}
      >
        <PlusIcon className="size-5" />
        {isPending && "Adding..."}
      </button>
    </Form>
  );
}
