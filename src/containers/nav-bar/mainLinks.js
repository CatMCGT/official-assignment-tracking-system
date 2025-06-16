"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, InboxIcon } from "@heroicons/react/24/outline";

export default function MainLinksSection() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/home"
        className={`nav-tab ${pathname === "/home" ? "active" : ""}`}
      >
        <HomeIcon className="size-6 text-text-weaker" />
        <p
          className={`font-bold mr-1 ml-3 ${
            pathname === "/home" ? "text-text-weak" : "text-text-weaker"
          }`}
        >
          Home
        </p>
      </Link>

      <Link
        href="/inbox"
        className={`nav-tab ${pathname === "/inbox" ? "active" : ""}`}
      >
        <InboxIcon className="size-6 text-text-weaker" />
        <p
          className={`font-bold mr-1 ml-3 ${
            pathname === "/inbox" ? "text-text-weak" : "text-text-weaker"
          }`}
        >
          Inbox
        </p>
      </Link>
    </div>
  );
}