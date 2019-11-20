import Grid from '@material-ui/core/Grid';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getTaskListStats,
  resetTasklistStats,
} from '../../actions/tasklist-actions';
import HeadsUpAreaChart from './HeadsUpArea.chart';
import {
  HeadsUpAreaContainer,
  HeadsUpButtonsContainer,
  HeadsUpSectionButton,
  HeadsUpSectionButtonCount,
  HeadsUpSectionButtonLabel,
  HeadsUpSectionContainer,
  HeadsUpSectionDivider,
  HeadsUpSectionGrid,
  HeadsUpSectionHeader,
  HeadsUpSectionHeaderButton,
} from './HeadsUpArea.styled';

const taskListStatsTabs = {
  me: 'For Me',
  all: 'All',
};
const taskListTrendsTabs = {
  me: 'For Me',
  all: 'All',
};

// This is the code for the all active tasks tab under the for me heads up section
const taskListStatsElements = [
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
];

const renderCurrentTab = ({
  currentStatsTab,
  currentFilter,
  taskListStats,
  filterChange,
}) => {
  return taskListStatsElements
    .filter(({ tab }) => tab === currentStatsTab)
    .map(({ key, label, filter }) => {
      const isFilterCurrentlySelected = currentFilter === filter;
      const value =
        taskListStats?.stats?.find?.(({ metricName }) => metricName === key)
          ?.metricValue ?? 0;

      return (
        <HeadsUpSectionButton
          onClick={() => {
            filterChange(filter);
          }}
          key={key}
          active={isFilterCurrentlySelected}
        >
          <HeadsUpSectionButtonCount active={isFilterCurrentlySelected}>
            {value}
          </HeadsUpSectionButtonCount>
          <HeadsUpSectionButtonLabel active={isFilterCurrentlySelected}>
            {label}
          </HeadsUpSectionButtonLabel>
        </HeadsUpSectionButton>
      );
    });
};

const renderCurrentTrendTab = ({ currentTrendsTab, taskListStats }) => {
  let taskListTrends = [];

  switch (currentTrendsTab) {
    case taskListTrendsTabs.me:
      taskListTrends = taskListStats.newTasksByMeByDate;
      break;
    case taskListStatsTabs.all:
      taskListTrends = taskListStats.newTasksByDate;
      break;
    default:
      break;
  }

  if (taskListStats) {
    return (
      <HeadsUpAreaChart
        taskListTrends={taskListTrends}
        currentTab={currentTrendsTab}
      />
    );
  }
  return null;
};

const renderTabSwitches = ({ currentActiveTab, tabData, tabSwitchMethod }) =>
  Object.keys(tabData).map(tabKey => {
    const tabLabel = tabData[tabKey];

    return (
      <HeadsUpSectionHeaderButton
        onClick={() => tabSwitchMethod(tabLabel)}
        key={tabKey}
        active={currentActiveTab === tabLabel}
      >
        {tabLabel}
      </HeadsUpSectionHeaderButton>
    );
  });

export default forwardRef(({ taskList, currentFilter, filterChange }, ref) => {
  const dispatch = useDispatch();
  const { taskListStats, taskListStatsOk } = useSelector(store => ({
    taskListStats: store.taskListState.taskListStats,
    taskListStatsOk: store.taskListState.taskListStatsOk,
  }));

  const [currentStatsTab, setCurrentStatsTab] = useState(taskListStatsTabs.me);
  const [currentTrendsTab, setCurrentTrendsTab] = useState(
    taskListTrendsTabs.me,
  );

  const taskListId = taskList?.taskListId;

  useEffect(
    () => {
      if (taskListId) {
        getTaskListStats({ taskListId })(dispatch);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskListId],
  );

  useEffect(() => {
    return () => {
      resetTasklistStats()(dispatch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HeadsUpAreaContainer ref={ref}>
      {taskListStatsOk && (
        <Grid container>
          <HeadsUpSectionGrid container item xs={8}>
            <HeadsUpSectionContainer>
              <div>
                <HeadsUpSectionHeader>
                  <div>Heads Up</div>
                  {renderTabSwitches({
                    currentActiveTab: currentStatsTab,
                    tabData: taskListStatsTabs,
                    tabSwitchMethod: setCurrentStatsTab,
                  })}
                </HeadsUpSectionHeader>
                <HeadsUpSectionDivider />
              </div>
              <HeadsUpButtonsContainer>
                {renderCurrentTab({
                  currentStatsTab,
                  taskListStats,
                  filterChange,
                  currentFilter,
                })}
              </HeadsUpButtonsContainer>
            </HeadsUpSectionContainer>
          </HeadsUpSectionGrid>
          <HeadsUpSectionGrid item xs={4}>
            <HeadsUpSectionContainer>
              <div>
                <HeadsUpSectionHeader>
                  <span>Daily</span>
                  {renderTabSwitches({
                    currentActiveTab: currentTrendsTab,
                    tabData: taskListTrendsTabs,
                    tabSwitchMethod: setCurrentTrendsTab,
                  })}
                </HeadsUpSectionHeader>
                <HeadsUpSectionDivider />
              </div>
              <HeadsUpButtonsContainer>
                {renderCurrentTrendTab({ currentTrendsTab, taskListStats })}
              </HeadsUpButtonsContainer>
            </HeadsUpSectionContainer>
          </HeadsUpSectionGrid>
        </Grid>
      )}
    </HeadsUpAreaContainer>
  );
});
