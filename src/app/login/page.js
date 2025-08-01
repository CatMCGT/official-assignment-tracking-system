'use client'
import { useEffect } from 'react'
import { useActionState } from 'react'
import Form from 'next/form'
import { redirect } from 'next/navigation'
import { ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { logIn } from '@/actions/auth'
import { verifySession, createSession } from '@/actions/userSession'

export default function Page() {
  const [logInState, logInAction, isPending] = useActionState(logIn, {
    success: undefined,
    message: '',
    data: {},
  })

  useEffect(() => {
    verifySession().then((res) => {
      if (res.isAuth) {
        redirect('/assignments')
      }
    })
  }, [])

  useEffect(() => {
    if (logInState?.success) {
      createSession(logInState.data.id).then(() => {
        redirect('/assignments')
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
          </div>

          <div className="flex flex-col gap-3">
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

        <button type="submit" disabled={isPending} className="cursor-pointer flex flex-row gap-1 text-text-weak items-center">
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

      <p className="absolute bottom-30 text-text-weak">
        Made with ♥︎ by CatMCGT
      </p>
    </main>
  )
}
