import { AcademicCapIcon } from "@heroicons/react/24/outline";

import { getAllUsers } from "@/db/users";

export default async function Page() {
  const getAllUsersData = await getAllUsers();
  const allUserDataString = getAllUsersData?.data;
  const allUserData = JSON.parse(allUserDataString);

  return (
    <div className="h-full w-full">
      <div className="p-2 rounded bg-fill-weak w-fit">
        <AcademicCapIcon className="size-9 text-text-strong" />
      </div>
      <h1 className="font-semibold text-2xl mt-4 mb-3">Subject Management</h1>

    </div>
  );
}