export default async function Page({ params }) {
  const { assignmentId } = await params

  return (
    <div>
      This is page for assignment id {assignmentId}.
    </div>
  )
}
