"use server"

import {neon} from "@neondatabase/serverless"
import { verifySession } from "@/actions/userSession"

export async function getTaughtSubjects() {
  const session = await verifySession()
  if (!session) return null

  const sql = neon(`${process.env.STORE_DATABASE_URL}`)
  const response = await sql`SELECT id as subject_id, teacher_id, monitor_id FROM subjects WHERE teacher_id = ${session.userId}`

  return response
}