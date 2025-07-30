'use server'

import bcrypt from 'bcrypt'
import { getAllUsers } from '@/db/users/getAllUsers'

export async function signIn(prevState, formData) {
  try {
    const userId = formData.get('userId')
    const password = formData.get('password')

    const response = await getAllUsers()
    const userData = response.filter((user) => user.id === userId)[0]

    const isMatch = await bcrypt.compare(password, userData.password)

    if (!isMatch) {
      throw new Error('Incorrect credentials.')
    }

    return {
      success: true,
      message: `Signing into ${userId} ${userData.role} account...`,
      data: userData,
    }
  } catch (err) {
    console.error('Error signing in:', err)

    return {
      success: false,
      message: 'Incorrect credentials.',
    }
  }
}
