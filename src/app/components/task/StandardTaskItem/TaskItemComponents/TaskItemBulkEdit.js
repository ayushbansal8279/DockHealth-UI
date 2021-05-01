import React from 'react';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { BulkContainer } from '../../styled';

const TaskItemBulkEdit = ({ isChecked, onClick }) => {
  return (
    <BulkContainer>
      <Checkbox isChecked={isChecked} onClick={onClick} />
    </BulkContainer>
  );
};

export default TaskItemBulkEdit;
