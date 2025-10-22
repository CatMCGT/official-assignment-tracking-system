"use client";

import Icon from "@/components/Icon";
import {
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

export default function AllSubjects({ allSubjects, allUsers }) {
  const [search, setSearch] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const filteredSubjects = search
    ? allSubjects?.filter((subject) => {
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
    : allSubjects;

  return (
    <div className="flex flex-col gap-2 w-4xl">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="font-semibold text-xl">All Subjects</h2>
        <div className="w-6 h-6 text-sm text-text-weak bg-fill-weak rounded flex justify-center items-center">
          {allSubjects?.length}
        </div>
      </div>

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

            <div className="relative">
              <button type="button">
                <Icon tooltip="Statistics" border>
                  <ChartBarIcon className="text-text-weak size-5" />
                </Icon>
              </button>
            </div>

            <div className="relative">
              <button type="button">
                <Icon tooltip="More actions">
                  <EllipsisVerticalIcon className="text-text-weak size-5" />
                </Icon>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_2fr_3fr_5fr_5fr_3fr] items-center px-3 py-2 text-sm text-text-weak">
            {!search ? (
              <input
                type="checkbox"
                className="border-1 border-text-weak accent-text-weak"
                checked={selectedSubjectIds.length === allSubjects?.length}
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
            <p>Enrolled Students</p>
          </div>
          <div className="flex flex-col gap-2 h-[340px] overflow-y-auto overflow-x-hidden">
            {filteredSubjects?.map((subject) => {
              return (
                <div
                  key={subject.id}
                  className={clsx(
                    "grid grid-cols-[1fr_2fr_3fr_5fr_5fr_3fr] items-center border-1 rounded px-3 py-2",
                    false
                      ? "border-green-500 bg-green-50 border-dashed"
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
                        setSelectedSubjectIds((prev) => [...prev, subject.id]);
                      }
                    }}
                  />

                  <p>{subject.id}</p>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
