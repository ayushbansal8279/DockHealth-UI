import { useContext } from "react";

import { UserEditContext } from "@/app/context-api/user-edit-context";
import BulkEditOptionsBar from "./BulkEditOptionsBar";
import { BulkEditOptionsBarContainer } from "./styled";

const BulkEditSection = ({ children }) => {

  const UserContext = useContext(UserEditContext);
  const {
    bulkEditIsActive,
    selectedUsers,
    unselectAllUser,
    selectedOptionsHandler,
  } = UserContext;
  const { turnOffAllOptions } = selectedOptionsHandler;  

  const onClose = () => {
    unselectAllUser();
    turnOffAllOptions();
  }

  return (
    bulkEditIsActive && (
      <>
        {children}
        <BulkEditOptionsBarContainer isOpen={bulkEditIsActive}>
          {bulkEditIsActive && (
            <BulkEditOptionsBar
              selectedUsers={selectedUsers}
              onClose={onClose}
            />
          )}
        </BulkEditOptionsBarContainer>
      </>
    )
  )
}

export default BulkEditSection;