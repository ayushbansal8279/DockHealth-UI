export const TaskListTabName = {
  OPEN: 'incomplete',
  COMPLETE: 'complete',
};

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
      openTasksAmount !== null && openTasksAmount !== undefined
        ? ` (${openTasksAmount})`
        : '',
    ),
    onSelectTab: () => onSelectTab(TaskListTabName.OPEN),
    shouldRender: () => true,
  },
  {
    isSelected: selectedTab === TaskListTabName.COMPLETE,
    key: TaskListTabName.COMPLETE,
    label: 'Completed'.concat(
      completedTasksAmount !== null && completedTasksAmount !== undefined
        ? ` (${completedTasksAmount})`
        : '',
    ),
    onSelectTab: () => onSelectTab(TaskListTabName.COMPLETE),
    shouldRender: () => true,
  },
];
