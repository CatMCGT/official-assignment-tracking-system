export const subjectShorthands = {
  chi: {name: 'Chinese', color: '#D88282'},
  eng: {name: 'English', color: '#6B9BFF'},
  math: {name: 'Math', color: '#6BB36B'},
  cs: {name: 'CS', color: '#FF9D5C'},
  ls: {name: 'LS', color: '#A87BB8'},
  bio: {name: 'Biology', color: '#54B8A9'},
  chem: {name: 'Chemistry', color: '#FF6B8A'},
  phy: {name: 'Physics', color: '#6A8CFF'},
  ict: {name: 'ICT', color: '#FF8A4D'},
  chis: {name: 'Chinese History', color: '#C4856B'},
  his: {name: 'History', color: '#C56BC5'},
  geo: {name: 'Geography', color: '#48C9C9'},
  eco: {name: 'Economy', color: '#B8C94D'},
  m1: {name: 'M1', color: '#E6C34D'},
  m2: {name: 'M2', color: '#87C787'},
  art: {name: 'Arts', color: '#FF8C90'},
  mus: {name: 'Music', color: '#6BB8FF'},
  pe: {name: 'PE', color: '#A8A8A8'},
  epa: {name: 'EPA', color: '#E07FA6'},
  lit: {name: 'English literature', color: '#6FA3FF'},
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
  const subjectName = subjectShorthands[subjectIdArr[2]].name || 'Unknown'

  if (subjectIdArr[1].startsWith('g')) {
    // Subject are grade-based -> have block

    return {
      year: subjectIdArr[0],
      grade: subjectIdArr[1].substring(1),
      name: subjectName,
      block: subjectIdArr[3] || null,
      class: null,
      color: subjectShorthands[subjectIdArr[2]].color
    }
  } else {
    return {
      year: subjectIdArr[0],
      grade: null,
      name: subjectName,
      block: subjectIdArr[3] || null,
      class: subjectIdArr[1],
      color: subjectShorthands[subjectIdArr[2]].color
    }
  }
}
