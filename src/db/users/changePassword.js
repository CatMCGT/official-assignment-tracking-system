'use server'

import { verifySession } from '@/actions/userSession'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'

export async function changePassword(additionalData, prevState, formData) {
  try {
    const { userId } = additionalData

    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match.',
      }
    }

    const hashedPassword = await bcrypt.hash(confirmPassword, 10)

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    let response
    if (userId) {
      response =
        await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}`
    } else {
      const session = await verifySession()
      response =
        await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${session.userId}`
    }

    return {
      success: true,
      message: 'Successfully changed password.',
    }
  } catch (err) {
    console.error('Error changing password:', err)

    return {
      success: false,
      message: 'Error changing password. Please check the developer console.',
    }
  }
}
