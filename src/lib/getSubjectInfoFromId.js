const subjectNameShorthands = {
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

export default function getSubjectInfoFromId(subjectId) {
  // Subject ids should be formatted like "g11-bio-1", or "11b-chi", or "g7-chi-t"

  const subjectIdArray = subjectId.split("-");
  const shorthand = subjectIdArray[1];
  const subjectName = subjectNameShorthands[shorthand] || "Unknown";

  if (subjectIdArray[0].startsWith("g")) {
    // Indicate that it is per grade --> have block
    return {
      grade: subjectIdArray[0].substring(1),
      subjectName: subjectName,
      block: subjectIdArray[2] || null,
      class: null,
    };
  } else {
    return {
      class: subjectIdArray[0],
      subjectName: subjectName,
      grade: null,
      block: subjectIdArray[2] || null,
    };
  }
}