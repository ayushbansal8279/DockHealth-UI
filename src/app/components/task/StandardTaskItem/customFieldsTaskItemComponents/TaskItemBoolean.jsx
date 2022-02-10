/* eslint-disable import/extensions */
import React from 'react';
import { Typography } from '@material-ui/core';
import { capitalize } from 'helpers/capitalize';

const TaskItemBoolean = ({ value }) => {
  return <Typography>{value ? capitalize(value) : ''}</Typography>;
};
export default TaskItemBoolean;
