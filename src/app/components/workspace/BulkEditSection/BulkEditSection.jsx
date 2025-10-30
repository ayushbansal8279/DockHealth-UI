import { useContext } from "react";

import { BulkEditContext } from "@/app/context-api/bulk-edit-context";
import BulkEditOptionsBar from "./BulkEditOptionBar";
import { BulkEditOptionsBarContainer } from "./styled";

const BulkEditSection = ({ children }) => {
  const bulkEditContext = useContext(BulkEditContext);
  const {
    bulkEditIsActive,
    selectedOptionsHandler,
  } = bulkEditContext;

  const { resetOptions } = selectedOptionsHandler;

  return bulkEditIsActive && (
    <>
      {children}
      <BulkEditOptionsBarContainer isOpen={bulkEditIsActive}>
        <BulkEditOptionsBar />
      </BulkEditOptionsBarContainer>
    </>
  );
};

export default BulkEditSection;