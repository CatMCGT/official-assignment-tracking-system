"use server";

import { neon } from "@neondatabase/serverless";
import { verifySession } from "@/actions/userSession";

export async function getSubjectAdmin(subjectId) {
  const session = await verifySession();
  if (!session) return null;

  const sql = neon(`${process.env.STORE_DATABASE_URL}`);
  const response =
    await sql`SELECT t.id as teacher_id, t.name as teacher_name, st.id as monitor_id, st.name as monitor_name FROM subjects s, teachers t, students st WHERE s.teacher_id = t.id AND s.monitor_id = st.id AND s.id = ${subjectId};`;

  return response[0];
}
