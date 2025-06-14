"use client";

import { useActionState, useState } from "react";
import Form from "next/form";
import { PlusIcon } from "@heroicons/react/24/outline";

import FormInput from "./formInput";
import { createUser } from "@/lib/adminPortal";

export default function AddUserForm() {
  const [useDefaultPW, setUseDefaultPW] = useState(false);
  const [addUserState, addUserAction, isPending] = useActionState(
    createUser,
    null
  );

  return (
    <Form
      action={addUserAction}
      className="border-1 border-stroke-weak px-6 py-5 flex flex-col items-end gap-4 w-fit"
    >
      <h2 className="font-bold w-full text-lg">Add User</h2>
      <div className="flex flex-col gap-3 w-70">
        <select
          className="flex flex-row gap-1 pl-3 pr-5 py-1.5 bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] text-text-weak focus:outline-2 focus:outline-stroke-weak w-fit"
          name="role"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

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
            required={!useDefaultPW}
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
