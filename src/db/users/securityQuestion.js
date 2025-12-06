'use server'

import bcrypt from 'bcrypt'
import { neon } from '@neondatabase/serverless'
import { verifySession } from '@/actions/userSession'
import { securityQuestions } from '@/utils/securityQuestions'

export async function getSecurityQuestion(userId = null) {
  try {
    const sql = neon(`${process.env.STORE_DATABASE_URL}`)

    let response
    if (userId) {
      response = (
        await sql`SELECT id, security_id FROM users WHERE id=${userId};`
      )[0]
    } else {
      const session = await verifySession()
      response = (
        await sql`SELECT id, security_id FROM users WHERE id=${session.userId};`
      )[0]
    }

    if (response.security_id !== null) {
      return {
        success: true,
        data: securityQuestions.filter((q) => q.id == response.security_id)[0],
      }
    } else {
      return {
        success: false,
        message: 'You have not set up a valid security question.',
      }
    }
  } catch (err) {
    console.error('Error getting security question:', err)

    return {
      success: false,
      message:
        'Error getting security question. Please check the developer console.',
    }
  }
}

export async function setSecurityQuestionAns(
  additionalData,
  prevState,
  formData
) {
  try {
    const { securityQuestionId, userId } = additionalData
    const securityAns = formData.get('securityAns')

    const hashedAns = await bcrypt.hash(securityAns, 10)

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    let response
    if (userId) {
      response =
        await sql`UPDATE users SET security_id = ${securityQuestionId}, security_ans = ${hashedAns} WHERE id = ${userId}`
    } else {
      const session = await verifySession()
      response =
        await sql`UPDATE users SET security_id = ${securityQuestionId}, security_ans = ${hashedAns} WHERE id = ${session.userId}`
    }

    return {
      success: true,
      message: 'Successfully set up your security question.',
    }
  } catch (err) {
    console.error('Error setting security question:', err)

    return {
      success: false,
      message:
        'Error setting security question. Please check the developer console.',
    }
  }
}

export async function compareSecurityAns(additionalData, prevState, formData) {
  try {
    const securityAns = formData.get('securityAns')
    const { userId } = additionalData

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    let response
    if (userId) {
      response = (
        await sql`SELECT id, security_id, security_ans FROM users WHERE id=${userId};`
      )[0]
    } else {
      const session = await verifySession()
      response = (
        await sql`SELECT id, security_id, security_ans FROM users WHERE id=${session.userId};`
      )[0]
    }

    if (response.security_id !== null) {
      const isMatch = await bcrypt.compare(securityAns, response.security_ans)

      if (isMatch) {
        return {
          success: true,
          message: `You can now reset your password`,
        }
      } else {
        return {
          success: false,
          message: 'Wrong answer.',
        }
      }
    } else {
      return {
        success: false,
        message: 'You have not set up a valid security question.',
      }
    }
  } catch (err) {
    console.error('Error comparing security question answer:', err)

    return {
      success: false,
      message:
        'Error comparing security question answer. Please check the developer console.',
    }
  }
}
