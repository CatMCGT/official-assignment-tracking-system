"use client";

import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import CustomFormInput from "@/components/customFormInput";
import CustomSelect from "@/components/customSelect";
import CustomRadio from "@/components/customRadio";
import { createSubject } from "@/db/subjects";
import { subjectNameShorthands } from "@/libs/utils";

export default function AddSubjectFormSection() {
  const [addSubjectState, addSubjectAction, isPending] = useActionState(
    createSubject,
    null
  );
  const [subjectType, setSubjectType] = useState("class");
  const [subjectName, setSubjectName] = useState(["chi"]);
  const [openSubjectNameSelect, setOpenSubjectNameSelect] = useState(false);

  //   Class/ Grade, name, (block), teacherId (with info for admin)

  let subjectNameOptions = [];
  for (const [key, value] of Object.entries(subjectNameShorthands)) {
    console.log(key, value);
    subjectNameOptions.push({ id: key, title: value });
  }

  return (
    <Form
      action={addSubjectAction}
      className="border-1 border-stroke-weak px-6 py-5 flex flex-col items-end gap-4 w-fit"
    >
      <h2 className="font-bold w-full text-lg">Create Subject</h2>
      <CustomRadio
        options={[
          { id: "class", name: "Class" },
          { id: "grade", name: "Grade" },
        ]}
        optionSelected={subjectType}
        setOptionSelected={setSubjectType}
      />
      {subjectType === "class" && (
        <div className="flex flex-col gap-3 w-70">
          <CustomFormInput title="Class*" placeholder="Class" name="class" />
        </div>
      )}

      {subjectType === "grade" && (
        <div className="flex flex-col gap-3 w-70"></div>
      )}

      <div className="w-full flex flex-col gap-1 relative">
        <label className="text-sm w-full">Subject name*</label>

        <div
          className="flex flex-row gap-2 px-4 py-1.5 items-center justify-center bg-fill-weak rounded cursor-pointer hover:bg-[#f0f0f0] text-text-weak focus:outline-2 focus:outline-stroke-weak w-fit mt-2"
          onClick={() => setOpenSubjectNameSelect((prev) => !prev)}
        >
          <p>
            {subjectName.length > 0
              ? subjectName
                  .map((name) => subjectNameShorthands[name])
                  .join(", ")
              : "None"}
          </p>
          <ChevronDownIcon
            className={`size-4 ${openSubjectNameSelect && "rotate-180"}`}
          />
        </div>

        {openSubjectNameSelect && (
          <div className="absolute top-19 left-0 z-10">
            <CustomSelect
              options={subjectNameOptions}
              optionsSelect={subjectName}
              setOptionsSelect={setSubjectName}
            />
          </div>
        )}
      </div>
    </Form>
  );
}
