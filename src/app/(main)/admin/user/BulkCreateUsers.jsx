'use client'

import { useActionState, useEffect, useState } from 'react'
import Papa from 'papaparse'
import bulkCreateUsers from '@/db/users/bulkCreateUser'
import Form from 'next/form'
import clsx from 'clsx'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function BulkCreateUsers() {
  const [usersArr, setUsersCSV] = useState([])
  const [createUsersState, createUsersAction, isPending] = useActionState(
    bulkCreateUsers.bind(null, usersArr),
    [usersArr]
  )

  function handleCSVChange(e) {
    const file = e.target.files[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      complete: (res) => {
        setUsersCSV(res.data)
      },
      error: (err) => {
        console.error(err)
      },
    })
  }

  useEffect(() => {
    if (createUsersState) {
      setUsersCSV([])
    }
  }, [createUsersState])

  return (
    <div>
      <Form
        action={createUsersAction}
        className="border-1 border-stroke-weak rounded p-4"
      >
        <div className="mb-3">
          <h2 className="text-lg font-bold">Create Users by CSV</h2>
          <p className="text-sm tracking-wide w-64 text-justify">
            The first row in the CSV file serves as headers{' '}
            <b>(id, name, password, role)</b>. Passwords are automatically
            hashed on the server side. The delimiter is a comma <b>(,)</b>.
          </p>
        </div>
        <input
          id="csvFileInput"
          type="file"
          name="csvFileInput"
          accept=".csv"
          onChange={handleCSVChange}
          hidden
        />

        {usersArr.length > 0 ? (
          <label
            htmlFor="csvFileInput"
            className="border-1 border-stroke-weak rounded p-4 flex flex-col gap-4 justify-center items-center cursor-pointer text-center"
          >
            <img src="/create_csv_2.svg"></img>
            <p>You've uploaded an item.</p>
            <p></p>
          </label>
        ) : (
          <label
            htmlFor="csvFileInput"
            className="border-1 border-stroke-weak rounded p-4 flex flex-col gap-4 justify-center items-center cursor-pointer text-center"
          >
            <img src="/create_csv_1.svg"></img>
            <p>Upload a csv to bulk-create users</p>
          </label>
        )}

        {createUsersState?.message && (
          <p
            className={clsx(
              'font-bold mt-2',
              createUsersState?.success ? 'text-green-500' : 'text-red-400'
            )}
          >
            {createUsersState.message}
          </p>
        )}

        <button
          className="px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit mt-2 bg-text-weak"
          disabled={usersArr.length === 0 || isPending}
        >
          {isPending ? (
            <ArrowPathIcon className="size-6 text-white" />
          ) : (
            'Create'
          )}
        </button>
      </Form>
    </div>
  )
}
