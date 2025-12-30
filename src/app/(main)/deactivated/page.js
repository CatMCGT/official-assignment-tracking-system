import { getTaughtSubjects } from '@/db/subjects/getTaughtSubjects'
import MainLayout from '../layout'
import DeactivatedSubjects from './DeactivatedSubjects'
import { getUser } from '@/db/users/getUser'
import { getMonitoredSubjects } from '@/db/subjects/getMonitoredSubjects'

export default async function Page() {
  const user = await getUser()
  if (user.role === 'teacher') {
    const taughtSubjects = await getTaughtSubjects()
    const deactivatedSubjects = taughtSubjects.filter(
      (s) => s.deactivated_date !== null
    )

    return (
      <div>
        <MainLayout.Header>Deactivated Subjects</MainLayout.Header>

        <DeactivatedSubjects
          deactivatedSubjects={deactivatedSubjects}
          action="teach"
        />
      </div>
    )
  } else if (user.role === 'student') {
    const monitoredSubjects = await getMonitoredSubjects()
    if (monitoredSubjects.length === 0)
      return 'You do not have permission to view this page.'
    const deactivatedSubjects = monitoredSubjects.filter(
      (s) => s.deactivated_date !== null
    )

    return (
      <div>
        <MainLayout.Header>Deactivated Subjects</MainLayout.Header>

        <DeactivatedSubjects
          deactivatedSubjects={deactivatedSubjects}
          action="monitor"
        />
      </div>
    )
  }
}
