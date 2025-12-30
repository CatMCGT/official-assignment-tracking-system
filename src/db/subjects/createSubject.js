'use server'

import { verifySession } from '@/actions/userSession'
import { getUser } from '../users/getUser'
import { neon } from '@neondatabase/serverless'

export async function createSubject(additionalData, prevState, formData) {
  try {
    const sql = neon(`${process.env.STORE_DATABASE_URL}`)

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

    if (subjectShorthand === null) {
      throw new Error('Subject name missing')
    }
    if (subjectTeacherId === null) {
      throw new Error('Subject teacher missing')
    }

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

    const sqlValues = subjectStudentIds.map((id) => {
      return { student_id: id, subject_id: subjectId }
    })

    await sql.transaction([
      sql`INSERT INTO subjects (id, teacher_id, monitor_id) VALUES (${subjectId}, ${subjectTeacherId}, ${subjectMonitorId});`,
      sql`INSERT INTO student_subject (
        student_id, 
        subject_id
      )
      SELECT
        (elem->>'student_id')::TEXT,
        (elem->>'subject_id')::TEXT
      FROM json_array_elements(${JSON.stringify(sqlValues)}::json) AS elem;`,
    ])
  } catch (err) {
    console.error('Error creating subject:', err)

    return {
      success: false,
      message:
        `${err.message}. ${err.detail || ''}` ||
        `Failed to create subject. Please check the developer console.`,
    }
  }
}
