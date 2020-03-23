export const taskListStatsTabs = {
  me: 'FOR ME',
  all: 'ALL',
};

export const taskListTrendsTabs = {
  me: 'FOR ME',
  all: 'ALL',
};

export const taskListStatsElements = [
  {
    key: 'AssignedToMe_TaskList_Count',
    label: 'Assigned to me',
    tab: taskListStatsTabs.me,
    filter: 'ASSIGNED_TO_ME',
  },
  {
    key: 'HighPriority_AssignToMe_Count',
    tab: taskListStatsTabs.me,
    label: 'Flagged',
    filter: 'ASSIGNED_TO_ME_FLAGGED',
  },
  {
    key: 'DueToday_AssignToMe_Count',
    label: 'Due today',
    tab: taskListStatsTabs.me,
    filter: 'ASSIGNED_TO_ME_DUE_TODAY',
  },
  {
    key: 'OverDue_AssignToMe_Count',
    label: 'Overdue',
    tab: taskListStatsTabs.me,
    filter: 'ASSIGNED_TO_ME_OVERDUE',
  },
  // {
  //   key: 'Completed_AssignToMe_Count',
  //   label: 'Completed this week',
  //   tab: taskListStatsTabs.me,
  //   filter: 'ASSIGNED_TO_ME_COMPLETED_THIS_WEEK',
  // },
  {
    key: 'Incomplete_TaskList_Count',
    label: 'All active tasks',
    tab: taskListStatsTabs.all,
    filter: '',
  },
  {
    key: 'HighPriority_TaskList_Count',
    label: 'Flagged',
    tab: taskListStatsTabs.all,
    filter: 'FLAGGED',
  },
  {
    key: 'DueToday_TaskList_Count',
    label: 'Due today',
    tab: taskListStatsTabs.all,
    filter: 'DUE_TODAY',
  },
  {
    key: 'OverDue_TaskList_Count',
    label: 'Overdue',
    tab: taskListStatsTabs.all,
    filter: 'OVERDUE',
  },
  {
    key: 'Completed_TaskList_Count',
    label: 'Completed this week',
    tab: taskListStatsTabs.all,
    filter: 'COMPLETED_THIS_WEEK',
  },
];
