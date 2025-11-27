"use client";

import Icon from "@/components/Icon";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import BulkActions from "./BulkActions";
import formatDate from "@/utils/formatDate";
import EditSubject from "./EditSubject";
import { updateSubjects } from "@/db/subjects/setSubject";

export default function AllSubjects({ allSubjects, allUsers }) {
  const [search, setSearch] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [updatedSubjects, setUpdatedSubjects] = useState(allSubjects);
  const [isEdited, setIsEdited] = useState(false);
  const [isPendingSave, setIsPendingSave] = useState(false);

  const [inspectingSubject, setInspectingSubject] = useState(null);

  const filteredSubjects = search
    ? updatedSubjects?.filter((subject) => {
        return (
          subject.name?.toLowerCase().includes(search.toLowerCase()) ||
          subject.grade?.toLowerCase().includes(search.toLowerCase()) ||
          subject.class?.toLowerCase().includes(search.toLowerCase()) ||
          subject.block?.toLowerCase().includes(search.toLowerCase()) ||
          subject.id?.toLowerCase().includes(search.toLowerCase()) ||
          subject.teacher_id?.toLowerCase().includes(search.toLowerCase()) ||
          subject.teacher_name?.toLowerCase().includes(search.toLowerCase()) ||
          subject.monitor_id?.toLowerCase().includes(search.toLowerCase()) ||
          subject.monitor_name?.toLowerCase().includes(search.toLowerCase())
        );
      })
    : updatedSubjects;

  function isSubjectEdited(subject) {
    const originalSubject = allSubjects.find((s) => s.id === subject.id);
    return originalSubject.deactivated_date !== subject.deactivated_date;
  }

  async function handleSubmit() {
    try {
      setIsPendingSave(true);
      await updateSubjects(
        updatedSubjects.filter((subject) => isSubjectEdited(subject))
      );
      setIsEdited(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPendingSave(false);
    }
  }

  async function handleUndo() {
    setUpdatedSubjects(allSubjects);
    setIsEdited(false);
  }

  return (
    <div className="flex flex-col gap-2 w-4xl">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="font-semibold text-xl">All Subjects</h2>
        <div className="w-6 h-6 text-sm text-text-weak bg-fill-weak rounded flex justify-center items-center">
          {updatedSubjects?.length}
        </div>
      </div>
      {!inspectingSubject ? (
        <div>
          <div className="flex flex-row justify-between items-center mb-2">
            <div></div>
            <div className="flex flex-row items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  className="border-1 border-stroke-weak rounded focus:outline-text-weaker focus:outline-1 h-8 pl-2 pr-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-0 top-0">
                  <Icon tooltip="Search">
                    <MagnifyingGlassIcon className="text-text-weak size-5" />
                  </Icon>
                </div>
              </div>

              {isEdited && !isPendingSave && (
                <button
                  className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak"
                  onClick={handleUndo}
                >
                  Undo
                </button>
              )}

              <button
                type="submit"
                className={clsx(
                  "px-4 py-[6px] text-white rounded-lg cursor-pointer transition-colors disabled:bg-text-weakest disabled:cursor-not-allowed",
                  isEdited ? "bg-text-weak" : "bg-text-weakest"
                )}
                disabled={isPendingSave || !isEdited}
                onClick={handleSubmit}
              >
                {isPendingSave ? (
                  <ArrowPathIcon className="size-6 text-white" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_4fr_2fr_5fr_5fr_3fr_1fr] items-center px-3 py-2 text-sm text-text-weak">
              {!search ? (
                <input
                  type="checkbox"
                  className="border-1 border-text-weak accent-text-weak"
                  checked={
                    selectedSubjectIds.length === updatedSubjects?.length
                  }
                  onChange={(e) =>
                    setSelectedSubjectIds(
                      e.target.checked ? filteredSubjects.map((u) => u.id) : []
                    )
                  }
                />
              ) : (
                <div></div>
              )}
              <p>ID</p>
              <p>Name</p>
              <p>Subject Teacher</p>
              <p>Subject Monitor</p>
              <p># of Enrolled Students</p>
            </div>
            <div className="flex flex-col gap-2 h-[340px] overflow-y-auto overflow-x-hidden">
              {filteredSubjects?.map((subject) => {
                return (
                  <div
                    key={subject.id}
                    className={clsx(
                      "grid grid-cols-[1fr_4fr_2fr_5fr_5fr_3fr_1fr] items-center border-1 rounded px-3 py-2",
                      isSubjectEdited(subject)
                        ? "border-neutral-500 bg-neutral-50 border-dashed"
                        : "border-stroke-weak"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="border-1 border-text-weak accent-text-weak cursor-pointer"
                      checked={selectedSubjectIds.includes(subject.id)}
                      onChange={() => {
                        if (selectedSubjectIds.includes(subject.id)) {
                          setSelectedSubjectIds((prev) =>
                            prev.filter((id) => id !== subject.id)
                          );
                        } else {
                          setSelectedSubjectIds((prev) => [
                            ...prev,
                            subject.id,
                          ]);
                        }
                      }}
                    />

                    <div className="flex flex-col items-start">
                      <p>{subject.id}</p>
                      {subject.deactivated_date !== null && (
                        <div className="w-fit">
                          <Icon
                            tooltip={formatDate(subject.deactivated_date)}
                            className="hover:bg-white"
                          >
                            <span className="text-red-500">(deactivated)</span>
                          </Icon>
                        </div>
                      )}
                    </div>

                    <p>{subject.name}</p>
                    <div className="w-fit">
                      <Icon tooltip={`#${subject.teacher_id}`}>
                        {subject.teacher_name}
                      </Icon>
                    </div>
                    <div className="w-fit">
                      <Icon tooltip={`#${subject.monitor_id}`}>
                        {subject.monitor_name}
                      </Icon>
                    </div>
                    <p>{subject?.students.length}</p>
                    <button onClick={() => setInspectingSubject(subject)}>
                      <Icon tooltip="See details">
                        <ArrowRightIcon className="size-4 text-text-weak" />
                      </Icon>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedSubjectIds.length > 0 && (
            <BulkActions
              selectedSubjectIds={selectedSubjectIds}
              setSelectedSubjectIds={setSelectedSubjectIds}
              updatedSubjects={updatedSubjects}
              setUpdatedSubjects={setUpdatedSubjects}
              setIsEdited={setIsEdited}
            />
          )}
        </div>
      ) : (
        <EditSubject
          subject={inspectingSubject}
          allUsers={allUsers}
          setInspectingSubject={setInspectingSubject}
        />
      )}
    </div>
  );
}
