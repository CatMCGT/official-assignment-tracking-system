export function checkSubjectChanges(
  user,
  originalEnrolledIds,
  enrolledSubjectIds,
  originalTaughtIds,
  taughtSubjectIds
) {
  const changes = {
    newlyEnrolled: [],
    removedEnrolled: [],
    newlyTaught: [],
    removedTaught: [],
  }

  if (user.role === 'student') {
    changes.newlyEnrolled = enrolledSubjectIds.filter(
      (id) => !originalEnrolledIds.includes(id)
    )

    changes.removedEnrolled = originalEnrolledIds.filter(
      (id) => !enrolledSubjectIds.includes(id)
    )
  } else if (user.role === 'teacher') {
    changes.newlyTaught = taughtSubjectIds.filter(
      (id) => !originalTaughtIds.includes(id)
    )

    changes.removedTaught = originalTaughtIds.filter(
      (id) => !taughtSubjectIds.includes(id)
    )
  }

  return changes
}
