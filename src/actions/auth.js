'use server'

import bcrypt from 'bcrypt'
import { getAllUsers } from '@/db/users/getAllUsers'

export async function logIn(prevState, formData) {
  try {
    const userId = formData.get('userId')
    const password = formData.get('password')

    const response = await getAllUsers()
    console.log(response)
    const userData = response.filter((user) => user.id === userId)[0]

    const isMatch = await bcrypt.compare(password, userData.password)

    if (!isMatch) {
      throw new Error('Incorrect credentials.')
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
      message: 'Incorrect credentials.',
    }
  }
}
