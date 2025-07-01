import AssignmentDisplaySection from "@/containers/student-page/assignments/AssignmentDisplay";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  return (
    <div className="h-full w-full">
      <div className="p-2 rounded bg-fill-weak w-fit">
        <BookOpenIcon className="size-9 text-text-strong" />
      </div>
      <h1 className="font-semibold text-2xl mt-4 mb-3">Assignments</h1>

      <div className="flex flex-row gap-10 items-start">
        <AssignmentDisplaySection />
      </div>
    </div>
  );
}
