"use server";

import { Pool } from "@neondatabase/serverless";
import { verifySession } from "@/actions/userSession";
import bcrypt from "bcrypt";
import { getUser } from "./getUser";
import { revalidatePath } from "next/cache";
import { setSubjectTeacher } from "../subjects/setSubjectTeacher";

export async function createUser(additionalData, prevState, formData) {
  const pool = new Pool({ connectionString: process.env.STORE_DATABASE_URL });
  const client = await pool.connect();

  try {
    const session = await verifySession();
    if (!session) throw new Error("Session not found.");

    const user = await getUser();
    const userRole = user.role;

    if (userRole !== "admin")
      throw new Error("User not authorised to create user.");

    const id = formData.get("id");
    const name = formData.get("name");
    const password = formData.get("password");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { enrolledSubjectIds, taughtSubjectIds, role } = additionalData;

    await client.query("BEGIN");
    await client.query(
      "INSERT INTO users (id, name, password, role, reg_date, deactivated_date) VALUES ($1, $2, $3, $4, $5, null)",
      [id, name, hashedPassword, role, new Date().toISOString()]
    );

    if (enrolledSubjectIds && enrolledSubjectIds.length > 0) {
      await setStudentSubject(id, { newlyEnrolled: enrolledSubjectIds });
      await client.query("COMMIT");
    } else if (taughtSubjectIds && taughtSubjectIds.length > 0) {
      await setSubjectTeacher(id, { newlyTaught: taughtSubjectIds });
      await client.query("COMMIT");
    } else {
      await client.query("COMMIT");
    }

    revalidatePath("/admin/user");

    return {
      success: true,
      message: "Success!",
    };
  } catch (err) {
    console.error("Error creating user:", err);

    await client.query("ROLLBACK");

    return {
      success: false,
      message: `Failed to create user. Please check the developer console.`,
    };
  } finally {
    client.release();
  }
}
