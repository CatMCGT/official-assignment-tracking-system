import { getUser } from '@/db/users/getUser'
import MainLayout from '../layout'
import { getOnTimeSubmitPercentages } from '@/db/assignments/assignmentStatistics'
import AOTSChart from './Charts'
import Icon from '@/components/Icon'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Dashboard',
}

export default async function Page() {
  const user = await getUser()
  const onTimeSubmitPercentages = await getOnTimeSubmitPercentages()

  return (
    <div>
      <MainLayout.Header>
        <div>{user?.name}'s Dashboard</div>
      </MainLayout.Header>

      <MainLayout.Body>
        <div className="border-1 rounded border-stroke-weak px-7 py-5">
          <h2 className="text-lg font-bold">
            Average On-time Submission (Taught Subjects)
          </h2>
          <p className="text-text-weak  mb-5">
            The percentages of on-time submission.
          </p>
          <div className="relative">
            <AOTSChart
              user={user}
              onTimeSubmitPercentages={onTimeSubmitPercentages}
            />
            <div className="absolute right-2 top-4">
              <Icon tooltip="Made with recharts">
                <InformationCircleIcon className="size-5 text-text-weak" />
              </Icon>
            </div>
          </div>
        </div>
      </MainLayout.Body>
    </div>
  )
}
