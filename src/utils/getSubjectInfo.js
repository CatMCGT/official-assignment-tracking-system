export const subjectShorthands = {
  chi: "Chinese",
  eng: "English",
  math: "Math",
  cs: "CS",
  ls: "LS",
  bio: "Biology",
  chem: "Chemistry",
  phy: "Physics",
  ict: "ICT",
  chis: "Chinese History",
  his: "History",
  geo: "Geography",
  eco: "Economy",
  m1: "M1",
  m2: "M2",
  art: "Arts",
  mus: "Music",
  pe: "PE",
  epa: "EPA",
  lit: "English literature",
};

export default function getSubjectInfo(subjectId) {
  // Examples of subject ids include: "g11-bio-1", "11b-chi", "g7-chi-t"

  const subjectIdArr = subjectId.split("-");
  const subjectName = subjectShorthands[subjectIdArr[1]] || "Unknown";

  if (subjectIdArr[0].startsWith("g")) {
    // Subject are grade-based -> have block

    return {
      grade: subjectIdArr[0].substring(1),
      name: subjectName,
      block: subjectIdArr[2] || null,
      class: null,
    };
  } else {
    return {
      grade: null,
      name: subjectName,
      block: subjectIdArr[2] || null,
      class: subjectIdArr[0],
    };
  }
}
