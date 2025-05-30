"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

export async function signIn(prevState, formData) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const username = formData.get("username");
  const password = formData.get("password");
  console.log(username, password);

  // parametised query -> don't need real_escape_string
  const response = await sql.query(
    "SELECT * FROM users WHERE username = ($1)",
    [username]
  );

  const storedPassword = response[0].password;
  const hashedStoredPassword = bcrypt.hashSync(storedPassword, 10);

  // bcrypt -> hasing (process password using sophisticated mathematical function, and is one-way) + salt(a random number unique to each password and is attached to it before hashing) more: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/

  const isMatch = bcrypt.compareSync(password, hashedStoredPassword);

  if (isMatch) {
    return {
      success: true,
      message: `Signing into ${username} ${response[0].role} account...`,
    };
  } else {
    return {
      success: false,
      message: `Username or password is incorrect.`,
    };
  }
}
