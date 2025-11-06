"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/actions/requireAdmin";

const sql = neon(`${process.env.STORE_DATABASE_URL}`);

export async function updateSubject(updatedSubjects) {
  try {
    await requireAdmin();

    await Promise.all(
      updatedSubjects.map(async (subject) => {
        await sql`
            UPDATE
                subjects
            SET
                teacher_id = ${subject.teacher_id},
                monitor_id = ${subject.monitor_id},
                deactivated_date = ${subject.deactivated_date}
            WHERE
                id = ${subject.id}
        `;
      })
    );

    revalidatePath("/admin/subject");
  } catch (err) {
    console.error("Error updating subject:", err);

    return {
      success: false,
      message: `Failed to update subject. Please check the developer console.`,
    };
  }
}

export async function updateSubjectStudents(newlyEnrolled, removedEnrolled) {
  try {
    await requireAdmin();

    await Promise.all(
      newlyEnrolled.map(async ({ subjectId, studentId }) => {
        await sql`
            INSERT INTO
                student_subject (student_id, subject_id)
            VALUES
                (${studentId}, ${subjectId});
        `;
      }),
      removedEnrolled.map(async ({ subjectId, studentId }) => {
        await sql`
            DELETE FROM
                student_subject
            WHERE
                student_id = ${studentId} AND
                subject_id = ${subjectId};
        `;
      })
    );

    revalidatePath("/admin/user");
  } catch (err) {
    console.error("Error updating subject students:", err);

    return {
      success: false,
      message: `Failed to update subject students. Please check the developer console.`,
    };
  }
}
