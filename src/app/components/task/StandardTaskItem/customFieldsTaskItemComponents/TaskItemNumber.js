import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { trunc } from 'helpers/utility-functions';
import { Typography } from '@material-ui/core';

const TaskItemNumber = ({ value = '' }) => {
  return (
    <Tooltip placement="top" title={value}>
      <Typography>{trunc(value, 20)}</Typography>
    </Tooltip>
  );
};

export default TaskItemNumber;
