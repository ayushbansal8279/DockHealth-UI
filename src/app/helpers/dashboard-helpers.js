import moment from 'moment';

export const DashboardTasksTab = {
  MY_TASKS: 'MyTasks',
  SHARED_TASKS: 'SharedTasks',
  ALL_TASKS: 'AllTasks',
};

export const DashboardGroup = {
  TODAY: 'TODAY',
  ORG_TODAY: 'ORG_TODAY',
  NEXT_7_DAYS: 'NEXT_7_DAYS',
  ORG_NEXT_7_DAYS: 'ORG_NEXT_7_DAYS',
  OVERDUE: 'OVERDUE',
  ORG_OVERDUE: 'ORG_OVERDUE',
  NO_DUE_DATE: 'NO_DUE_DATE',
  ORG_NO_DUE_DATE: 'ORG_NO_DUE_DATE',
  COMPLETED_TODAY: 'COMPLETED_TODAY',
  COMPLETED_7_DAYS: 'COMPLETED_7_DAYS',
  ORG_COMPLETED_TODAY: 'ORG_COMPLETED_TODAY',
  ORG_COMPLETED_7_DAYS: 'ORG_COMPLETED_7_DAYS',
  ALL_OTHER: 'ALL_OTHER',
  ORG_ALL_OTHER: 'ORG_ALL_OTHER',
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

export const getGroupByDueDate = (dueDate, tabName) => {
  const isMyTasksTab = tabName === DashboardTasksTab.MY_TASKS;
  if (!dueDate || dueDate === '')
    return isMyTasksTab
      ? DashboardGroup.NO_DUE_DATE
      : DashboardGroup.ORG_NO_DUE_DATE;
  const date = moment(dueDate);
  if (date.isSame(moment(new Date()), 'day'))
    return isMyTasksTab ? DashboardGroup.TODAY : DashboardGroup.ORG_TODAY;
  if (
    date.isAfter(new Date(), 'day') &&
    date.isSameOrBefore(
      moment(new Date())
        .startOf('day')
        .add(7, 'days'),
      'day',
    )
  )
    return isMyTasksTab
      ? DashboardGroup.NEXT_7_DAYS
      : DashboardGroup.ORG_NEXT_7_DAYS;
  if (
    date.isSameOrAfter(
      moment(new Date())
        .startOf('day')
        .add(7, 'days'),
      'day',
    )
  )
    return isMyTasksTab
      ? DashboardGroup.ALL_OTHER
      : DashboardGroup.ORG_ALL_OTHER;
  if (date.isBefore(new Date(), 'day')) return DashboardGroup.OVERDUE;
  return undefined;
};

export function getDashboardFiltersStorageKey(tabName) {
  return `filter-dashboard-${tabName}`;
}
