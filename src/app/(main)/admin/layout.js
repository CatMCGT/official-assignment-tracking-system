import { getUser } from "@/db/users/getUser";

export default async function Layout({ children }) {
  const user = await getUser();
  const role = user.role;

  if (role !== "admin") {
    return <p>You do not have the rights to access this page.</p>;
  }

  return <>{children}</>;
}
