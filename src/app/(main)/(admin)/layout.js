import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/userSession";

export default async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "admin") {
    redirect("/home");
  }

  return <div>{children}</div>;
}
