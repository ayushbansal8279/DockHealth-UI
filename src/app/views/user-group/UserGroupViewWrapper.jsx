import { UserEditProvider } from "@/app/context-api/user-edit-context";
import UserGroupView from "./UserGroupView";

const UserGroupViewWrapper = () => {
  return (
    <UserEditProvider>
      <UserGroupView/>
    </UserEditProvider>
  )
}

export default UserGroupViewWrapper;