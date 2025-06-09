"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

export async function createUser(prevState, formData) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const role = formData.get("role")?.toLowerCase();
    const table = role ? `${role}s` : null;

    if (!table || !["students", "teachers", "admins"].includes(table)) {
      return {
        success: false,
        message: "Invalid role.",
      };
    }

    const id = formData.get("id");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password") || "1234";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sql`
      INSERT INTO ${sql.unsafe(table)} (id, name, password, email)
      VALUES (${id}, ${name}, ${hashedPassword}, ${email})
    `;

    return {
      success: true,
      message: "Successfully added user into database.",
    };
  } catch (err) {
    console.error("Error creating user:", err);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}

export async function getAllUsers() {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
     
    const result = await sql`SELECT id, name, email, reg_date FROM users;`
    const resultString = JSON.stringify(result);

    return {
      success: true,
      data: resultString,
    };
  } catch (err) {
    console.error("Error getting all users:", err);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}