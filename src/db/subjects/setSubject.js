"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/actions/requireAdmin";

const sql = neon(`${process.env.STORE_DATABASE_URL}`);

export async function updateSubjects(updatedSubjectsObj) {
  try {
    await requireAdmin();

    await Promise.all(
      updatedSubjectsObj.map(async (subject) => {
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

export async function updateSubjectStudents(
  newlyEnrolled = [],
  removedEnrolled = []
) {
  try {
    await requireAdmin();

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);

    await Promise.all(
      newlyEnrolled.map(async (item) => {
        const { subjectId, studentId } = item;

        await sql`
            INSERT INTO
                student_subject (student_id, subject_id)
            VALUES
                (${studentId}, ${subjectId});
        `;
      }),

      removedEnrolled.map(async (item) => {
        const { subjectId, studentId } = item;

        await sql`
            DELETE FROM
                student_subject
            WHERE
                student_id = ${studentId} AND
                subject_id = ${subjectId};
        `;

        await sql`
            UPDATE
                subjects
            SET
                monitor_id = null,
            WHERE
                id = ${subjectId} AND
                monitor_id = ${studentId}
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

export async function updateSubjectTeachers(
  newlyTaught = [],
  removedTaught = []
) {
  try {
    await requireAdmin();

    await Promise.all(
      newlyTaught.map(async ({ subjectId, teacherId }) => {
        await sql`
            UPDATE
              subjects
            SET
              teacher_id = ${teacherId}
            WHERE
              id = ${subjectId};
        `;
      }),
      removedTaught.map(async ({ subjectId, teacherId }) => {
        await sql`
            UPDATE
              subjects
            SET
              teacher_id = null
            WHERE
              id = ${subjectId} AND
              teacher_id = ${teacherId};
        `;
      })
    );

    revalidatePath("/admin/user");
  } catch (err) {
    console.error("Error updating subject teachers:", err);

    return {
      success: false,
      message: `Failed to update subject teachers. Please check the developer console.`,
    };
  }
}
