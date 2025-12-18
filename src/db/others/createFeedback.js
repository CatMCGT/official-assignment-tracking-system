'use server'

import { verifySession } from '@/actions/userSession'
import { neon } from '@neondatabase/serverless'

export async function createFeedback(additionalData, prevState, formData) {
  try {
    const session = await verifySession()
    if (!session) return null

    const feedback = formData.get('feedback')

    if (feedback === null || feedback === '') {
      return {
        success: false,
        message: 'Empty feedback!',
      }
    }

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const response =
      await sql`INSERT INTO ats_feedback(description, time, user_id) VALUES (${feedback}, ${additionalData.time}, ${session.userId}) RETURNING id;`

    const fid = response[0].id

    return {
      success: true,
      feedbackId: fid,
      message: 'Got it! Thank you <3',
    }
  } catch (err) {
    console.error('Error creating feedback:', err)

    return {
      success: false,
      message: 'Something went wrong.',
    }
  }
}
