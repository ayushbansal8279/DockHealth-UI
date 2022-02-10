import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { trunc } from 'helpers/utility-functions';
import { Typography } from '@material-ui/core';

const TaskItemLongText = ({ value = '' }) => {
  return (
    <Tooltip placement="top" title={value}>
      <Typography>{trunc(value, 15)}</Typography>
    </Tooltip>
  );
};

export default TaskItemLongText;
