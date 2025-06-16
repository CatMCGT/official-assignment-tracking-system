import NavTabs from "@/components/navTabs";
import NavUserData from "@/components/navUserData";

import { getCurrentUser } from "@/lib/userSession";

import NotificationProvider from "@/components/notification";

export default async function NavBarLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full flex flex-row">
      <div className="h-full">
        <nav className="bg-background-weak flex flex-col gap-7 px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weaker">
          <NavUserData currentUser={currentUser} />

          <NavTabs />

          <div>
            <p className="text-sm text-text-weakest font-semibold">
              Workspaces
            </p>
          </div>
        </nav>
      </div>

      <NotificationProvider>
        <main className="py-10 px-20 w-full">{children}</main>
      </NotificationProvider>
    </div>
  );
}
