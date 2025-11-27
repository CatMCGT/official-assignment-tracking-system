import MainLayout from "../../layout";
import CreateSubject from "./CreateSubject";
import AllSubjects from "./AllSubjects";
import { getAllSubjects } from "@/db/subjects/getAllSubjects";
import { getAllUsers } from "@/db/users/getAllUsers";

export default async function Page() {
  const allSubjects = await getAllSubjects();
  const allUsers = await getAllUsers();

  return (
    <div>
      <MainLayout.Header>Subject Management</MainLayout.Header>

      <div className="flex flex-row gap-10">
        <div>
          <CreateSubject allSubjects={allSubjects} allUsers={allUsers} />
        </div>

        <AllSubjects allUsers={allUsers} allSubjects={allSubjects} />
      </div>
    </div>
  );
}
