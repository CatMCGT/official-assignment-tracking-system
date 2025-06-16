"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

import { checkRole } from "@/libs/utils";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en", { timeZone: "Asia/Hong_Kong" });

// Verifying table name as table names cannot be prepared parameters
const getTableName = (role) => {
  const roleLowerCase = role?.toLowerCase();
  const table = roleLowerCase ? `${roleLowerCase}s` : null;
  return ["students", "teachers", "admins"].includes(table) ? table : null;
};

export async function createUser(prevState, formData) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const role = formData.get("role");
    const table = getTableName(role);

    if (!table) {
      return {
        success: false,
        message: "Invalid role.",
      };
    }

    let id = formData.get("id");
    if (!["s", "a", "t"].includes(id[0])) {
      id = role[0].toLowerCase() + id;
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
      message: "Failed to add user.",
    };
  }
}

export async function getAllUsers() {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const users = await sql`SELECT * FROM users;`;

    const formattedUsers = users.map((user) => {
      return {
        ...user,
        role: checkRole(user.id),
        reg_date: formatDate(user.reg_date),
      };
    });

    return {
      success: true,
      data: JSON.stringify(formattedUsers),
    };
  } catch (err) {
    console.error("Error getting all users:", err);

    return {
      success: false,
      message: "Failed to fetch all users.",
    };
  }
}

export async function deleteUsers(userIds) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    for (const userId of userIds) {
      const role = checkRole(userId);
      const table = getTableName(role);

      if (!table) {
        return {
          success: false,
          message: "Invalid role.",
        };
      }

      await sql`DELETE FROM ${sql.unsafe(table)} WHERE id = ${userId};`;
    }

    return { success: true, message: "Users deleted successfully."};
  } catch (err) {
    console.error("Error getting all users:", err);

    return {
      success: false,
      message: "Failed to delete users.",
    };
  }
}