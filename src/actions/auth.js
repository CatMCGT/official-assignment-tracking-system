"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

import { checkRole } from "@/libs/utils";
import { getAllUsers } from "@/db/users";

export async function signIn(prevState, formData) {
  const userId = formData.get("userId");
  const password = formData.get("password");

  // parametised query -> don't need real_escape_string

  const response = await getAllUsers();
  if (!response.success) {
    return {
      success: false,
      message: `Error fetching all users.`,
    };
  }
  const userDataDB = JSON.parse(response.data).filter(
    (user) => user.id === userId
  )[0];
  // const response = await sql.query("SELECT * FROM users WHERE name = ($1)", [
  //   username,
  // ]);

  const storedPassword = userDataDB.password;
  const isMatch = await bcrypt.compare(password, storedPassword);

  // bcrypt -> hasing (process password using sophisticated mathematical function, and is one-way) + salt(a random number unique to each password and is attached to it before hashing) more: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/

  if (isMatch) {
    return {
      success: true,
      message: `Signing into ${userId} ${userDataDB.role} account...`,
      userData: { ...userDataDB },
    };
  } else {
    return {
      success: false,
      message: `Username or password is incorrect.`,
    };
  }
}
