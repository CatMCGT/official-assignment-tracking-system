"use client";

import { useActionState, useState } from "react";
import { AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { deleteSession } from "@/actions/userSession";
import { redirect } from "next/navigation";
import { getSecurityQuestion, setSecurityQuestionAns } from "@/actions/auth";
import Select from "../Select";
import { securityQuestions } from "@/utils/securityQuestions";
import Form from "next/form";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function UserDisplaySection({ user }) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState({
    success: null,
    message: null,
    data: { id: null, name: null },
  });
  const [selectedSecurityQuestion, setSelectedSecurityQuestion] = useState("");

  const additionalData = {
    securityQuestionId: selectedSecurityQuestion,
  };
  const [formState, formAction, isPending] = useActionState(
    setSecurityQuestionAns.bind(null, additionalData)
  );

  async function logOut() {
    await deleteSession();
    redirect("/");
  }

  async function changePassword() {
    setShowChangePassword(true);
    const securQ = await getSecurityQuestion();
    console.log(securQ);
    setSecurityQuestion(securQ);
  }

  return (
    <div>
      <button
        type="button"
        className="flex flex-row select-none cursor-pointer nav-item-hover"
        onClick={() => setIsMenuOpened((prev) => !prev)}
      >
        <div className="flex flex-row select-non">
          <AcademicCapIcon className="size-6 fill-text-strong" />
          <p className="font-bold text-text-strong mr-1 ml-3">{user?.name}</p>
          <ChevronDownIcon className="size-6 fill-text-weaker" />
        </div>
      </button>

      {isMenuOpened && (
        <div className="w-72 bg-background-weak border-2 border-stroke-weaker absolute top-13 left-4 py-3 px-4 flex flex-col gap-3 select-none rounded">
          <div className="flex flex-row justify-between align-top">
            <div className="flex flex-col gap-1">
              <p className="font-bold">{user?.name}</p>
              <p className="text-sm text-text-weaker">#{user?.id}</p>
            </div>
            <div className="bg-[#F0F0F0] px-4 py-1 mt-1 rounded-full text-text-weaker uppercase text-xs w-fit h-fit">
              {user?.role}
            </div>
          </div>

          <hr className="mx-[-16px] border-stroke-weak"></hr>

          <div className="flex flex-col gap-2">
            <p
              className="text-ms text-text-weaker hover:text-text-weak nav-item-hover"
              onClick={logOut}
            >
              Log out
            </p>

            <p
              className="text-ms text-text-weaker hover:text-red-500 nav-item-hover"
              onClick={changePassword}
            >
              Change password
            </p>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="fixed w-full h-full px-40 top-0 left-0 flex flex-row justify-center items-center">
          <div className="px-6 py-6 border-1 border-stroke-weak rounded w-full max-w-[1000px] h-[700px] bg-white shadow-lg">
            <h2 className="text-lg font-bold mb-2">Change password</h2>
            <p className="">
              Users can change their passwords by answering a security password
              they have set up.
            </p>
            {securityQuestion?.success ? (
              <p>Your security question: {securityQuestion?.data.name}</p>
            ) : (
              <Form className="mt-3 w-130" action={formAction}>
                <label className="font-bold mb-2">Security Question</label>
                <Select
                  options={securityQuestions}
                  selected={selectedSecurityQuestion}
                  setSelected={setSelectedSecurityQuestion}
                />

                <label htmlFor="securityAns" className="font-bold mt-3 mb-2">
                  Your answer
                </label>
                <p className="text-sm">Please keep your answer confidential.</p>
                <input
                  type="text"
                  className="p-3 border-1 border-stroke-weak rounded-xs w-full placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-gray-300"
                  placeholder="Security Question Answer"
                  id="securityAns"
                  name="securityAns"
                  required
                />

                <button
                  type="submit"
                  className="px-4 py-[4px] mt-3 text-white bg-text-weak rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <ArrowPathIcon className="size-6 text-white" />
                  ) : (
                    "Save"
                  )}
                </button>
              </Form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
