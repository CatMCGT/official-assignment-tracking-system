"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import CustomSelect from "@/components/customSelect";
import toTitleCase from "@/lib/toTitleCase";
import { getAllSubjects, getSubjectInfoFromId } from "@/lib/subjectManagement";

export default function TeacherSubjectsSelect({
  teacherSubjects,
  setTeacherSubjects,
}) {
  const [openTeacherSubjectsSelect, setOpenTeacherSubjectsSelect] =
    useState(false);
  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    getAllSubjects().then((response) => {
      setAllSubjects(JSON.parse(response?.data) || []);
    });
  }, []);

  const subjectsArray = allSubjects?.map((subject) => {
    return {
      id: subject.id,
      title: subject.subjectName,
      subtitle: `G${subject.grade} | block ${subject.block}` || subject.class,
    };
  });

  return (
    <div className="relative">
      <label className="text-sm w-full">Subjects*</label>
      <div
        className="flex flex-row gap-2 px-4 py-1.5 items-center justify-center bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] text-text-weak focus:outline-2 focus:outline-stroke-weak w-fit mt-2"
        onClick={() => setOpenTeacherSubjectsSelect((prev) => !prev)}
      >
        <p>
          {teacherSubjects.length > 0
            ? teacherSubjects.map((subject) => subject.toUpperCase()).join(", ")
            : "None"}
        </p>
        <ChevronDownIcon
          className={`size-4 ${openTeacherSubjectsSelect && "rotate-180"}`}
        />
      </div>

      {openTeacherSubjectsSelect && (
        <div className="absolute top-19 left-0 z-10">
          <CustomSelect
            options={subjectsArray}
            optionsSelect={teacherSubjects}
            setOptionsSelect={setTeacherSubjects}
            placeholder="Search subjects..."
            multiSelect={true}
          />
        </div>
      )}
    </div>
  );
}
