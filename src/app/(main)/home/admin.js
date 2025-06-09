import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function AdminPage() {
  return (
    <div>
      <div className="flex flex-row gap-4 items-center">
        <p className="text-sm text-text-weakest">Show me</p>
        <div className="flex flex-row gap-1 px-3 py-2 bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] transition-colors">
          <p className="text-text-weak">All Users</p>
          <ChevronDownIcon className="size-6 text-text-weaker" />
        </div>
      </div>
    </div>
  );
}
