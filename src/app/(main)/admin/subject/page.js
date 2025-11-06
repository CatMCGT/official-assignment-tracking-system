"use client";

import { useContext } from "react";
import MainLayout from "../../layout";
import CreateSubject from "./CreateSubject";
import AllSubjects from "./AllSubjects";

export default function Page() {
  const { allUsers, allSubjects } = useContext(AdminContext);

  return (
    <div>
      <MainLayout.Header>Subject Management</MainLayout.Header>

      <div className="flex flex-row gap-10">
        <CreateSubject allSubjects={allSubjects} allUsers={allUsers} />

        <AllSubjects allUsers={allUsers} allSubjects={allSubjects} />
      </div>
    </div>
  );
}
