import React from 'react';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import viewTypeIcon from 'img/viewTypeIcon.png';
import { ViewType } from 'helpers/view-type-helper';

const OPTIONS = [
  {
    label: 'Table view',
    value: ViewType.LIST_VIEW,
  },
  {
    label: 'Calendar view',
    value: ViewType.CALENDAR_VIEW,
  },
];

const TaskViewTypeToolbarSelect = ({ value, onChange, ...restProps }) => {
  return (
    <ToolbarSelect
      options={OPTIONS}
      value={value}
      name="task-view-type"
      onChange={onChange}
      icon={<img src={viewTypeIcon} alt="view type icon" />}
      {...restProps}
    />
  );
};

export default TaskViewTypeToolbarSelect;
