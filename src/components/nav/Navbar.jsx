import { getUser } from '@/db/users/getUser'
import UserDisplaySection from './UserDisplay'
import NavLinks from './NavLinks'

export default async function Navbar() {
  const user = await getUser()

  return (
    <div className="h-full">
      <nav className="bg-background-weak flex flex-col gap-5 px-5 py-4 w-64 h-full border-r-2 border-r-stroke-weak">
        <UserDisplaySection user={user} />

        <NavLinks user={user} />
      </nav>
    </div>
  )
}
