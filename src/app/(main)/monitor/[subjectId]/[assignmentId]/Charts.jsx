'use client'

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

export default function Charts({ assignment }) {
  const students = assignment?.students || []
  const maxGrade = assignment?.assignment_grade
  const studentGrade = students
    .filter((s) => s.collected_date)
    .map((s) => {
      return {
        student_id: s.id,
        grade: s.grade,
      }
    })

  console.log(studentGrade)
  console.log(maxGrade)

  const ranges = [
    { range: '0-49%', min: 0, max: 49, count: 0 },
    { range: '50-59%', min: 50, max: 59, count: 0 },
    { range: '60-69%', min: 60, max: 69, count: 0 },
    { range: '70-79%', min: 70, max: 79, count: 0 },
    { range: '80-89%', min: 80, max: 89, count: 0 },
    { range: '90-100%', min: 90, max: 100, count: 0 },
  ]

  studentGrade.forEach((student) => {
    const gradePercentage = Math.round(student.grade / maxGrade) * 100

    console.log(gradePercentage)

    const range = ranges.find(
      (r) => gradePercentage >= r.min && gradePercentage <= r.max
    )

    range.count += 1
  })

  console.log(ranges)

  return (
    <div>
      <div className="border-1 rounded border-stroke-weak px-7 py-5">
        <h2 className="text-lg font-bold">Student Grade for Assignment</h2>
        <p className="text-text-weak  mb-5">The distribution of grade.</p>
        <BarChart
          style={{ width: '600px', height: '500px' }}
          responsive
          data={ranges}
          margin={{
            top: 10,
            right: 0,
            left: 10,
            bottom: 30,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey="range" />
          <YAxis width="auto" dataKey="count" />
          <Tooltip cursor={{ fill: '#F5F5F5' }} />
          <Bar
            dataKey="count"
            fill="#88847C"
            maxBarSize={100}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
        <div className="relative"></div>
      </div>
    </div>
  )
}
