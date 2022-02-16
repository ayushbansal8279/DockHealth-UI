import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { trunc } from 'helpers/utility-functions';
import { Text } from './styled';

const TaskItemLongText = ({ value = '' }) => {
  return (
    <Tooltip placement="top" title={value}>
      <Text>{trunc(value, 15)}</Text>
    </Tooltip>
  );
};

export default TaskItemLongText;
