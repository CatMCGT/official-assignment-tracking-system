'use server'

import { neon } from '@neondatabase/serverless'

const conn = neon(process.env.STORE_DATABASE_URL)

export async function updateSubjectRelation({
  table,
  targetColumn,
  targetId,
  addIds = [],
  removeIds = [],
}) {
  await requireAdmin()

  if (addIds.length === 0 && removeIds.length === 0) {
    return { success: true, message: 'There are no relations to update.' }
  }

  await conn.begin(async (sql) => {

    for (const subjectId of addIds) {
      await sql`INSERT INTO ${sql(table)} (${sql(targetColumn)}, subject_id) VALUES (${targetId}, ${subjectId}) ON CONFLICT DO NOTHING`
    }

    for (const subjectId of removeIds) {
      await sql`DELETE FROM ${sql(table)} WHERE ${sql(targetColumn)} = ${targetId} AND subject_id = ${subjectId}`
    }
  })
}
