import { getUser } from '@/db/users/getUser'
import MainLayout from '../layout'
import { getOnTimeSubmitPercentages } from '@/db/assignments/assignmentStatistics'
import Chart from './Chart'

export default async function Page() {
  const user = await getUser()
  const onTimeSubmitPercentages = await getOnTimeSubmitPercentages()

  return (
    <div>
      <MainLayout.Header>
        <div>{user?.name}'s Dashboard</div>
      </MainLayout.Header>

      <MainLayout.Body>
        <h2 className='text-xl underline'>Average On-time Submission Percentages (Taught Subjects)</h2>
        <Chart user={user} onTimeSubmitPercentages={onTimeSubmitPercentages} />
      </MainLayout.Body>
    </div>
  )
}
