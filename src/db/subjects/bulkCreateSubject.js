'use server'

import { neon } from '@neondatabase/serverless'
import { requireAdmin } from '@/actions/requireAdmin'

export async function bulkCreateSubjects(subjects, prevState, formData) {
  try {
    requireAdmin()
    const sql = neon(`${process.env.STORE_DATABASE_URL}`)

    await sql.transaction(async (sql) => {
      await Promise.all(
        subjects.map(
          (subject) =>
            sql`INSERT INTO subjects (id, teacher_id, monitor_id) VALUES (${subject.id}, ${subject.teacher_id}, ${subject.monitor_id});`
        )
      )

      const values = subjects.flatMap((subject) =>
        subject.student_ids.map((student_id) =>
          sql.value([student_id, subject.id])
        )
      )

      console.log(values)

      if (values.length > 0) {
        await sql`
          INSERT INTO student_subject (student_id, subject_id)
          VALUES ${sql.join(values, '), (')}
        `
      }
    })

    return {
      success: true,
      message: `Successfully created subjects.`,
    }
  } catch (err) {
    console.error('Error creating subject:', err)

    return {
      success: false,
      message: `Failed to create subjects. Please check the developer console.`,
    }
  }
}
