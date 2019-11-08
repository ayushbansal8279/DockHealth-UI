import Grid from '@material-ui/core/Grid';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getTaskListStats,
  resetTasklistStats,
} from '../../actions/tasklist-actions';
import {
  HeadsUpButtonsContainer,
  HeadsUpSectionButton,
  HeadsUpSectionButtonCount,
  HeadsUpSectionButtonLabel,
  HeadsUpSectionContainer,
  HeadsUpSectionGrid,
  HeadsUpSectionHeader,
  HeadsUpSectionHeaderButton,
} from './HeadsUpArea.styled';
import HeadsUpAreaChart from './HeadsUpArea.chart';

const taskListStatsTabs = {
  me: 'Me',
  all: 'All',
};

const taskListStatsElements = [
  {
    key: 'Incomplete_TaskList_Count',
    label: 'All active tasks',
    tab: taskListStatsTabs.me,
  },
  {
    key: 'AssignedToMe_TaskList_Count',
    label: 'Assigned to me',
    tab: taskListStatsTabs.me,
  },
  {
    key: 'HighPriority_AssignToMe_Count',
    tab: taskListStatsTabs.me,
    label: 'Flagged',
  },
  {
    key: 'DueToday_AssignToMe_Count',
    label: 'Due today',
    tab: taskListStatsTabs.me,
  },
  {
    key: 'OverDue_AssignToMe_Count',
    label: 'Overdue',
    tab: taskListStatsTabs.me,
  },
  {
    key: 'Incomplete_TaskList_Count',
    label: 'All active tasks',
    tab: taskListStatsTabs.all,
  },
  {
    key: 'HighPriority_TaskList_Count',
    label: 'Flagged',
    tab: taskListStatsTabs.all,
  },
  {
    key: 'DueToday_TaskList_Count',
    label: 'Due today',
    tab: taskListStatsTabs.all,
  },
  {
    key: 'OverDue_TaskList_Count',
    label: 'Overdue',
    tab: taskListStatsTabs.all,
  },
];

const renderCurrentTab = ({ currentStatsTab, taskListStats }) => {
  return taskListStatsElements
    .filter(({ tab }) => tab === currentStatsTab)
    .map(({ key, label }) => {
      const value =
        taskListStats?.stats?.find(({ metricName }) => metricName === key)
          ?.metricValue ?? 0;

      return (
        <HeadsUpSectionButton
          onClick={e => {
            e.preventDefault();
          }}
          key={key}
        >
          <HeadsUpSectionButtonCount>{value}</HeadsUpSectionButtonCount>
          <HeadsUpSectionButtonLabel>{label}</HeadsUpSectionButtonLabel>
        </HeadsUpSectionButton>
      );
    });
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

export default forwardRef(({ taskList }, ref) => {
  const dispatch = useDispatch();
  const { taskListStats, taskListStatsOk } = useSelector(store => ({
    taskListStats: store.taskListState.taskListStats,
    taskListStatsOk: store.taskListState.taskListStatsOk,
  }));

  const [currentStatsTab, setCurrentStatsTab] = useState(taskListStatsTabs.me);

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
    <div ref={ref}>
      {taskListStatsOk === true && (
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
              </div>
              <HeadsUpButtonsContainer>
                {renderCurrentTab({ currentStatsTab, taskListStats })}
              </HeadsUpButtonsContainer>
            </HeadsUpSectionContainer>
          </HeadsUpSectionGrid>
          <HeadsUpSectionGrid item xs={4}>
            <HeadsUpSectionContainer>
              <div>
                <HeadsUpSectionHeader>
                  <span>Daily</span>
                  <small> (All) </small>
                </HeadsUpSectionHeader>
              </div>
              <HeadsUpAreaChart taskListStats={taskListStats}/>
            </HeadsUpSectionContainer>
          </HeadsUpSectionGrid>
        </Grid>
      )}
    </div>
  );
});
