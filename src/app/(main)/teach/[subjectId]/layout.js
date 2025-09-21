import { getUser } from "@/db/users/getUser"

export default async function MainLayout({ children }) {
  const user = await getUser()
  const role = user.role

  if (role !== "teacher") {
    return <p>You do not have the rights to access this page.</p>
  }

  return <>{children}</>
}
