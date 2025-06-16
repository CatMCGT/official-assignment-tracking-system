import { getCurrentUser } from "@/lib/userSession";
import { HomeIcon } from "@heroicons/react/24/outline";
import AdminPage from "./(admin)/admin";

export default async function Page() {
  const currentUser = await getCurrentUser();

  let content;
  if (currentUser?.role === "admin") {
    content = <AdminPage />;
  }

  return (
    <div className="h-full w-full">
      <div className="p-2 rounded bg-fill-weak w-fit">
        <HomeIcon className="size-9 text-text-strong" />
      </div>
      <h1 className="font-semibold text-2xl mt-4 mb-3">Home</h1>
      {content}
    </div>
  );
}
