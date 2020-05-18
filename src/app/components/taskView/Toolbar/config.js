const OPEN_TASKS = 'OPEN_TASKS';
const COMPLETED_TASKS = 'COMPLETED_TASKS';
// eslint-disable-next-line import/prefer-default-export
export const TABS_CONFIG = ({
  completedTasksAmount,
  onSelectTab,
  openTasksAmount,
  selectedTab,
}) => [
  {
    isSelected: selectedTab === OPEN_TASKS,
    key: OPEN_TASKS,
    label: 'Open Tasks'.concat(openTasksAmount ? ` (${openTasksAmount})` : ''),
    onSelectTab: () => onSelectTab(OPEN_TASKS),
    shouldRender: () => true,
  },
  {
    isSelected: selectedTab === COMPLETED_TASKS,
    key: COMPLETED_TASKS,
    label: 'Completed'.concat(
      completedTasksAmount ? ` (${completedTasksAmount})` : '',
    ),
    onSelectTab: () => onSelectTab(COMPLETED_TASKS),
    shouldRender: () => true,
  },
];
