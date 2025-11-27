import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  HashtagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import formatDate from "@/utils/formatDate";
import { getMonitoredAssignments } from "@/db/assignments/getMonitoredAssignments";
import MainLayout from "../../layout";
import getSubjectInfo from "@/utils/getSubjectInfo";
import Link from "next/link";
import ArchivedAssignments from "../../../../components/ArchivedAssignments";
import Properties from "../../../../components/Properties";
import { Suspense } from "react";
import Loading from "./loading";
import { getMonitoredSubjects } from "@/db/subjects/getMonitoredSubjects";

export async function generateMetadata({ params }) {
  const { subjectId } = await params;

  return {
    title: `${subjectId}`,
  };
}

export default async function Page({ params }) {
  const { subjectId } = await params;
  const subjectInfo = getSubjectInfo(subjectId);
  const subjectAssignments = await getMonitoredAssignments(subjectId);

  let subjectAdmin = {};
  let numOfStudents = 0;
  if (subjectAssignments.length > 0) {
    subjectAdmin = {
      teacher_id: subjectAssignments[0].teacher_id,
      teacher_name: subjectAssignments[0].teacher_name,
      monitor_id: subjectAssignments[0].monitor_id,
      monitor_name: subjectAssignments[0].monitor_name,
    };
    numOfStudents = subjectAssignments[0].number_of_students;
  } else {
    const details = (await getMonitoredSubjects()).filter(
      (subject) => subject.id === subjectId
    );
    subjectAdmin = details[0];
    numOfStudents = details[0].number_of_students;
  }

  const inProgress = subjectAssignments?.filter(
    (a) => new Date(a.due_date) >= new Date()
  );
  const archived = subjectAssignments?.filter(
    (a) => new Date(a.due_date) < new Date()
  );

  return (
    <Suspense fallback={<Loading />}>
      <MainLayout.Header>
        <div className="flex flex-row gap-3 mb-2">
          {subjectInfo.grade
            ? `Grade ${subjectInfo.grade}`
            : `Class ${subjectInfo.class}`}{" "}
          {subjectInfo.name} {subjectInfo.block && `Block ${subjectInfo.block}`}
          <div className="px-3 py-2 rounded-full bg-fill-weak w-fit flex justify-center items-center text-xs text-text-weak tracking-wide">
            #{subjectId}
          </div>
        </div>
      </MainLayout.Header>

      <MainLayout.Body>
        <Properties>
          <Properties.Property name="Teacher">
            <AcademicCapIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>
            {subjectAdmin.teacher_name}
          </Properties.Property.Value>

          <Properties.Property name="Student Monitor">
            <PencilSquareIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>
            {subjectAdmin.monitor_name}
          </Properties.Property.Value>

          <Properties.Property name="Number of Students">
            <HashtagIcon className="size-5 text-text-weak" />
          </Properties.Property>
          <Properties.Property.Value>{numOfStudents}</Properties.Property.Value>
        </Properties>

        <hr className="text-stroke-weak w-full"></hr>

        <div className="flex flex-col gap-6 mt-2 bg-background-weak border-1 border-stroke-weak px-6 py-5">
          <div className="flex flex-row gap-[6px] items-center">
            <p className="uppercase text-text-weak text-sm font-semibold tracking-wide">
              In progress
            </p>
            {inProgress?.length > 0 && (
              <div className="w-4 h-4 text-xs text-text-weak bg-fill-weak rounded flex justify-center items-center">
                {inProgress.length}
              </div>
            )}
          </div>

          {inProgress?.length > 0 ? (
            <div className="w-2xl flex flex-col gap-3">
              {inProgress.map((a) => {
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
                      <div className="flex flex-row gap-3">
                        <p className="font-bold">{a.assignment_title}</p>
                        <div className="px-5 py-[5px] rounded-full bg-[#FFCACF] w-fit flex justify-center items-center uppercase text-xs font-semibold">
                          {subjectInfo.name}
                        </div>
                      </div>

                      <div className="flex flex-row gap-3">
                        <div className="flex flex-row gap-1 items-center">
                          <ClockIcon className="size-4 text-text-weaker" />
                          <p className="text-sm text-text-weak">
                            {formatDate(a.due_date)}
                          </p>
                        </div>

                        <div className="flex flex-row gap-1 items-center">
                          <CheckCircleIcon className="size-4 text-text-weaker" />
                          <p className="text-sm text-text-weak">
                            {stats.submitted} Submitted, {stats.not_submitted}{" "}
                            Left
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="w-2xl text-text-weak mt-[-8px]">
              Wonderful! There are no assignments to be collected 🎉
            </p>
          )}
        </div>

        {archived?.length > 0 && (
          <ArchivedAssignments
            archived={archived}
            subjectId={subjectId}
            subjectInfo={subjectInfo}
          />
        )}
      </MainLayout.Body>
    </Suspense>
  );
}
