"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getAllSubjects } from "@/db/subjects";
import { getAllUsers } from "@/db/users";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [allUserData, setAllUserData] = useState([]);
  const [allSubjectData, setAllSubjectData] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        if (!res.success) throw res.message;

        setAllUserData(JSON.parse(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch teacher subjects:", err);
        setAllUserData([]);
      });

    getAllSubjects()
      .then((res) => {
        if (!res.success) throw res.message;

        setAllSubjectData(JSON.parse(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch teacher subjects:", err);
        setAllSubjectData([]);
      });
  }, []);

  return (
    <AdminContext value={{ allUserData, allSubjectData }}>
      {children}
    </AdminContext>
  );
}

export function useFetchAdminDatabase() {
  return useContext(AdminContext);
}
