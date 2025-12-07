"use server"

import { getAllSubjects } from "@/db/subjects/getAllSubjects";
import { getAllUsers } from "@/db/users/getAllUsers";
import MainLayout from "../../layout";
import CreateUser from "./CreateUser";
import AllUsers from "./AllUsers";
import BulkCreateUsers from "./BulkCreateUsers";

export default async function Page() {
  const allSubjects = await getAllSubjects()
  const allUsers = await getAllUsers()

  return (
    <div>
      <MainLayout.Header>User Management</MainLayout.Header>

      <div className="flex flex-row gap-10">
        <div className="flex flex-col gap-4">
          <CreateUser allSubjects={allSubjects} />
          <BulkCreateUsers />
        </div>

        <AllUsers allUsers={allUsers} allSubjects={allSubjects} />
      </div>
    </div>
  );
}
