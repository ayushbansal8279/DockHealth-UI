import { useContext } from "react";

import BulkEditOptionsBar from "./BulkEditOptionBar";
import { BulkEditOptionsBarContainer } from "./styled";

const BulkEditSection = ({ context, children }) => {

  const UserContext = useContext(context);
  const {
    bulkEditIsActive,
    selectedUsers,
    unselectAllUser,
    selectedOptionsHandler,
  } = UserContext;
  const { resetOptions } = selectedOptionsHandler;

  const onClose = () => {
    unselectAllUser();
    resetOptions();
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