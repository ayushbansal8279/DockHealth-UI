import React from 'react';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import ViewTypeIcon from 'img/view-type-icon';
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
  {
    label: 'Board View',
    value: ViewType.BOARD_VIEW,
  },
];

const TaskViewTypeToolbarSelect = ({ value, onChange, ...restProps }) => {
  return (
    <ToolbarSelect
      options={OPTIONS}
      value={value}
      name="task-view-type"
      onChange={onChange}
      icon={<img src={ViewTypeIcon} alt="view type icon" />}
      {...restProps}
    />
  );
};

export default TaskViewTypeToolbarSelect;
