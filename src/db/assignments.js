"use server";

import { getSubjectInfoFromId } from "@/libs/utils";
import { neon } from "@neondatabase/serverless";

export async function getAllAssignments() {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const assignments =
      await sql`SELECT id, title, subject_id, assigned_date, due_date, description FROM assignments;`;

    const formattedAssignments = assignments.map((assignment) => {
      const subjectInfo = getSubjectInfoFromId(assignment.subject_id);
      return {
        ...assignment,
        subjectInfo: subjectInfo,
      };
    });

    return {
      success: true,
      data: JSON.stringify(formattedAssignments),
    };
  } catch (err) {
    console.error("Error getting all assignments:", err);

    return {
      success: false,
      message: "Failed to fetch all assignments.",
    };
  }
}
