import { useContext } from "react";

import BulkEditBar from "@/app/components/bulk-edit/BulkEditBar/BulkEditBar";
import BulkEditOption from "@/app/components/bulk-edit/BulkEditOption/BulkEditOption";
import DeleteIcon from "@/app/img/bulk-edit/DeleteIcon";
import MoveIcon from "@/app/img/bulk-edit/MoveIcon";
import { UserEditContext } from "@/app/context-api/workspace-user-context";
import { Button } from "./styled";

const BulkEditOptionsBar = ({ selectedUsers = [], onClose }) => {
  const {
    selectedOptionsHandler: { toggleOption },
  } = useContext(UserEditContext);

  return (
    <BulkEditBar
      numberOfSelectedItems={selectedUsers?.length}
      onClose={onClose}
      viewType="user"
    >
      <Button
        type="button"
        onClick={() => toggleOption("changeRoleOption")}
      >
        <BulkEditOption
          iconComponent={MoveIcon}
          title="Change role"
        />
      </Button>
      <Button
        type="button"
        onClick={() => toggleOption("removeOption")}
      >
        <BulkEditOption
          iconComponent={DeleteIcon}
          title={`Remove user${selectedUsers?.length !== 1 ? 's' : ''}`}
        />
      </Button>
    </BulkEditBar>
  )
}

export default BulkEditOptionsBar;