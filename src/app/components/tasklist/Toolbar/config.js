import { isNil } from 'ramda';
import { TaskListTabName } from 'helpers/tasklist-helpers';

// eslint-disable-next-line import/prefer-default-export
export const TABS_CONFIG = ({
  completedTasksAmount,
  onSelectTab,
  openTasksAmount,
  selectedTab,
}) => [
  {
    isSelected: selectedTab === TaskListTabName.OPEN,
    key: TaskListTabName.OPEN,
    label: 'Open Tasks'.concat(
      !isNil(openTasksAmount) ? ` (${openTasksAmount})` : '',
    ),
    onSelectTab: () => onSelectTab(TaskListTabName.OPEN),
    shouldRender: () => true,
  },
  {
    isSelected: selectedTab === TaskListTabName.COMPLETE,
    key: TaskListTabName.COMPLETE,
    label: 'Completed'.concat(
      !isNil(completedTasksAmount) ? ` (${completedTasksAmount})` : '',
    ),
    onSelectTab: () => onSelectTab(TaskListTabName.COMPLETE),
    shouldRender: () => true,
  },
];
