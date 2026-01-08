"use client";

import { useEffect, useState } from "react";
import Radio from "@/components/Radio";
import Icon from "@/components/Icon";
import {
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import formatDate from "@/utils/formatDate";
import { setCollectedAssignments } from "@/db/assignments/setCollectedAssignments.js";
import Select from "@/components/Select";
import Link from "next/link";
import Statistics from "./Statistics";
import Form from "next/form";

export default function AssignmentStatus({ assignment, students, userRole }) {
  const [updatedStudents, setUpdatedStudents] = useState(students);
  const studentIds = students.map((s) => s.id);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [isPendingSave, setIsPendingSave] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isStatsOpened, setIsStatsOpened] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (
      updatedStudents.length > 0 &&
      JSON.stringify(updatedStudents) != JSON.stringify(students)
    ) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [updatedStudents]);

  useEffect(() => {
    setUpdatedStudents(students);
    setIsPendingSave(false);
  }, [students]);

  const [selectedView, setSelectedView] = useState("all");
  const viewOptions = [
    { id: "all", name: "All" },
    { id: "late", name: "Late" },
    { id: "submitted", name: "Submitted" },
    { id: "absent", name: "Absent" },
  ];

  const [search, setSearch] = useState("");

  async function handleSubmit() {
    try {
      setIsPendingSave(true);

      updatedStudents.forEach((student) => {
        if (student.grade > assignment.assignment_grade || student.grade < 0) {
          throw new Error(`Grade out of range for student #${student.id}`);
        }
      });

      await setCollectedAssignments(
        assignment.subject_id,
        assignment.assignment_id,
        updatedStudents
      );
    } catch (err) {
      console.error(err);
      setIsPendingSave(false);
    }
  }

  function markAllSubmitted() {
    setIsMenuOpened(false);
    setUpdatedStudents((prev) => {
      const updated = prev.map((student) => {
        if (student.collected_date === null) {
          return {
            ...student,
            status: "submitted",
            collected_date: new Date(),
          };
        }

        return student;
      });
      return updated;
    });
  }

  function closeMenus() {
    setIsMenuOpened(false);
    setIsStatsOpened(false);
  }

  return (
    <Form onClick={closeMenus}>
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center md:w-[940px]">
        <Radio
          options={viewOptions}
          selected={selectedView}
          setSelected={setSelectedView}
        />

        <div className="flex flex-row items-center gap-2">
          <div className="relative">
            <input
              type="text"
              name="search bar"
              className="border-1 border-stroke-weak rounded focus:outline-text-weaker focus:outline-1 h-8 pl-2 pr-8"
              value={search}
              placeholder="Search records..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-0 top-0">
              <Icon tooltip="Search">
                <MagnifyingGlassIcon className="text-text-weak size-5" />
              </Icon>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsStatsOpened((prev) => !prev);
              }}
            >
              <Icon tooltip={isStatsOpened ? null : "Statistics"} border>
                <ChartBarIcon className="text-text-weak size-5" />
              </Icon>
            </button>

            {isStatsOpened && (
              <Statistics
                updatedStudents={updatedStudents}
                assignment={assignment}
              />
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpened((prev) => !prev);
              }}
            >
              <Icon tooltip={isMenuOpened ? null : "More actions"}>
                <EllipsisVerticalIcon className="text-text-weak size-5" />
              </Icon>
            </button>

            {isMenuOpened && (
              <div
                className="border-1 border-stroke-weak bg-white py-1.5 px-2 rounded absolute right-[-4px] top-10 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="flex flex-row gap-2 items-center rounded hover:bg-fill-weak cursor-pointer py-1 px-2 transition-colors"
                  onClick={markAllSubmitted}
                >
                  <CheckCircleIcon className="size-5 text-text-weak" />
                  <p className="text-nowrap">Mark all as submitted</p>
                </button>
              </div>
            )}
          </div>

          {isEdited && !isPendingSave && (
            <button
              className="px-4 py-[6px] rounded-lg cursor-pointer transition-colors bg-fill-weak text-text-weak"
              onClick={() => {
                setUpdatedStudents(students);
              }}
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

      {errorMessage && (
        <p className="font-bold text-sm mt-0 text-red-400">{errorMessage}</p>
      )}

      <div className="flex flex-col gap-2 mt-2 overflow-auto">
        <div className="grid grid-cols-[180px_120px_180px_300px_100px_auto] items-center px-3 py-2 text-sm text-text-weak">
          {/* <input
            type="checkbox"
            name="master checkbox"
            className="border-1 border-text-weak accent-text-weak"
            checked={selectedStudents.length === studentIds.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedStudents(studentIds)
              } else {
                setSelectedStudents([])
              }
            }}
          /> */}
          <p>Name</p>
          <p>ID</p>
          <p>Collected date</p>
          <p>Status</p>
          {userRole === "teacher" && assignment.assignment_grade && (
            <p>Grade</p>
          )}
        </div>
        <div className="flex flex-col gap-2 max-h-[400px] w-fit">
          {updatedStudents
            ?.filter((student) => {
              if (selectedView === "all") return true;
              if (selectedView === "late") {
                return (
                  new Date(student.collected_date) >
                  new Date(assignment.due_date)
                );
              }
              if (selectedView === "submitted") {
                return student.status === "submitted";
              }
              if (selectedView === "absent") {
                return student.status === "absent";
              }
            })
            .map((student) => {
              const late =
                new Date(student.collected_date) >
                new Date(assignment.due_date);

              return (
                <div
                  key={student.id}
                  className={clsx(
                    "grid grid-cols-[180px_120px_180px_300px_100px_auto] items-center border-1 rounded px-3 py-2",
                    student.collected_date && "border-dashed",
                    late
                      ? "border-red-500 bg-red-50"
                      : student.collected_date
                      ? "border-green-500 bg-green-50"
                      : "border-stroke-weak"
                  )}
                  hidden={
                    search.length > 0 &&
                    !(
                      student.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      student.id.toLowerCase().includes(search.toLowerCase())
                    )
                  }
                >
                  {/* <input
                    type="checkbox"
                    name={`checkbox for student id ${student.id}`}
                    className="border-1 border-text-weak accent-text-weak"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => {
                      if (selectedStudents.includes(student.id)) {
                        setSelectedStudents((prev) =>
                          prev.filter((id) => id !== student.id)
                        )
                      } else {
                        setSelectedStudents((prev) => [...prev, student.id])
                      }
                    }}
                  /> */}
                  <p className="">{student.name}</p>
                  <p className="text-text-weak text-sm">#{student.id}</p>
                  <p className="text-sm">
                    {student.collected_date
                      ? formatDate(student.collected_date)
                      : "-"}
                  </p>

                  <div className="bg-white w-60">
                    <Select
                      options={[
                        { id: null, name: "Not submitted 📄" },
                        { id: "submitted", name: "Submitted ✅" },
                        { id: "absent", name: "Absent 😷" },
                      ]}
                      selected={[student.status]}
                      setSelected={(newStatus) =>
                        setUpdatedStudents((prev) =>
                          prev.map((s) =>
                            s.id === student.id
                              ? {
                                  ...s,
                                  status: newStatus,
                                  collected_date: [
                                    "submitted",
                                    "late",
                                  ].includes(newStatus)
                                    ? new Date()
                                    : null,
                                }
                              : s
                          )
                        )
                      }
                    />
                  </div>

                  {userRole === "teacher" && (
                    <>
                      {assignment.assignment_grade && (
                        <div>
                          <input
                            type="number"
                            className="w-12 px-1 border-1 border-stroke-weak bg-white rounded focus:outline-1 focus:outline-text-weakest"
                            min="0"
                            max={assignment.assignment_grade}
                            value={student.grade != null ? student.grade : ""}
                            onChange={(e) => {
                              setUpdatedStudents((prev) => {
                                return prev.map((s) => {
                                  if (s.id === student.id) {
                                    return {
                                      ...s,
                                      grade: e.target.value,
                                    };
                                  } else {
                                    return s;
                                  }
                                });
                              });
                            }}
                          />{" "}
                          / {assignment.assignment_grade}
                        </div>
                      )}
                      <div className="w-fit">
                        <Link
                          href={`/monitor/${assignment.subject_id}/${assignment.assignment_id}/${student.id}`}
                        >
                          <Icon tooltip="See details">
                            <ArrowUpRightIcon className="size-4 text-text-weak" />
                          </Icon>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </Form>
  );
}
