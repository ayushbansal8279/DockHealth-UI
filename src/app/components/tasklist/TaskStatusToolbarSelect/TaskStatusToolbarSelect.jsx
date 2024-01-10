import React from 'react';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import TasksStatusSwitchIcon from 'img/tasks-status-switch-icon.svg';
import { TaskStatus } from 'helpers/task-helpers';
import { ViewTypeImg } from './styled';

const OPTIONS = [
  {
    label: 'Incomplete Tasks',
    value: TaskStatus.INCOMPLETE,
  },
  { label: 'Completed Tasks', value: TaskStatus.COMPLETE },
];

const TaskStatusToolbarSelect = ({
  value,
  onChange,
  iconColorFilterActive,
  iconColorActive,
  ...restProps
}) => {
  return (
    <ToolbarSelect
      options={OPTIONS}
      value={value || ''}
      name="task-status"
      onChange={onChange}
      icon={
        <ViewTypeImg
          src={TasksStatusSwitchIcon}
          alt="view type icon"
          iconColorFilterActive={iconColorFilterActive}
        />
      }
      iconColorActive={iconColorActive}
      {...restProps}
    />
  );
};

export default TaskStatusToolbarSelect;
