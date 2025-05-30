"use client";

import Form from "next/form";
import { redirect } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useActionState, useEffect, useState } from "react";

import { signIn } from "@/lib/auth";
import { getCurrentUser, setCurrentUser } from "@/lib/userManagement";

export default function Page() {
  const [signInState, signInFunction, signInPending] = useActionState(
    signIn,
    undefined
  );
  const [currentUserState, setCurrentUserState] = useState(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser !== undefined) {
        setCurrentUserState(currentUser);
        redirect("/home");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (signInState?.success) {
      const response = setCurrentUser(signInState.username, signInState.role);
      if (response) {
        redirect("/home");
      }
    }
  }, [signInState]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Form
        action={signInFunction}
        className="flex flex-col items-end gap-4 px-5 py-6 relative rounded-md border border-solid border-gray-200"
      >
        <div className="flex flex-col gap-3 relative">
          <div>
            <p className="text-sm text-gray-500">
              Welcome to Assignment Tracking System...
            </p>
            <p className="font-bold text-lg">Sign In With Your Account</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm w-full">Account name</label>
              <input
                className="p-3 bg-gray-100 rounded-xs text-sm w-full placeholder:text-gray-300 text-gray-600"
                placeholder="Account name (e.g. s201401111)"
                name="username"
                required
                disabled={currentUserState !== undefined}
              ></input>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm w-full">Password</label>
              <input
                type="password"
                name="password"
                className="p-3 bg-gray-100 rounded-xs text-sm w-full placeholder:text-gray-300 text-gray-600"
                placeholder="Password"
                required
                disabled={currentUserState !== undefined}
              ></input>
            </div>
          </div>

          <p className="text-sm text-gray-500">Forgot password?</p>

          {signInState?.success && (
            <p className="text-green-400 font-bold text-sm mt-0">
              {signInState.message}
            </p>
          )}

          {signInState?.success == false && (
            <p className="text-red-400 font-bold text-sm mt-0">
              {signInState.message}
            </p>
          )}

          {currentUserState !== undefined && (
            <p className="text-gray-400 font-bold text-sm mt-0">
              Signing in...
            </p>
          )}
        </div>

        <button type="submit" disabled={currentUserState !== undefined}>
          <ArrowRightIcon className="size-6" />
        </button>
      </Form>
    </div>
  );
}
