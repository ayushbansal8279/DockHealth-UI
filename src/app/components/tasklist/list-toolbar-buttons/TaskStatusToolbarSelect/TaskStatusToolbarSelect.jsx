import React from 'react';
import TasksStatusSwitchIcon from 'img/tasks-status-switch-icon.svg';
import { TaskStatus } from 'helpers/task-helpers';
import { ViewTypeImg } from './styled';
import NewToolbarSelect from '../../NewToolbarSelect/NewToolbarSelect';

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
  searchValue,
  focused,
  taskListIdentifier,
  ...restProps
}) => {
  return (
    <NewToolbarSelect
      options={OPTIONS}
      value={value}
      taskListIdentifier={taskListIdentifier}
      name="task-status"
      onChange={onChange}
      searchValue={searchValue}
      focused={focused}
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
