"use server";

import { neon } from "@neondatabase/serverless";
import { getSubjectInfoFromId } from "@/libs/utils";

export async function getAllSubjects() {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const subjects = await sql`SELECT id, teacher_id FROM subjects;`;

    const formattedSubjects = subjects.map((subject) => {
      const info = getSubjectInfoFromId(subject.id);
      return {
        id: subject.id,
        teacherId: subject.teacher_id,
        ...info,
      };
    });

    return {
      success: true,
      data: JSON.stringify(formattedSubjects),
    };
  } catch (err) {
    console.error("Error getting all subjects:", err);

    return {
      success: false,
      message: "Failed to fetch all subjects.",
    };
  }
}

export async function changeSubjectTeacher(subjectId, teacherId) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const response =
      await sql`UPDATE subjects SET teacher_id = ${teacherId} where id = ${subjectId}`;

    return {
      success: response,
      message: response
        ? "Successfully changed subject teacher"
        : "Failed to change subject teacher.",
    };
  } catch (err) {
    console.error("Error getting all subjects:", err);

    return {
      success: false,
      message: "Failed to change subject teacher.",
    };
  }
}
