/* eslint-disable import/prefer-default-export */

export const DashboardTasksTab = {
  MY_TASKS: 'MyTasks',
  ALL_TASKS: 'AllTasks',
};

export const DashboardTasksTabUrl = {
  [DashboardTasksTab.MY_TASKS]: 'my-tasks',
  [DashboardTasksTab.ALL_TASKS]: 'all-tasks',
};

export const DashboardGroup = {
  TODAY: 'TODAY',
  NEXT_7_DAYS: 'NEXT_7_DAYS',
  NO_DUE_DATE: 'NO_DUE_DATE',
  COMPLETED_TODAY: 'COMPLETED_TODAY',
  COMPLETED_7_DAYS: 'COMPLETED_7_DAYS',
  ORG_COMPLETED_TODAY: 'ORG_COMPLETED_TODAY',
  ORG_COMPLETED_7_DAYS: 'ORG_COMPLETED_7_DAYS',
};

export const GROUPS_WITH_QUICK_ADD_TASK_INPUT = [
  DashboardGroup.TODAY,
  DashboardGroup.NEXT_7_DAYS,
  DashboardGroup.NO_DUE_DATE,
];

export const GROUPS_WITH_COMPLETED_TASKS = [
  DashboardGroup.COMPLETED_TODAY,
  DashboardGroup.COMPLETED_7_DAYS,
  DashboardGroup.ORG_COMPLETED_TODAY,
  DashboardGroup.ORG_COMPLETED_7_DAYS,
];
