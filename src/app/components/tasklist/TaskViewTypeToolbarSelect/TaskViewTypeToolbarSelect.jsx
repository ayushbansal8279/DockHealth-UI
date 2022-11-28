import React from 'react';
import { useSelector } from 'react-redux';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import ViewTypeIcon from 'img/view-type-icon';
import { ViewType } from 'helpers/view-type-helper';
import { userHasBoardViewFeatureSelector } from 'selectors/user-selectors';

const OPTIONS_DEFAULT = [
  {
    label: 'Table view',
    value: ViewType.LIST_VIEW,
  },
  {
    label: 'Calendar view',
    value: ViewType.CALENDAR_VIEW,
  },
];

const OPTIONS_MORE = [
  {
    label: 'Board View',
    value: ViewType.BOARD_VIEW,
  },
];

const TaskViewTypeToolbarSelect = ({
  value,
  onChange,
  iconColorActive,
  ...restProps
}) => {
  const boardViewAvailable = useSelector(userHasBoardViewFeatureSelector);

  let OPTIONS = OPTIONS_DEFAULT;
  if (boardViewAvailable) {
    OPTIONS = OPTIONS.concat(OPTIONS_MORE);
  }
  return (
    <ToolbarSelect
      options={OPTIONS}
      value={value}
      name="task-view-type"
      onChange={onChange}
      icon={
        <img
          src={ViewTypeIcon}
          alt="view type icon"
          style={{ filter: iconColorActive }}
        />
      }
      {...restProps}
    />
  );
};

export default TaskViewTypeToolbarSelect;
