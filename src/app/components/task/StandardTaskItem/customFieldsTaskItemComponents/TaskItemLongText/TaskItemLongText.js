import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { Text } from './styled';

const TaskItemLongText = ({ value = '' }) => {
  return (
    <Tooltip placement="top" title={value}>
      <Text>{value}</Text>
    </Tooltip>
  );
};

export default TaskItemLongText;
