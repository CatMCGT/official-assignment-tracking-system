'use client'

import { useState } from 'react'
import { AcademicCapIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { deleteSession } from '@/actions/userSession'
import { redirect } from 'next/dist/server/api-utils'

export default function UserDisplaySection({ user }) {
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  async function logOut() {
    redirect("/")
    await deleteSession();
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

          <div>
            <p className="text-ms text-text-weaker hover:text-text-weak nav-item-hover" onClick={logOut}>
              Log out
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
