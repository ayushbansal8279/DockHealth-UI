/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Box } from '@material-ui/core';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import PriorityFlag from 'img/priority-flag';

const PriorityOptionIcon = ({ color }) => (
  <Box pr="10px">
    <PriorityFlag color={color} />
  </Box>
);

export const PRIORITY_OPTIONS = [
  {
    value: TaskPriority.LOW,
    label: 'No priority',
    OptionIcon: (
      <PriorityOptionIcon color={getPriorityColor(TaskPriority.LOW)} />
    ),
  },
  // {
  //   value: TaskPriority.LOW,
  //   label: 'Low',
  //   OptionIcon: (
  //     <PriorityOptionIcon color={getPriorityColor(TaskPriority.LOW)} />
  //   ),
  // },
  // {
  //   value: TaskPriority.MEDIUM,
  //   label: 'Medium',
  //   OptionIcon: (
  //     <PriorityOptionIcon color={getPriorityColor(TaskPriority.MEDIUM)} />
  //   ),
  // },
  {
    value: TaskPriority.HIGH,
    label: 'High',
    OptionIcon: (
      <PriorityOptionIcon color={getPriorityColor(TaskPriority.HIGH)} />
    ),
  },
];
