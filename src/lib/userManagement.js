"use server";

import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  if (cookieStore.has("userData")) {
    const userDataString = cookieStore.get("userData").value;
    const userData = JSON.parse(userDataString);

    return userData;
  }
}

export async function setCurrentUser(userData) {
  const userDataString = JSON.stringify(userData);

  try {
    const cookieStore = await cookies();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    cookieStore.set("userData", userDataString, { secure: true, expires: expirationDate });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function deleteCurrentUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userData");
}
