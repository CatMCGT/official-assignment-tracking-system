"use server";

import { neon } from "@neondatabase/serverless";
import { verifySession } from "@/actions/userSession";
import bcrypt from "bcrypt";
import { getUser } from "./getUser";

export async function createUser(prevState, formData) {
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
    const role = formData.get("role");

    const sql = neon(`${process.env.STORE_DATABASE_URL}`);
    const response =
      await sql`INSERT INTO users (id, name, password, role) VALUES (${id}, ${name}, ${hashedPassword}, ${role})`;

    return {
      success: true,
      message: "Success!",
    };
  } catch (err) {
    console.error("Error creating user:", err);
    return {
      success: false,
      message: `Failed to create user. Please check the developer console.`,
    };
  }
}
