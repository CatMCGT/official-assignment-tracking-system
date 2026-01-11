export const subjectShorthands = {
  art: { name: 'Arts', color: '#FF8C90' },
  bio: { name: 'Biology', color: '#54B8A9' },
  chem: { name: 'Chemistry', color: '#FF6B8A' },
  chi: { name: 'Chinese', color: '#D88282' },
  chis: { name: 'Chinese History', color: '#C4856B' },
  cs: { name: 'CS', color: '#FF9D5C' },
  eco: { name: 'Economy', color: '#B8C94D' },
  eng: { name: 'English', color: '#6B9BFF' },
  lit: { name: 'English literature', color: '#6FA3FF' },
  epa: { name: 'EPA', color: '#E07FA6' },
  geo: { name: 'Geography', color: '#48C9C9' },
  his: { name: 'History', color: '#C56BC5' },
  ict: { name: 'ICT', color: '#FF8A4D' },
  ls: { name: 'LS', color: '#A87BB8' },
  m1: { name: 'M1', color: '#E6C34D' },
  m2: { name: 'M2', color: '#87C787' },
  math: { name: 'Math', color: '#6BB36B' },
  mus: { name: 'Music', color: '#6BB8FF' },
  pe: { name: 'PE', color: '#A8A8A8' },
  phy: { name: 'Physics', color: '#6A8CFF' },
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
      color: subjectShorthands[subjectIdArr[2]].color,
    }
  } else {
    return {
      year: subjectIdArr[0],
      grade: null,
      name: subjectName,
      block: subjectIdArr[3] || null,
      class: subjectIdArr[1],
      color: subjectShorthands[subjectIdArr[2]].color,
    }
  }
}
