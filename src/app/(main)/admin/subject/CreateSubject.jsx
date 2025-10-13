import Radio from "@/components/Radio";
import Select from "@/components/Select";
import Form from "next/form";
import { useState } from "react";
import { subjectShorthands } from "@/utils/getSubjectInfo";

export default function CreateSubject({ allUsers, allSubjects }) {
  const [subjectType, setSubjectType] = useState("grade");
  const [subjectTeacherId, setSubjectTeacherId] = useState(null);
  const [subjectShorthand, setSubjectShorthand] = useState(null);

  const allTeachers = allUsers?.filter((user) => user.role === "teacher");
  const allStudents = allUsers?.filter((user) => user.role === "student");

  const subjectShorthandOptions = Object.keys(subjectShorthands).map(
    (shorthand) => {
      return {
        id: shorthand,
        name: subjectShorthands[shorthand],
      };
    }
  );

  return (
    <Form className="border-1 border-stroke-weak rounded p-4 w-72">
      <h2 className="text-lg font-bold mb-3">Create Subject</h2>

      <Radio
        options={[
          {
            id: "grade",
            name: "Grade",
          },
          {
            id: "class",
            name: "Class",
          },
        ]}
        selected={subjectType}
        setSelected={setSubjectType}
      />

      <div className="flex flex-row justify-between items-center mt-3">
        <label htmlFor="grade">
          Grade <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          className="w-12 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
          min="1"
          max="12"
          id="grade"
          required
        />
      </div>

      <div className="flex flex-row justify-between items-center mt-3">
        <label htmlFor="block">
          Block <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          className="w-12 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
          min="1"
          max="4"
          id="block"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subjectName">Subject</label>
        <Select
          options={subjectShorthandOptions}
          selected={subjectShorthand}
          setSelected={setSubjectShorthand}
          placeholder="No selected subject"
          allowSearch
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subjects">Subject Teacher</label>
        <Select
          options={allTeachers}
          selected={subjectTeacherId}
          setSelected={setSubjectTeacherId}
          placeholder="No subject teacher"
          allowSearch
          showId
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subjects">Enrolled students</label>
        <Select
          options={allTeachers}
          selected={subjectTeacherId}
          setSelected={setSubjectTeacherId}
          placeholder="No subject teacher"
          allowSearch
          showId
        />
      </div>
    </Form>
  );
}
