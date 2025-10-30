import React from 'react';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { BulkContainer } from '../../styled';

const TaskItemBulkEdit = ({ isChecked, onClick, isDisabled }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <BulkContainer visible={isChecked}>
      <Checkbox
        isChecked={isChecked}
        onClick={handleClick}
        isDisabled={isDisabled}
      />
    </BulkContainer>
  );
};

export default TaskItemBulkEdit;
