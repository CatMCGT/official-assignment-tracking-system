export const subjectShorthands = {
  chi: 'Chinese',
  eng: 'English',
  math: 'Math',
  cs: 'CS',
  ls: 'LS',
  bio: 'Biology',
  chem: 'Chemistry',
  phy: 'Physics',
  ict: 'ICT',
  chis: 'Chinese History',
  his: 'History',
  geo: 'Geography',
  eco: 'Economy',
  m1: 'M1',
  m2: 'M2',
  art: 'Arts',
  mus: 'Music',
  pe: 'PE',
  epa: 'EPA',
  lit: 'English literature',
}

export default function getSubjectInfo(subjectId) {
  // Examples of subject ids include: "2425-g11-bio-1", "2526-11b-chi", "2526-g7-chi-t"

  if (subjectId === '' || subjectId === undefined) {
    return {
      year: null,
      grade: null,
      name: null,
      block: null,
      class: null,
    }
  }

  const subjectIdArr = subjectId.split('-')
  const subjectName = subjectShorthands[subjectIdArr[2]] || 'Unknown'

  if (subjectIdArr[1].startsWith('g')) {
    // Subject are grade-based -> have block

    return {
      year: subjectIdArr[0],
      grade: subjectIdArr[1].substring(1),
      name: subjectName,
      block: subjectIdArr[3] || null,
      class: null,
    }
  } else {
    return {
      year: subjectIdArr[0],
      grade: null,
      name: subjectName,
      block: subjectIdArr[3] || null,
      class: subjectIdArr[1],
    }
  }
}
