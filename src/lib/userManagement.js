'use server'

import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  if (cookieStore.has("username") && cookieStore.has("role")) {
    const username = cookieStore.get("username");
    const role = cookieStore.get("role");

    return {
      username: username,
      role: role,
    };
  }
}

export async function setCurrentUser(username, role) {
  try {
    const cookieStore = await cookies();

    cookieStore.set("username", username, { secure: true });
    cookieStore.set("role", role, { secure: true });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function deleteCurrentUser() {
  const cookieStore = await cookies();
  cookieStore.delete("username");
  cookieStore.delete("role");
}
