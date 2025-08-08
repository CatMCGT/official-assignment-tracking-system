import Breadcrumb from '@/components/nav/Breadcrumb'

export default async function Page({ params }) {
  const { subject } = await params
  return (
    <div>
      <Breadcrumb />
      <div>This is page for {subject}.</div>
    </div>
  )
}
