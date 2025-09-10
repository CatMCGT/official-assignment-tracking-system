"use server";

import { neon } from "@neondatabase/serverless";
import { verifySession } from "@/actions/userSession";
import { getUser } from "../users/getUser";
import getSubjectInfo from "@/utils/getSubjectInfo";

export async function getAllSubjects() {
  try {
    const session = await verifySession();
    if (!session) throw new Error("Session not found.");

    const user = await getUser();
    const userRole = user.role;

    if (userRole !== "admin")
      throw new Error("User not authorised to get all subjects.");

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);
    const response = await sql`SELECT id FROM subjects;`;

    const subjects = response.map((subject) => {
      const subjectInfo = getSubjectInfo(subject.id);

      return {
        id: subject.id,
        ...subjectInfo,
      };
    });

    return subjects;
  } catch (err) {
    console.error("Error fetching subjects:", err);
  }
}
