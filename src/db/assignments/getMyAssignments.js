"use server";

import { neon } from "@neondatabase/serverless";
import { verifySession } from "@/actions/userSession";
import getSubjectInfo from "@/utils/getSubjectInfo";

export async function getMyAssignments() {
  const session = await verifySession();
  if (!session) return null;

  const sql = neon(`${process.env.STORE_DATABASE_URL}`);
  const assignments = await sql`
    SELECT
      assignment_id,
      title as assignment_title,
      description as assignment_description,
      a.grade as assignment_grade,
      assigned_date,
      due_date,
      status,
      s.grade as grade,
      feedback,
      collected_date,
      subject_id,
      su.deactivated_date as deactivated_date,
      t.id as teacher_id,
      t.name as teacher_name,
      m.id as monitor_id,
      m.name as monitor_name
    FROM
      assignments a,
      student_assignment s,
      subjects su,
      teachers t,
      students m
    WHERE
      a.id = s.assignment_id AND
      s.student_id = ${session?.userId} AND
      a.subject_id = su.id AND
      su.teacher_id = t.id AND
      su.monitor_id = m.id
    ORDER BY
      due_date DESC;
  `;

  const formattedAssignments = assignments.map((a) => {
    const subjectInfo = getSubjectInfo(a.subject_id);

    return {
      ...a,
      subjectInfo: subjectInfo,
    };
  });

  return formattedAssignments;
}
