import Navbar from "@/components/nav/Main";
import { BookOpenIcon } from "@heroicons/react/20/solid";

export default function MainLayout({ children }) {
  return (
    <div className="h-screen flex flex-row">
      <Navbar />
      <main className="py-10 px-20 w-full">{children}</main>
    </div>
  );
}

function Header({ children }) {
  return (
    <div>
      <BookOpenIcon className="size-9 text-text-strong p-2 rounded bg-fill-weak w-fit" />
      <h1 className="font-semibold text-2xl mt-4 mb-3">{children}</h1>
    </div>
  );
}

MainLayout.Header = Header;

function Body({ children }) {
  return <div className="flex flex-col gap-10 items-start">{children}</div>;
}

MainLayout.Body = Body;
