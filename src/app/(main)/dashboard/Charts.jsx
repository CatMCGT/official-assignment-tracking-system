'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function AOTSChart({ onTimeSubmitPercentages }) {
  const data = onTimeSubmitPercentages

  return (
    <BarChart
      style={{ width: '600px', height: '500px' }}
      responsive
      data={data}
      margin={{
        top: 10,
        right: 0,
        left: 10,
        bottom: 30,
      }}
    >
      <XAxis dataKey="subject_id" label={{value: 'Subject ID', dy: 30}} />
      <YAxis width="auto" unit='%' label={{value: 'Average On-time Submission Percentages', position: 'insideLeft', dx:1, dy: 150, angle: -90}}/>
      <Tooltip cursor={{fill: '#F5F5F5'}} />
      <Bar dataKey="average_on_time_submit" fill="#88847C" maxBarSize={100} radius={[4,4,0,0]}/>
    </BarChart>
  )
}
