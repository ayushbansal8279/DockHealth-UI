export const TasksStatus = {
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
    isSelected: selectedTab === TasksStatus.OPEN,
    key: TasksStatus.OPEN,
    label: 'Open Tasks'.concat(openTasksAmount ? ` (${openTasksAmount})` : ''),
    onSelectTab: () => onSelectTab(TasksStatus.OPEN),
    shouldRender: () => true,
  },
  {
    isSelected: selectedTab === TasksStatus.COMPLETE,
    key: TasksStatus.COMPLETE,
    label: 'Completed'.concat(
      completedTasksAmount ? ` (${completedTasksAmount})` : '',
    ),
    onSelectTab: () => onSelectTab(TasksStatus.COMPLETE),
    shouldRender: () => true,
  },
];
