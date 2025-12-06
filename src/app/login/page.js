'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import Form from 'next/form'
import { redirect } from 'next/navigation'
import {
  ArrowPathIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { logIn } from '@/actions/auth'
import { verifySession, createSession } from '@/actions/userSession'
import { getSecurityQuestion } from '@/db/users/securityQuestion'
import Icon from '@/components/Icon'
import ChangePassword from '@/components/nav/ChangePassword'

export default function Page() {
  const [logInState, logInAction, isPending] = useActionState(logIn, {
    success: undefined,
    message: '',
    data: {},
  })

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [securityQuestion, setSecurityQuestion] = useState({
    success: null,
    message: null,
    data: { id: null, name: null },
  })
  const [userId, setUserId] = useState(null)

  async function changePasswordFetch(formData) {
    const userId = formData.get('userId')
    setUserId(userId)

    const securQ = await getSecurityQuestion(userId)
    if (securQ.success) {
      setShowChangePassword(true)
      setShowForgotPassword(false)
    }
    setSecurityQuestion(securQ)
  }

  useEffect(() => {
    verifySession().then((res) => {
      if (res.isAuth) {
        redirect('/')
      }
    })
  }, [])

  useEffect(() => {
    if (logInState?.success) {
      createSession(logInState.data.id).then(() => {
        redirect('/')
      })
    }
  }, [logInState])

  return (
    <main className="h-full flex flex-col justify-center items-center">
      <Form
        action={logInAction}
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
              <label className="text-sm w-full" htmlFor="userId">
                User ID
              </label>
              <input
                type="text"
                className="p-3 bg-fill-weak rounded-xs w-full placeholder:text-text-weaker text-text-weak focus:outline-2 focus:outline-gray-300"
                placeholder="User ID"
                id="userId"
                name="userId"
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm w-full" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="p-3 bg-fill-weak rounded-xs w-full placeholder:text-text-weaker text-text-weak focus:outline-2 focus:outline-gray-300"
                placeholder="Password"
                id="password"
                name="password"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type="button"
            className="text-sm underline cursor-pointer text-text-weaker tracking-wide w-fit"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot password?
          </button>

          {logInState?.message && (
            <p
              className={clsx(
                'font-bold text-sm mt-0' && true,
                logInState?.success ? 'text-green-400' : 'text-red-400'
              )}
            >
              {logInState.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer flex flex-row gap-1 text-text-weak items-center"
        >
          {isPending ? (
            <>
              <p>Pending...</p>
              <ArrowPathIcon className="size-6 fill-text-weaker" />
            </>
          ) : (
            <>
              <p>Continue</p>
              <ArrowRightIcon className="size-6" />
            </>
          )}
        </button>
      </Form>

      {showForgotPassword && (
        <div className="fixed w-full h-full px-40 top-0 left-0 flex flex-row justify-center items-center">
          <div className="relative px-14 py-16 border-1 border-stroke-weak rounded w-full max-w-[1000px] h-[700px] bg-white shadow-lg">
            <div className="w-full flex flex-row justify-between items-center">
              <h2 className="text-xl font-bold mb-2">Forgot password</h2>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false)
                  setSecurityQuestion({
                    success: null,
                    message: null,
                    data: { id: null, name: null },
                  })
                }}
              >
                <Icon tooltip="Close">
                  <XMarkIcon className="size-4" />
                </Icon>
              </button>
            </div>
            <p className="">
              Users can change their passwords by answering a security question
              they have set up.
            </p>

            <Form className="mt-3 w-64" action={changePasswordFetch}>
              <label className="font-bold">User Id</label>
              <input
                type="text"
                className="p-3 border-1 border-stroke-weak rounded-xs w-full placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-gray-300"
                placeholder="User Id"
                id="userId"
                name="userId"
                required
              />

              {securityQuestion?.message && (
                <p
                  className={clsx(
                    'font-bold text-sm mt-0' && true,
                    securityQuestion?.success
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {securityQuestion.message}
                </p>
              )}

              <button
                type="submit"
                className="px-4 py-[4px] mt-4 text-white bg-text-weak rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit"
              >
                {false ? (
                  <ArrowPathIcon className="size-6 text-white" />
                ) : (
                  'Proceed'
                )}
              </button>
            </Form>
            <img
              src="undraw_forgot-password_nttj.svg"
              className="absolute bottom-10 right-10 w-100 opacity-25"
            />
          </div>
        </div>
      )}

      {showChangePassword && securityQuestion.success !== null && (
        <ChangePassword
          changePasswordFetch={changePasswordFetch}
          securityQuestion={securityQuestion}
          setShowChangePassword={setShowChangePassword}
          userId={userId}
        />
      )}

      <p className="absolute bottom-30 text-text-weak">
        Made with ♥︎ by CatMCGT
      </p>
    </main>
  )
}
