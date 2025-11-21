'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function Chart({user, onTimeSubmitPercentages}) {
  const data = onTimeSubmitPercentages

  console.log(data)

  return (
    <BarChart
      style={{ width: '600px', height: '500px' }}
      responsive
      data={data}
      margin={{
        top: 10,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <XAxis dataKey="subject_id"/>
      <YAxis width="auto"/>
      <Tooltip />
      <Bar dataKey="average_on_time_submit" fill="#8884d8" maxBarSize={100}/>
    </BarChart>
  )
}
