"use client";

import {
  BookOpenIcon,
  UserIcon,
  ArchiveBoxArrowDownIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Fragment, useState } from "react";
import UserDisplaySection from "./UserDisplay";
import SubjectNavLink from "./SubjectNavLink";
import Feedback from "./Feedback";
import Icon from "../Icon";
import {
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

export default function NavLinks({
  user,
  role,
  taughtSubjects,
  monitoredSubjects,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const activatedTaughtSubjects = taughtSubjects.filter(
    (s) => s.deactivated_date === null
  );
  const deactivatedTaughtSubjects = taughtSubjects.filter(
    (s) => s.deactivated_date !== null
  );

  const activatedMonitoredSubjects = monitoredSubjects.filter(
    (s) => s.deactivated_date === null
  );
  const deactivatedMonitoredSubjects = monitoredSubjects.filter(
    (s) => s.deactivated_date !== null
  );

  return (
    <div className="h-full z-20">
      {!isOpen && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed top-10 right-8 xs:left-8"
        >
          <Icon tooltip="Open sidebar">
            <Bars3Icon className="size-5 text-text-weak hover:text-text-strong" />
          </Icon>
        </button>
      )}
      <nav
        className={`block max-md:absolute relative bg-background-weak flex flex-col justify-between px-5 py-4 w-64 h-dvh border-r-2 border-r-stroke-weak ${
          isOpen ? "" : "hidden"
        }`}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute top-[13px] right-[14px] z-50"
        >
          <Icon tooltip="Close sidebar">
            <ChevronDoubleLeftIcon className="size-5 text-text-weak hover:text-text-strong" />
          </Icon>
        </button>
        <div className="flex flex-col gap-5">
          <UserDisplaySection user={user} />

          <div>
            {user?.role === "student" && (
              <>
                <Link
                  href="/assignments"
                  className={clsx(
                    "nav-tab",
                    pathname === "/assignments" ? "active" : ""
                  )}
                >
                  <BookOpenIcon className="size-6 text-text-weaker" />
                  <p
                    className={clsx(
                      "font-bold mr-1 ml-3",
                      pathname === "/assignments"
                        ? "text-text-strong"
                        : "text-text-weaker"
                    )}
                  >
                    Assignments
                  </p>
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <div className="flex flex-col gap-4">
                <Link
                  href="/admin/user"
                  className={clsx(
                    "nav-tab",
                    pathname === "/admin/user" ? "active" : ""
                  )}
                >
                  <UserIcon className="size-6 text-text-weaker" />
                  <p
                    className={clsx(
                      "font-bold mr-1 ml-3",
                      pathname === "/admin/user"
                        ? "text-text-strong"
                        : "text-text-weaker"
                    )}
                  >
                    User management
                  </p>
                </Link>

                <Link
                  href="/admin/subject"
                  className={clsx(
                    "nav-tab",
                    pathname === "/admin/subject" ? "active" : ""
                  )}
                >
                  <BookOpenIcon className="size-6 text-text-weaker" />
                  <p
                    className={clsx(
                      "font-bold mr-1 ml-3",
                      pathname === "/admin/subject"
                        ? "text-text-strong"
                        : "text-text-weaker"
                    )}
                  >
                    Subject management
                  </p>
                </Link>
              </div>
            )}
          </div>

          {role === "teacher" && activatedTaughtSubjects.length > 0 && (
            <div>
              <div>
                <p className="text-sm text-text-weak tracking-wide">
                  Taught Subjects
                </p>
                <div className="flex flex-col gap-2 mt-3">
                  {activatedTaughtSubjects.map((subject) => (
                    <Fragment key={subject.id}>
                      <SubjectNavLink subject={subject} action="teach" />
                    </Fragment>
                  ))}
                </div>
              </div>

              {deactivatedTaughtSubjects.length > 0 && (
                <Link href="/deactivated" className="nav-tab mt-10 hover:mt-9">
                  <ArchiveBoxArrowDownIcon className="size-6 text-text-weaker" />
                  <p className="font-bold mr-1 ml-3 text-text-weak">
                    Deactivated Subjects
                  </p>
                </Link>
              )}
            </div>
          )}

          {role === "student" && activatedMonitoredSubjects.length > 0 && (
            <div>
              <p className="text-sm text-text-weak tracking-wide">
                Monitored Subjects
              </p>
              <div className="flex flex-col gap-2 mt-3">
                {activatedMonitoredSubjects.map((subject) => (
                  <Fragment key={subject.id}>
                    <SubjectNavLink subject={subject} action="monitor" />
                  </Fragment>
                ))}
              </div>

              {deactivatedMonitoredSubjects.length > 0 && (
                <Link href="/deactivated" className="nav-tab mt-10 hover:mt-9">
                  <ArchiveBoxArrowDownIcon className="size-6 text-text-weaker" />
                  <p className="font-bold mr-1 ml-3 text-text-weak">
                    Deactivated Subjects
                  </p>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="">
          <Feedback />
          <p className="text-text-weak">© 2025 Lau Ka Yue</p>
        </div>
      </nav>
    </div>
  );
}
