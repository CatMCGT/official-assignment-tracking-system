"use server";

import getSubjectInfo from "@/utils/getSubjectInfo";
import StuAssignmentDetails from "./StuAssignmentDetails";
import { getMonitoredAssignments } from "@/db/assignments/getMonitoredAssignments";

export default async function Page({ params }) {
  const { subjectId, assignmentId, studentId } = params;

  const subjectInfo = getSubjectInfo(subjectId);
  const subjectAssignments = await getMonitoredAssignments(subjectId);
  const assignment = subjectAssignments?.filter(
    (a) => a.assignment_id == assignmentId
  )[0];
  const student = assignment.students.filter((s) => s.id === studentId)[0];

  return (
    <StuAssignmentDetails
      subjectInfo={subjectInfo}
      assignment={assignment}
      student={student}
    />
  );
}
