"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function WorkspaceLinks({currentUser}) {
  const pathname = usePathname();

  return (
    <div>
        {currentUser?.role === "admin" ? (
          <Link
            href="/user-management"
            className={`nav-tab ${pathname === "/user-management" ? "active" : ""}`}
          >
            <HomeIcon className="size-6 text-text-weaker" />
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
        ) : (
          <div></div>
        )}
    </div>
  );
}