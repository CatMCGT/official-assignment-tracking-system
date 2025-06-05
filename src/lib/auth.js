"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

import checkRole from "./checkRole";

export async function signIn(prevState, formData) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const username = formData.get("username");
  const password = formData.get("password");
  console.log(username, password);

  // parametised query -> don't need real_escape_string
  const response = await sql.query(
    "SELECT * FROM users WHERE name = ($1)",
    [username]
  );

  const storedPassword = response[0].password;
  const isMatch = bcrypt.compareSync(password, storedPassword);

  // bcrypt -> hasing (process password using sophisticated mathematical function, and is one-way) + salt(a random number unique to each password and is attached to it before hashing) more: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/

  if (isMatch) {
    const role = checkRole(response[0].id);
    return {
      success: true,
      message: `Signing into ${username} ${role} account...`,
      username: username,
      role: role
    };
  } else {
    return {
      success: false,
      message: `Username or password is incorrect.`,
    };
  }
}
