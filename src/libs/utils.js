export function checkRole(id) {
  const letter = id[0];
  if (letter == "a") return "admin";
  if (letter == "s") return "student";
  if (letter == "t") return "teacher";
}

export function toTitleCase(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regex expression. \w matches any "word" character. \S* matches zero or more non-whitespace characters. g is the "global" flag => extracts "words" from a strinig, where each word starts with a word character.
  return str.replace(/\w\S*/g, (text) => {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
}

export const subjectNameShorthands = {
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

export function getSubjectInfoFromId(subjectId) {
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

export function getSubjectIdFromInfo(subjectInfo) {
  try {
    let idArray = [];

    if (subjectInfo.grade) {
      idArray.push(`g${subjectInfo.grade}`);
    } else {
      idArray.push(subjectInfo.subjectClass.toLowerCase());
    }

    for (const [key, value] of Object.entries(subjectNameShorthands)) {
      if (value.toLowerCase() === subjectInfo.name.toLowerCase()) {
        idArray.push(key);
      }
    }

    if (subjectInfo.block) {
      if (typeof subjectInfo.block === "string") {
        idArray.push(subjectInfo.block.toLowerCase());
      } else {
        idArray.push(subjectInfo.block);
      }
    }

    return idArray.join("-");
  } catch (err) {
    console.error("Error getting subjectId from info:", err);

    return false;
  }
}
