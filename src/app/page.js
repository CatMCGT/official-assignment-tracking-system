"use client";

import Form from "next/form";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useActionState } from "react";

import { signIn } from "@/lib/auth";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page() {
  const [signInState, signInFunction, signInPending] = useActionState(
    signIn,
    undefined
  );

  useEffect(() => {
    if (signInState?.success) {
      redirect("/home");
    }
  }, [signInState]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Form
        action={signInFunction}
        className="flex flex-col h-80 items-end gap-4 px-4 py-5 relative rounded-md border border-solid border-gray-200"
      >
        <div className="flex w-64 flex-col gap-3 relative">
          <div>
            <p className="text-xs text-gray-500">
              Welcome to Assignment Tracking System...
            </p>
            <p className="font-bold">Sign In With Your Account</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs w-full">Account name</label>
              <input
                className="p-3 bg-gray-100 rounded-xs text-xs w-full placeholder:text-gray-300 text-gray-600"
                placeholder="Account name (e.g. s201401111)"
                name="username"
                required
              ></input>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs w-full">Password</label>
              <input
                type="password"
                name="password"
                className="p-3 bg-gray-100 rounded-xs text-xs w-full placeholder:text-gray-300 text-gray-600"
                placeholder="Password"
                required
              ></input>
            </div>
          </div>

          <p className="text-xs text-gray-500">Forgot password?</p>

          {signInState?.success && (
            <p className="text-green-400 font-bold text-xs mt-0">
              {signInState.message}
            </p>
          )}

          {signInState?.success == false && (
            <p className="text-red-400 font-bold text-xs mt-0">
              {signInState.message}
            </p>
          )}
        </div>

        <button type="submit">
          <ArrowRightIcon className="size-6" />
        </button>
      </Form>
    </div>
  );
}
