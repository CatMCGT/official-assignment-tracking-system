import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/userSession";
import { AdminProvider } from "@/hooks/admin";

export default async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "admin") {
    redirect("/home");
  }

  return (
    <div>
      <AdminProvider>{children}</AdminProvider>
    </div>
  );
}
