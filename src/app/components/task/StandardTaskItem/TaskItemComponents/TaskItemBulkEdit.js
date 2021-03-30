import React, { useCallback } from 'react';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { BulkContainer } from '../../styled';

const TaskItemBulkEdit = ({
  isCheckedByBulkEdit,
  bulkEditTaskActions,
  bulkEditActionPayload,
}) => {
  const onClickBulkEditCheckbox = useCallback(
    () => bulkEditTaskActions?.onClickBulkEditTask(bulkEditActionPayload),
    [bulkEditActionPayload, bulkEditTaskActions],
  );

  return (
    <BulkContainer>
      <Checkbox
        isChecked={isCheckedByBulkEdit}
        onClick={onClickBulkEditCheckbox}
      />
    </BulkContainer>
  );
};

export default TaskItemBulkEdit;
