import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AddUserForm from "./components/addUserForm";
import { getAllUsers } from "@/lib/adminPortal";

export default async function AdminPage() {
  const getAllUsersData = await getAllUsers();
  const allUserDataString = getAllUsersData?.data;
  const allUserData = JSON.parse(allUserDataString)

  const ele = allUserData.map((row) => <p key={row.id}>ID: {row.id}. Name: {row.name}. Email: {row.email}. Reg_date: {row.reg_date}</p>)

  return (
    <div className="flex flex-row gap-10 items-start">
      <AddUserForm />

      <div>
        <div className="flex flex-row gap-4 items-center">
          <p className="text-sm text-text-weakest">Show me</p>
          <div className="flex flex-row gap-1 px-3 py-2 bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] transition-colors">
            <p className="text-text-weak">All Users</p>
            <ChevronDownIcon className="size-6 text-text-weaker" />
          </div>
        </div>

        {ele}
      </div>
    </div>
  );
}
