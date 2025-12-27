"use client";

import { useActionState, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  compareSecurityAns,
  setSecurityQuestionAns,
} from "@/db/users/securityQuestion";
import Select from "../Select";
import { securityQuestions } from "@/utils/securityQuestions";
import Form from "next/form";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Icon from "../Icon";
import clsx from "clsx";
import { changePassword } from "@/db/users/changePassword";

export default function ChangePassword({
  changePasswordFetch,
  securityQuestion,
  setShowChangePassword,
  userId = null,
}) {
  const [selectedSecurityQuestion, setSelectedSecurityQuestion] = useState("");

  const additionalData = {
    securityQuestionId: selectedSecurityQuestion,
    userId: userId,
  };
  const [setSecurityState, setSecurityAction, isPendingSet] = useActionState(
    setSecurityQuestionAns.bind(null, additionalData),
    {
      success: null,
      message: "",
    }
  );

  const [compareSecurityState, compareSecurityAction, isPendingCompare] =
    useActionState(compareSecurityAns.bind(null, { userId: userId }), {
      success: null,
      message: "",
    });

  const [changePasswordState, changePasswordAction, isPendingChange] =
    useActionState(changePassword.bind(null, { userId: userId }), {
      success: null,
      message: "",
    });

  useEffect(() => {
    if (setSecurityState.success) {
      changePasswordFetch();
    }
  }, [setSecurityState?.success]);

  useEffect(() => {
    if (changePasswordState.success) {
      setTimeout(() => {
        setShowChangePassword(false);
      }, 2000);
    }
  }, [changePasswordState?.success]);

  return (
    <div className="fixed w-full h-full md:px-40 top-0 left-0 flex flex-row justify-center items-center">
      <div className="relative px-14 py-16 border-1 border-stroke-weak rounded w-full h-full max-w-[1000px] max-h-[700px] bg-white shadow-lg">
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold mb-2">Change password</h2>
          <button type="button" onClick={() => setShowChangePassword(false)}>
            <Icon tooltip="Close">
              <XMarkIcon className="size-4" />
            </Icon>
          </button>
        </div>
        <p className="">
          Users can change their passwords by answering a security question they
          have set up.
        </p>
        {securityQuestion?.success ? (
          compareSecurityState?.success ? (
            <Form action={changePasswordAction}>
              <div className="mt-3 w-64">
                <label className="font-bold">New Password</label>
                <input
                  type="password"
                  className="p-3 border-1 border-stroke-weak rounded-xs w-full placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-gray-300"
                  placeholder="New password"
                  id="newPassword"
                  name="newPassword"
                  required
                />
              </div>

              <div className="mt-3 w-64">
                <label className="font-bold">Confirm New Password</label>
                <input
                  type="password"
                  className="p-3 border-1 border-stroke-weak rounded-xs w-full placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-gray-300"
                  placeholder="Confirm new password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                />
              </div>

              {changePasswordState?.message && (
                <p
                  className={clsx(
                    "font-bold text-sm mt-0" && true,
                    changePasswordState?.success
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  {changePasswordState.message}
                </p>
              )}

              <button
                type="submit"
                className="px-4 py-[4px] mt-4 text-white bg-text-weak rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit"
                disabled={isPendingChange}
              >
                {isPendingChange ? (
                  <ArrowPathIcon className="size-6 text-white" />
                ) : (
                  "Save"
                )}
              </button>
            </Form>
          ) : (
            <Form action={compareSecurityAction}>
              <div className="mt-3">
                <label className="font-bold">
                  {securityQuestion?.data.name}
                </label>
                <input
                  type="password"
                  className="p-3 border-1 border-stroke-weak rounded-xs w-full placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-gray-300"
                  placeholder="Security Question Answer"
                  id="securityAns"
                  name="securityAns"
                  required
                />
              </div>

              {compareSecurityState?.message && (
                <p
                  className={clsx(
                    "font-bold text-sm mt-0" && true,
                    compareSecurityState?.success
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  {compareSecurityState.message}
                </p>
              )}

              <button
                type="submit"
                className="px-4 py-[4px] mt-4 text-white bg-text-weak rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit"
                disabled={isPendingCompare}
              >
                {isPendingCompare ? (
                  <ArrowPathIcon className="size-6 text-white" />
                ) : (
                  "Proceed"
                )}
              </button>
            </Form>
          )
        ) : (
          <Form className="mt-3 w-130" action={setSecurityAction}>
            <div className="mt-3">
              <label className="font-bold mb-2">Security Question</label>
              <Select
                options={securityQuestions}
                selected={selectedSecurityQuestion}
                setSelected={setSelectedSecurityQuestion}
              />
            </div>

            <div className="mt-3">
              <label htmlFor="securityAns" className="font-bold mb-2">
                Your answer
              </label>
              <p className="text-sm">Please keep your answer confidential.</p>
              <input
                type="password"
                className="p-3 border-1 border-stroke-weak rounded-xs w-full placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-gray-300"
                placeholder="Security Question Answer"
                id="securityAns"
                name="securityAns"
                required
                minLength="5"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-[4px] mt-4 text-white bg-text-weak rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit"
              disabled={
                isPendingSet ||
                selectedSecurityQuestion === "" ||
                selectedSecurityQuestion === null
              }
            >
              {isPendingSet ? (
                <ArrowPathIcon className="size-6 text-white" />
              ) : (
                "Save"
              )}
            </button>

            {setSecurityState?.message && (
              <p
                className={clsx(
                  "font-bold text-sm mt-0" && true,
                  setSecurityState?.success ? "text-green-400" : "text-red-400"
                )}
              >
                {setSecurityState.message}
              </p>
            )}
          </Form>
        )}
        <img
          src="undraw_forgot-password_nttj.svg"
          alt=""
          className="absolute bottom-10 right-10 w-100 opacity-25"
        />
      </div>
    </div>
  );
}
