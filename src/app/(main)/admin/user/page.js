import MainLayout from "../../layout";
import CreateUser from "./CreateUser";

export default async function Page() {
  return (
    <div>
      <MainLayout.Header>
        User Management
      </MainLayout.Header>

      <div className="flex flex-row gap-10">
        <div>
          <CreateUser />
        </div>
      </div>
    </div>
  )
}