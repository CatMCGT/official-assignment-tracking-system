'use client'

import Form from 'next/form'
import Icon from '../Icon'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useActionState, useState } from 'react'
import { createFeedback } from '@/db/others/createFeedback'
import clsx from 'clsx'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(true)

  const additionalData = {
    time: new Date(),
  }

  const [feedbackState, feedbackAction, isPending] = useActionState(
    createFeedback.bind(null, additionalData),
    {
      success: undefined,
      message: '',
    }
  )

  return (
    <div>
      {isOpen && (
        <Form
          action={feedbackAction}
          className="border-1 rounded h-16 overflow-hidden hover:h-60 border-gray-300 mb-4 p-2 transition-all cursor-pointer"
        >
          <div className="flex flex-row justify-between">
            <p className="font-bold">Any feedback?</p>
            <button type="button" onClick={() => setIsOpen(false)}>
              <Icon tooltip="Close">
                <XMarkIcon className="size-4" />
              </Icon>
            </button>
          </div>
          <p className="mb-2 text-sm text-text-weak">
            We are always improving ATS.
          </p>
          <textarea
            name="feedback"
            className="bg-gray-200 resize-none focus:outline-gray-400 focus:outline-1 rounded w-full h-20 p-2"
          ></textarea>
          <div>
            <button
              type="submit"
              className="bg-text-weak text-white text-sm rounded px-2 py-1 w-full cursor-pointer tracking-wider mt-1 hover:bg-neutral-500 transition-colors flex justify-center items-center-safe"
            >
              {isPending ? <ArrowPathIcon className="size-4" /> : <p>Submit</p>}
            </button>
          </div>

          {feedbackState?.message && (
            <p
              className={clsx(
                'font-bold text-sm mt-0' && true,
                feedbackState?.success ? 'text-green-400' : 'text-red-400'
              )}
            >
              {feedbackState.message}
            </p>
          )}
        </Form>
      )}
    </div>
  )
}
