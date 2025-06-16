"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function WorkspaceLinks({ currentUser }) {
  const pathname = usePathname();

  return (
    <div>
      {currentUser?.role === "admin" ? (
        <div className="flex flex-col gap-3">
          <Link
            href="/user-management"
            className={`nav-tab ${
              pathname === "/user-management" ? "active" : ""
            }`}
          >
            <UserIcon className="size-6 text-text-weaker" />
            <p
              className={`font-bold mr-1 ml-3 ${
                pathname === "/user-management"
                  ? "text-text-weak"
                  : "text-text-weaker"
              }`}
            >
              User Management
            </p>
          </Link>

          <Link
            href="/subject-management"
            className={`nav-tab ${pathname === "/subject-management" ? "active" : ""}`}
          >
            <AcademicCapIcon className="size-6 text-text-weaker" />
            <p
              className={`font-bold mr-1 ml-3 ${
                pathname === "/subject-management"
                  ? "text-text-weak"
                  : "text-text-weaker"
              }`}
            >
              Subject Management
            </p>
          </Link>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
