"use server";

import { neon } from "@neondatabase/serverless";
import getSubjectInfoFromId from "./getSubjectInfoFromId";

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
