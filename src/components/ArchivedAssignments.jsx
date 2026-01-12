"use client";

import Link from "next/link";
import {
  ClockIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";
import formatDate from "@/utils/formatDate";
import { useState } from "react";

export default function ArchivedAssignments({
  archived,
  subjectId,
  subjectInfo,
}) {
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex flex-row gap-[6px] items-center">
        <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
          Expired
        </p>
        <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
          {archived.length}
        </div>
        <button
          type="button"
          className="ml-2"
          onClick={() => setIsArchivedOpen((prev) => !prev)}
        >
          <Icon>
            {isArchivedOpen ? (
              <ChevronUpIcon className="size-4 text-text-weak" />
            ) : (
              <ChevronRightIcon className="size-4 text-text-weak" />
            )}
          </Icon>
        </button>
      </div>

      {isArchivedOpen && (
        <div className="max-w-[400px] md:max-w-2xl flex flex-col gap-4">
          {archived.map((a) => {
            const submittedCount = a.students.filter(
              (student) => student.collected_date !== null
            ).length;
            const stats = {
              submitted: submittedCount,
              not_submitted: a.students.length - submittedCount,
            };

            return (
              <Link
                href={`/monitor/${subjectId}/${a.assignment_id}`}
                key={a.assignment_id}
              >
                <div className="bg-white border-1 border-stroke-weak px-6 py-4 rounded cursor-pointer hover:border-text-weakest transition-colors">
                  <div className="flex flex-col gap-1 mb-3 sm:flex-row sm:gap-3 sm:mb-0">
                    <p className="font-bold">{a.assignment_title}</p>
                    <div
                      className="px-5 py-[5px] rounded-full w-fit flex justify-center items-center uppercase text-xs font-semibold"
                      style={{ backgroundColor: subjectInfo.color }}
                    >
                      {subjectInfo.name}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-2 sm:flex-row sm:gap-3 sm:mb-0">
                    <div className="flex flex-row gap-1 items-center">
                      <ClockIcon className="size-4 text-text-weaker" />
                      <p className="text-sm text-text-weak">
                        {formatDate(a.due_date)}
                      </p>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                      <CheckCircleIcon className="size-4 text-text-weaker" />
                      <p className="text-sm text-text-weak">
                        {stats.submitted} Submitted, {stats.not_submitted} Left
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
