"use server"

import {neon} from "@neondatabase/serverless"

export async function isSubjectAdmin(subjectId, userId) {
  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response = await sql`SELECT 1 FROM subjects WHERE id = ${subjectId} AND (teacher_id = ${userId} OR monitor_id = ${userId})`

  return response.length > 0
}