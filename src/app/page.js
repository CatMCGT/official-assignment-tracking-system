"use client";

import { useActionState, useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { ArrowRightIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import Form from "next/form";

import { signIn } from "@/lib/auth";
import { getCurrentUser, setCurrentUser } from "@/lib/userManagement";

export default function Page() {
  const [signInState, signInAction, isPending] = useActionState(signIn, null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if user is already signed in
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        redirect("/home");
      }
      setIsLoading(false);
    });
  }, []);

  // Handle successful sign in
  useEffect(() => {
    if (signInState?.success) {
      setCurrentUser(signInState.userData).then(() => redirect("/home"));
    }
  }, [signInState]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Form
        action={signInAction}
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
                disabled={isLoading}
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
                disabled={isLoading}
              ></input>
            </div>
          </div>

          <p className="text-sm text-text-weaker hover:text-text-weak hover:underline cursor-pointer">
            Forgot password?
          </p>

          {signInState?.message && (
            <p
              className={`font-bold text-sm mt-0 ${
                signInState?.success ? "text-green-400" : "text-red-400"
              }`}
            >
              {signInState.message}
            </p>
          )}

          {(isLoading || isPending) && (
            <p className="text-gray-400 font-bold text-sm mt-0">
              Signing in...
            </p>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isPending ? (
            <ArrowPathIcon className="size-6 fill-text-weaker" />
          ) : (
            <ArrowRightIcon className="size-6" />
          )}
        </button>
      </Form>

      <p className="absolute bottom-30 text-text-weakest">
        Made with ♥︎ by CatMCGT
      </p>
    </div>
  );
}
