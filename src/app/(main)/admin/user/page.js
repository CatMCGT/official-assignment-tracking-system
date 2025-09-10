import { getAllSubjects } from "@/db/subjects/getAllSubjects";
import MainLayout from "../../layout";
import CreateUser from "./CreateUser";

export default async function Page() {
  const allSubjects = await getAllSubjects();

  return (
    <div>
      <MainLayout.Header>User Management</MainLayout.Header>

      <div className="flex flex-row gap-10">
        <div>
          <CreateUser allSubjects={allSubjects} />
        </div>
      </div>
    </div>
  );
}
