import { getUser } from "@/db/users/getUser";
import NavLinks from "./NavLinks";
import { getMonitoredSubjects } from "@/db/subjects/getMonitoredSubjects";
import { getTaughtSubjects } from "@/db/subjects/getTaughtSubjects";

export default async function Navbar() {
  const user = await getUser();
  const role = user.role;
  const taughtSubjects = await getTaughtSubjects();
  const monitoredSubjects = await getMonitoredSubjects();

  return (
    <NavLinks
      user={user}
      role={role}
      taughtSubjects={taughtSubjects}
      monitoredSubjects={monitoredSubjects}
    />
  );
}
