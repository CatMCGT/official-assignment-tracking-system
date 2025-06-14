"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

import checkRole from "./checkRole";

function formatDate(date) {
  const dateString = new Date(date).toLocaleDateString("en", {
    timeZone: "Asia/Hong_Kong",
  });
  return dateString;
}

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

    let id = formData.get("id");

    if (!["s", "a", "t"].includes(id[0])) {
      id = role[0] + id;
    }

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

    const result = await sql`SELECT id, name, email, reg_date FROM users;`;
    const updatedResults = result.map((row) => {
      return {
        ...row,
        role: checkRole(row.id),
        reg_date: formatDate(row.reg_date),
      };
    });
    const resultString = JSON.stringify(updatedResults);

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

export async function deleteUsers(users) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    users.forEach((userId) => {
      const role = checkRole(userId);
      const table = role ? `${role}s` : null;

      if (!table || !["students", "teachers", "admins"].includes(table)) {
        return {
          success: false,
          message: "Invalid role.",
        };
      }

      const deleteUser = async (userId) => {
        const response = await sql`DELETE FROM ${sql.unsafe(
          table
        )} WHERE id = ${userId};`;
      };

      deleteUser(userId);
    });
  } catch (err) {
    console.error("Error getting all users:", err);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
