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

    const range = ranges.find(
      (r) => gradePercentage >= r.min && gradePercentage <= r.max
    )

    range.count += 1
  })

  return (
    <div>
      <div className="border-1 rounded border-stroke-weak px-7 py-5 w-full md:w-[940px]">
        <h2 className="text-lg font-bold">Student Grade for Assignment</h2>
        <p className="text-text-weak mb-2">The distribution of grade.</p>

        <div className="flex flex-row gap-8">
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
          <div>
            <div className="flex flex-row justify-between items-center mt-5 w-50">
              <p className="text-text-weak">Average Grade </p>
              <p>
                {studentGrade.map((s) => s.grade).reduce((a, b) => a + b) /
                  studentGrade.length}{' '}
                / {assignment.assignment_grade}
              </p>
            </div>

            <div className="flex flex-row justify-between items-center mt-5 w-50">
              <p className="text-text-weak">Median Grade </p>
              <p>
                {
                  studentGrade.map((s) => s.grade)[
                    Math.round(studentGrade.length) - 1
                  ]
                }{' '}
                / {assignment.assignment_grade}
              </p>
            </div>
          </div>
        </div>
        <div className="relative"></div>
      </div>
    </div>
  )
}
