import { UserIcon } from "@heroicons/react/24/outline";

import AddUserFormSection from "@/containers/admin-page/user-management/addUserForm";
import UserDisplaySection from "@/containers/admin-page/user-management/userDisplay";
import { getAllUsers } from "@/db/users";

export default async function Page() {
  const getAllUsersData = await getAllUsers();
  const allUserDataString = getAllUsersData?.data;
  const allUserData = JSON.parse(allUserDataString);

  return (
    <div className="h-full w-full">
      <div className="p-2 rounded bg-fill-weak w-fit">
        <UserIcon className="size-9 text-text-strong" />
      </div>
      <h1 className="font-semibold text-2xl mt-4 mb-3">User Management</h1>

      <div className="flex flex-row gap-10 items-start">
        <AddUserFormSection />

        <UserDisplaySection allUserDataServer={allUserData} />
      </div>
    </div>
  );
}
