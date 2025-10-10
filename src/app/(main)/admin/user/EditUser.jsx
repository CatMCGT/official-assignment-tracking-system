import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState, useActionState } from "react";
import Select from "@/components/Select";
import toTitleCase from "@/utils/toTitleCase";
import Icon from "@/components/Icon";
import { checkSubjectChanges } from "@/utils/checkSubjectChanges";
import { setStudentSubject } from "@/db/subjects/setStudentSubject";
import { setUsers } from "@/db/users/setUsers";
import { setSubjectTeacher } from "@/db/subjects/setSubjectTeacher";
import { useRouter } from "next/navigation";

export default function EditUser({ user, allSubjects, setInspectingUser }) {
  const router = useRouter();
  const originalEnrolled = allSubjects.filter((subject) =>
    subject.students.includes(user.id)
  );

  const [enrolledSubjectIds, setEnrolledSubjectIds] = useState(
    originalEnrolled.map((s) => s.id)
  );

  const originalTaught = allSubjects.filter(
    (subject) => subject.teacher_id === user.id
  );
  const [taughtSubjectIds, setTaughtSubjectIds] = useState(
    originalTaught.map((s) => s.id)
  );

  const availableSubjectsToTeach = allSubjects.filter(
    (s) => s.teacher_id === null
  );

  const originalName = user.name;
  const [updatedName, setUpdatedName] = useState(originalName);

  const isEdited =
    (user.role === "student"
      ? originalEnrolled.map((s) => s.id).toString() !==
        enrolledSubjectIds.toString()
      : user.role === "teacher"
      ? originalTaught.map((s) => s.id).toString() !==
        taughtSubjectIds.toString()
      : false) || originalName !== updatedName;
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    try {
      setIsPending(true);
      const subjectChanges = checkSubjectChanges(
        user,
        originalEnrolled.map((s) => s.id),
        enrolledSubjectIds,
        originalTaught.map((s) => s.id),
        taughtSubjectIds
      );

      if (originalName !== updatedName) {
        await setUsers([
          {
            ...user,
            name: updatedName,
          },
        ]);
      }

      if (user.role === "student") {
        await setStudentSubject(user.id, subjectChanges);
      } else if (user.role === "teacher") {
        await setSubjectTeacher(user.id, subjectChanges);
      }

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  async function handleUndo() {
    setUpdatedName(originalName);
    if (user.role === "student") {
      setEnrolledSubjectIds(originalEnrolled.map((s) => s.id));
    } else if (user.role === "teacher") {
      setTaughtSubjectIds(originalTaught.map((s) => s.id));
    }
  }

  return (
    <div className="flex flex-row gap-4 items-start border-1 rounded border-stroke-weak p-4">
      <button
        onClick={() => setInspectingUser(null)}
        disabled={isPending || isEdited}
      >
        {isPending || isEdited ? (
          <Icon className="hover:bg-white">
            <ArrowLeftIcon className="size-4 text-text-weak" />
          </Icon>
        ) : (
          <Icon tooltip="Back">
            <ArrowLeftIcon className="size-4 text-text-weak" />
          </Icon>
        )}
      </button>
      <div className="p-4 pt-0 pl-0 w-72">
        <h2 className="text-lg font-bold mb-3">Edit User #{user.id}</h2>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <label>Role</label>
            <div className="px-3 py-2 border-1 border-stroke-weak rounded-xs mt-1 cursor-not-allowed">
              {toTitleCase(user.role)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="userId">Name</label>
            <input
              type="text"
              className="px-3 py-2 bg-fill-weak rounded-xs placeholder:text-text-weaker text-text-strong focus:outline-1 focus:outline-text-weakest"
              placeholder="Name"
              id="name"
              name="name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </div>

          {/* <div className="flex flex-col gap-1">
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            className="px-3 py-2 rounded-xs placeholder:text-text-weaker text-text-weaker disabled:cursor-not-allowed"
            placeholder="Password"
            id="password"
            name="password"
            value="four"
            disabled
          />
        </div> */}

          {user.role === "student" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="subjects">Enrolled Subjects</label>
              <Select
                options={allSubjects}
                selected={enrolledSubjectIds}
                setSelected={setEnrolledSubjectIds}
                placeholder="No enrolled subjects"
                allowSearch
                multiSelect
                showId
              />
            </div>
          )}

          {user.role === "teacher" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="subjects">Taught Subjects</label>
              <Select
                options={[...originalTaught, ...availableSubjectsToTeach]}
                selected={taughtSubjectIds}
                setSelected={setTaughtSubjectIds}
                placeholder="No taught subjects"
                allowSearch
                multiSelect
                showId
              />
            </div>
          )}

          {/* {createUserState?.message && (
          <p
            className={clsx(
              'font-bold text-sm mt-0' && true,
              createUserState?.success ? 'text-green-400' : 'text-red-400'
            )}
          >
            {createUserState.message}
          </p>
        )} */}

          <div className="flex flex-row gap-2">
            {isEdited && !isPending && (
              <button
                className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak w-fit"
                onClick={handleUndo}
              >
                Undo
              </button>
            )}

            <button
              type="submit"
              className={clsx(
                "px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed w-fit",
                isEdited ? "bg-text-weak" : "bg-text-weakest"
              )}
              disabled={isPending || !isEdited}
              onClick={handleSubmit}
            >
              {isPending ? (
                <ArrowPathIcon className="size-6 text-white" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
