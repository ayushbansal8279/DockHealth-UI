import React from 'react';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import viewTypeIcon from 'img/viewTypeIcon.png';
import { TaskStatus } from 'helpers/task-helpers';

const OPTIONS = [
  {
    label: 'Open Tasks',
    value: TaskStatus.INCOMPLETE,
  },
  { label: 'Complete Tasks', value: TaskStatus.COMPLETE },
];

const TaskStatusToolbarSelect = ({ value, onChange, ...restProps }) => {
  return (
    <ToolbarSelect
      options={OPTIONS}
      value={value}
      name="task-status"
      onChange={onChange}
      icon={<img src={viewTypeIcon} alt="view type icon" />}
      {...restProps}
    />
  );
};

export default TaskStatusToolbarSelect;
