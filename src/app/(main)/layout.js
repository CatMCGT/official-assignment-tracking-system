import Navbar from '@/components/nav/Navbar'

export default function Layout({ children }) {
  return (
    <div className="h-screen flex flex-row">
      <Navbar />
      <main className="py-10 px-20 w-full">{children}</main>
    </div>
  )
}
