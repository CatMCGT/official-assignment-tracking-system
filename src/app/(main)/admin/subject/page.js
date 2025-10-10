"use client";

import { AdminContext } from "@/hooks/useAdmin";
import { useContext } from "react";
import MainLayout from "../../layout";
import CreateSubject from "./CreateSubject";

export default function Page() {
  const { allUsers, allSubjects } = useContext(AdminContext);
  return (
    <div>
      <MainLayout.Header>Subject Management</MainLayout.Header>

      <CreateSubject allSubjects={allSubjects} allUsers={allUsers} />
    </div>
  );
}
