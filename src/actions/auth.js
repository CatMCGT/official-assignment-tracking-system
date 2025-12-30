'use server'

import bcrypt from 'bcrypt'
import { neon } from '@neondatabase/serverless'

export async function logIn(prevState, formData) {
  try {
    const userId = formData.get('userId')
    const password = formData.get('password')

    const sql = neon(`${process.env.STORE_DATABASE_URL}`)
    const response =
      await sql`SELECT id, password, role, deactivated_date FROM users;`

    const userData = response.filter((user) => user.id === userId)[0]

    if (!userData) {
      return {
        success: false,
        message: 'User does not exist!',
      }
    }

    const isMatch = await bcrypt.compare(password, userData.password)

    if (!isMatch) {
      return {
        success: false,
        message: 'Incorrect credentials.',
      }
    }

    if (userData.deactivated_date !== null) {
      return {
        success: false,
        message: 'User deactivated.',
      }
    }

    return {
      success: true,
      message: `Logging into ${userId} ${userData.role} account...`,
      data: userData,
    }
  } catch (err) {
    console.error('Error logging in:', err)

    return {
      success: false,
      message: 'Error loggin in. Please check the developer console.',
    }
  }
}
