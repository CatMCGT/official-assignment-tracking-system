"use server";

import { neon } from "@neondatabase/serverless";
import { verifySession } from "@/actions/userSession";
import { getUser } from "./getUser";

export async function getAllUsers() {
  const session = await verifySession();
  if (!session) return null;

  const user = await getUser();
  const userRole = user.role;

  if (userRole !== "admin")
    throw new Error("User not authorised to view all users.");

  const sql = neon(`${process.env.STORE_DATABASE_URL}`);
  const response =
    await sql`SELECT id, name, role, reg_date, deactivated_date FROM users;`;

  return response;
}
