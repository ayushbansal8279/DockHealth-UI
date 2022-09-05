import React from 'react';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { BulkContainer } from '../../styled';

const TaskItemBulkEdit = ({ isChecked, onClick, isDisabled }) => {
  return (
    <BulkContainer visible={isChecked}>
      <Checkbox
        isChecked={isChecked}
        onClick={onClick}
        isDisabled={isDisabled}
      />
    </BulkContainer>
  );
};

export default TaskItemBulkEdit;
