"use client";

import Form from "next/form";
import { redirect } from "next/navigation";
import { ArrowRightIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
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
      const response = setCurrentUser(signInState.userData);
      if (response) {
        redirect("/home");
      }
    }
  }, [signInState]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Form
        action={signInFunction}
        className="flex flex-col items-end gap-4 px-5 py-6 relative rounded-md border border-solid border-stroke-weak"
      >
        <div className="flex flex-col gap-3 relative">
          <div>
            <p className="text-sm text-text-weak">
              Welcome to Assignment Tracking System...
            </p>
            <p className="font-bold text-lg">Sign In With Your Account</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm w-full">Account name</label>
              <input
                className="p-3 bg-fill-weak rounded-xs w-full placeholder:text-text-weaker text-text-weak focus:outline-2 focus:outline-gray-300"
                placeholder="Account name"
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
                className="p-3 bg-fill-weak rounded-xs w-full placeholder:text-text-weaker text-text-weak focus:outline-2 focus:outline-gray-300"
                placeholder="Password"
                required
                disabled={currentUserState !== undefined}
              ></input>
            </div>
          </div>

          <p className="text-sm text-text-weaker hover:text-text-weak hover:underline cursor-pointer">Forgot password?</p>

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

          {currentUserState !== undefined || signInPending && (
            <p className="text-gray-400 font-bold text-sm mt-0">
              Signing in...
            </p>
          )}
        </div>

        <button type="submit" disabled={currentUserState !== undefined}>
          {
            !signInPending ? (
              <ArrowRightIcon className="size-6" />
            ) : (
              <ArrowPathIcon className="size-6 fill-text-weaker"/>
            )
          }
          
        </button>
      </Form>

      <p className="absolute bottom-30 text-text-weakest">Made with ♥︎ by CatMCGT</p>
    </div>
  );
}
