import { Fragment } from "react";

import { getUser } from "@/db/users/getUser";
import UserDisplaySection from "./UserDisplay";
import NavLinks from "./NavLinks";
import { getMonitoredSubjects } from "@/db/subjects/getMonitoredSubjects";
import SubjectNavLink from "./SubjectNavLink";
import { getTaughtSubjects } from "@/db/subjects/getTaughtSubjects";

export default async function Navbar() {
  const user = await getUser();
  const role = user.role;
  const taughtSubjects = await getTaughtSubjects();
  const monitoredSubjects = await getMonitoredSubjects();

  return (
    <div className="h-full fixed z-100">
      <nav className="bg-background-weak flex flex-col gap-5 px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weak">
        <UserDisplaySection user={user} />

        <NavLinks user={user} />

        {role === "teacher" && taughtSubjects.length > 0 && (
          <div>
            <p className="text-sm text-text-weak tracking-wide">
              Taught Subjects
            </p>
            <div className="flex flex-col gap-2 mt-3">
              {taughtSubjects.map((subject) => (
                <Fragment key={subject.subject_id}>
                  <SubjectNavLink subject={subject} action="teach" />
                </Fragment>
              ))}
            </div>
          </div>
        )}

        {role === "student" && monitoredSubjects.length > 0 && (
          <div>
            <p className="text-sm text-text-weak tracking-wide">
              Monitored Subjects
            </p>
            <div className="flex flex-col gap-2 mt-3">
              {monitoredSubjects.map((subject) => (
                <Fragment key={subject.subject_id}>
                  <SubjectNavLink subject={subject} action="monitor" />
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
