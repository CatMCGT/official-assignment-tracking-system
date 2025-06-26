"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

import CustomRadio from "@/components/customRadio";
import { getAllAssignments } from "@/db/assignments";
import { formatDate } from "@/libs/utils";

function Assignment() {
  return <div></div>;
}

export default function AssignmentDisplaySection() {
  const [view, setView] = useState("all");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getAllAssignments()
      .then((res) => {
        if (!res.success) throw res.message;

        setAssignments(JSON.parse(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch assignments:", err);
        setAssignments([]);
      });
  }, []);

  const assignmentEle = assignments.map((assignment) => {
    return (
      <div
        key={assignment.id}
        className="bg-white border-1 border-stroke-weak px-6 py-4 rounded"
      >
        <div className="flex flex-row gap-3">
          <p className="font-bold">{assignment.title}</p>
          <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center">
            <p className="uppercase text-xs font-semibold">
              {assignment.subjectInfo.subjectName}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <ClockIcon className="size-4 text-text-weaker" />
          <p className="text-sm text-text-weaker">
            {formatDate(assignment.due_date)}
          </p>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="flex flex-row gap-4 items-center">
        <p className="text-text-weakest">Show:</p>
        <CustomRadio
          options={[
            { id: "all", name: "All" },
            { id: "high-priority", name: "High Priority" },
          ]}
          optionSelected={view}
          setOptionSelected={setView}
        />
      </div>

      <div className="flex flex-col gap-9">
        <div className="bg-background-weak border-stroke-weak border-1 flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              Todo
            </p>
            <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
              2
            </div>
          </div>

          <div className="w-[680px]">{assignmentEle}</div>
        </div>
      </div>
    </div>
  );
}
