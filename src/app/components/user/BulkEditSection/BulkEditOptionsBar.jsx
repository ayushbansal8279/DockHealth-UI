import { useContext } from "react";
import { Button } from "./styled";
import BulkEditBar from "@/app/components/bulk-edit/BulkEditBar/BulkEditBar";
import BulkEditOption from "@/app/components/bulk-edit/BulkEditOption/BulkEditOption";
import CompleteIcon from "@/app/img/bulk-edit/CompleteIcon";
import DuplicateIcon from "@/app/img/bulk-edit/DuplicateIcon";
import { UserEditContext } from "@/app/context-api/user-edit-context";

const BulkEditOptionsBar = ({ selectedUsers=[], onClose }) => {
  const { selectedOptionsHandler } = useContext(UserEditContext);
  const {
    toggleCreateTaskOption,
    toggleCreateWorkflowOption
  } = selectedOptionsHandler;

  return (
    <BulkEditBar
      numberOfSelectedItems={selectedUsers?.length}
      onClose={onClose}
      viewType="user"
    >
      <Button type="button" onClick={toggleCreateTaskOption}>
        <BulkEditOption
          iconComponent={CompleteIcon}
          title="Create Task"
        />
      </Button>
      <Button type="button" onClick={toggleCreateWorkflowOption}>
        <BulkEditOption
          iconComponent={DuplicateIcon}
          title="Create Workflow"
        />
      </Button>
    </BulkEditBar>
  )
}

export default BulkEditOptionsBar;