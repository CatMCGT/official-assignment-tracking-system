import MainLinksSection from "@/containers/nav-bar/mainLinks";
import UserDataSection from "@/containers/nav-bar/userData";

import { getCurrentUser } from "@/actions/userSession";

import NotificationProvider from "@/components/notification";
import WorkspaceLinks from "@/containers/nav-bar/workspaceLinks";

export default async function NavBarLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full flex flex-row">
      <div className="h-full">
        <nav className="bg-background-weak flex flex-col gap-7 px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weaker">
          <UserDataSection currentUser={currentUser} />

          <MainLinksSection />

          <div className="flex flex-col gap-3">
            <p className="text-sm text-text-weakest font-semibold">
              Workspaces
            </p>

            <WorkspaceLinks currentUser={currentUser}/>
          </div>
        </nav>
      </div>

      <NotificationProvider>
        <main className="py-10 px-20 w-full">{children}</main>
      </NotificationProvider>
    </div>
  );
}
