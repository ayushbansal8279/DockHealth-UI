import React from 'react';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import TasksStatusSwitchIcon from 'img/tasks-status-switch-icon';
import { TaskStatus } from 'helpers/task-helpers';

const OPTIONS = [
  {
    label: 'Open Tasks',
    value: TaskStatus.INCOMPLETE,
  },
  { label: 'Archived Tasks', value: TaskStatus.COMPLETE },
];

const TaskStatusToolbarSelect = ({ value, onChange, ...restProps }) => {
  return (
    <ToolbarSelect
      options={OPTIONS}
      value={value}
      name="task-status"
      onChange={onChange}
      icon={<img src={TasksStatusSwitchIcon} alt="view type icon" />}
      {...restProps}
    />
  );
};

export default TaskStatusToolbarSelect;
