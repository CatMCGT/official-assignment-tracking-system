"use server";

import { neon } from "@neondatabase/serverless";
import { getSubjectIdFromInfo, getSubjectInfoFromId } from "@/libs/utils";

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

export async function createSubject(prevState, formData) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const subjectClass = formData.get("class");
    const grade = formData.get("grade");
    const name = formData.get("name");
    const block = formData.get("block");
    const teacherId = formData.get("teacherId");

    const id = getSubjectIdFromInfo({ subjectClass, grade, name, block });
    if (!id)
      return {
        success: false,
        message: "Error getting subjectId from info.",
      };

    await sql`
    INSERT INTO subjects (id, teacher_id)
    VALUES (${id}, ${teacherId})
    `;

    return {
      success: true,
      message: "Successfully created subject into database.",
    };
  } catch (err) {
    console.error("Error creating subject:", err);

    return {
      success: false,
      message: "Failed to create subject.",
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
