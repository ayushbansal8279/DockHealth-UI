import { useContext } from "react";

import BulkEditBar from "@/app/components/bulk-edit/BulkEditBar/BulkEditBar";
import BulkEditOption from "@/app/components/bulk-edit/BulkEditOption/BulkEditOption";
import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import { Button } from "./styled";

const BulkEditOptionsBar = () => {
  const {
    selectedOptionsHandler: { toggleOption },
    viewType,
    selectedItems,
    bulkOptions,
    unselectAllItems,
    selectedOptionsHandler: { resetOptions }
  } = useContext(BulkEditContext);

  const onClose = () => {
    unselectAllItems();
    resetOptions();
  };

  return (
    <BulkEditBar
      numberOfSelectedItems={selectedItems.length}
      onClose={onClose}
      viewType={viewType}
    >
      {bulkOptions.map(({ key, title, icon, onClick }) => (
        <Button key={key} type="button" onClick={() => {
          toggleOption(key);
          onClick?.();
        }}>
          <BulkEditOption iconComponent={icon} title={title} />
        </Button>
      ))}
    </BulkEditBar>
  );
};

export default BulkEditOptionsBar;