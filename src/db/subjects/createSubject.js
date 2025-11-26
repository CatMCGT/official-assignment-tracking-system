'use server'

import { verifySession } from '@/actions/userSession'
import { getUser } from '../users/getUser'
import { Pool, neon } from '@neondatabase/serverless'

export async function createSubject(additionalData, prevState, formData) {
  const pool = new Pool({ connectionString: process.env.STORE_DATABASE_URL })
  const client = await pool.connect()

  try {
    const session = await verifySession()
    if (!session) throw new Error('Session not found.')

    const user = await getUser()
    const userRole = user.role

    if (userRole !== 'admin')
      throw new Error('User not authorised to create subject.')

    const {
      subjectType,
      subjectShorthand,
      subjectTeacherId,
      subjectMonitorId,
      subjectStudentIds,
    } = additionalData

    let subjectId = ''
    const dateNow = new Date()
    const twoDigitYear = dateNow.getFullYear()
    const schoolYear =
      dateNow.getMonth() >= 8 && dateNow.getMonth() <= 12
        ? `${twoDigitYear.toString().substring(2)}${(twoDigitYear + 1)
            .toString()
            .substring(2)}`
        : `${(twoDigitYear - 1).toString().substring(2)}${twoDigitYear
            .toString()
            .substring(2)}`

    if (subjectType === 'grade') {
      const grade = formData.get('grade')
      const block = formData.get('block')

      subjectId = `${schoolYear}-g${grade}-${subjectShorthand}-${block}`
    } else if (subjectType === 'class') {
      const subjectClass = formData.get('class')

      subjectId = `${schoolYear}-${subjectClass.toLowerCase()}-${subjectShorthand}`
    }

    await client.query('BEGIN')
    await client.query(
      'INSERT INTO subjects (id, teacher_id, monitor_id) VALUES ($1, $2, $3);',
      [subjectId, subjectTeacherId, subjectMonitorId]
    )

    const sqlValues = subjectStudentIds.map((id) => {
      return { student_id: id, subject_id: subjectId }
    })

    await client.query(
      `INSERT INTO student_subject (
        student_id, 
        subject_id
      )
      SELECT
        (elem->>'student_id')::TEXT,
        (elem->>'subject_id')::TEXT
      FROM jsonb_array_elements($1::jsonb) AS elem;`,
      [JSON.stringify(sqlValues)]
    )

    await client.query('COMMIT')
  } catch (err) {
    console.error('Error creating subject:', err)

    await client.query('ROLLBACK')

    return {
      success: false,
      message: `Failed to create user. Please check the developer console.`,
    }
  } finally {
    client.release()
  }
}
