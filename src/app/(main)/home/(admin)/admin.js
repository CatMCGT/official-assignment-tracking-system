import AddUserForm from "./components/addUserForm";
import { getAllUsers } from "@/lib/adminPortal";
import AllUserDisplay from "./components/allUserDisplay";

export default async function AdminPage() {
  const getAllUsersData = await getAllUsers();
  const allUserDataString = getAllUsersData?.data;
  const allUserData = JSON.parse(allUserDataString);

  return (
    <div className="flex flex-row gap-10 items-start">
      <AddUserForm />

      <AllUserDisplay allUserDataServer={allUserData} />
    </div>
  );
}
