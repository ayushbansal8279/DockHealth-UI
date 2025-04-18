import { UserEditProvider } from "@/app/context-api/user-edit-context";
import UsersView from "./UsersView";

const UsersViewWrapper = () => {
  return (
    <UserEditProvider>  
      <UsersView/>
    </UserEditProvider>
  )
}

export default UsersViewWrapper;