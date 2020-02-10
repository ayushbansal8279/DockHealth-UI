import Grid from '@material-ui/core/Grid';
import times from 'ramda/es/times';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
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
  HeadsUpSectionLabelInnerContainer,
  HeadsUpSectionLabelOuterContainer,
} from './HeadsUpArea.Styled';

const taskListStatsTabs = {
  all: 'All',
  me: 'For Me',
};
const taskListTrendsTabs = {
  all: 'All',
  me: 'For Me',
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
    key: 'Completed_AssignToMe_Count',
    label: 'Completed this week',
    tab: taskListStatsTabs.me,
    filter: 'ASSIGNED_TO_ME_COMPLETED_THIS_WEEK',
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
  {
    key: 'Completed_TaskList_Count',
    label: 'Completed this week',
    tab: taskListStatsTabs.all,
    filter: 'COMPLETED_THIS_WEEK',
  },
];

const renderCurrentTab = ({
  currentStatsTab,
  currentFilter,
  taskListStats,
  filterChange,
  innerLabelReferences,
}) => {
  return taskListStatsElements
    .map((props, index) => ({
      ...props,
      innerLabelReference: innerLabelReferences[index],
    }))
    .filter(({ tab }) => tab === currentStatsTab)
    .map(({ key, label, filter, innerLabelReference }, _, elements) => {
      const elementsCount = elements.length;
      const isFilterCurrentlySelected = currentFilter === filter;
      const value =
        taskListStats?.stats?.find?.(({ metricName }) => metricName === key)
          ?.metricValue ?? 0;

      // const innerLabelAnimated =
      //   innerLabelReference.current?.scrollWidth >
      //   innerLabelReference.current?.offsetWidth;
      const innerLabelAnimated = false;

      return (
        <HeadsUpSectionButton
          onClick={() => {
            filterChange(filter);
          }}
          key={key}
          active={isFilterCurrentlySelected}
          elementsCount={elementsCount}
        >
          <HeadsUpSectionButtonCount active={isFilterCurrentlySelected}>
            {value}
          </HeadsUpSectionButtonCount>
          <HeadsUpSectionButtonLabel active={isFilterCurrentlySelected}>
            <HeadsUpSectionLabelOuterContainer>
              <HeadsUpSectionLabelInnerContainer
                animated={innerLabelAnimated}
                ref={innerLabelReference}
                scrollWidth={innerLabelReference.current?.scrollWidth}
              >
                {label}
              </HeadsUpSectionLabelInnerContainer>
            </HeadsUpSectionLabelOuterContainer>
          </HeadsUpSectionButtonLabel>
        </HeadsUpSectionButton>
      );
    });
};

const renderCurrentTrendTab = ({ currentStatsTab, taskListStats }) => {
  let taskListTrends = [];

  switch (currentStatsTab) {
    case taskListStatsTabs.me:
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
        currentTab={currentStatsTab}
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

const renderChartLabel = ({ currentActiveTab }) => (
  <HeadsUpSectionHeaderButton key={currentActiveTab}>
    {currentActiveTab}
  </HeadsUpSectionHeaderButton>
);

export default forwardRef(
  ({ taskList, currentFilter, filterChange }, reference) => {
    const dispatch = useDispatch();
    const { taskListStats, taskListStatsOk } = useSelector(store => ({
      taskListStats: store.taskListState.taskListStats,
      taskListStatsOk: store.taskListState.taskListStatsOk,
    }));

    const [currentStatsTab, setCurrentStatsTab] = useState(
      taskListStatsTabs.all,
    );

    const tabSwitchAction = tabLabel => {
      setCurrentStatsTab(tabLabel);
      if (tabLabel === taskListStatsTabs.all) {
        filterChange('');
      } else {
        filterChange('ASSIGNED_TO_ME');
      }
    };

    const taskListIdentifier = taskList?.taskListIdentifier;

    useEffect(
      () => {
        if (taskListIdentifier) {
          getTaskListStats({ taskListIdentifier })(dispatch);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [taskListIdentifier],
    );

    useEffect(() => {
      return () => {
        resetTasklistStats()(dispatch);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const innerLabelReferences = times(
      () => useRef(null),
      taskListStatsElements.length,
    );

    return (
      <HeadsUpAreaContainer ref={reference}>
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
                      tabSwitchMethod: tabSwitchAction,
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
                    innerLabelReferences,
                  })}
                </HeadsUpButtonsContainer>
              </HeadsUpSectionContainer>
            </HeadsUpSectionGrid>
            <HeadsUpSectionGrid item xs={4}>
              <HeadsUpSectionContainer>
                <div>
                  <HeadsUpSectionHeader>
                    <span>Daily</span>
                    {renderChartLabel({
                      currentActiveTab: currentStatsTab,
                      tabData: taskListTrendsTabs,
                    })}
                  </HeadsUpSectionHeader>
                  <HeadsUpSectionDivider />
                </div>
                <HeadsUpButtonsContainer>
                  {renderCurrentTrendTab({ currentStatsTab, taskListStats })}
                </HeadsUpButtonsContainer>
              </HeadsUpSectionContainer>
            </HeadsUpSectionGrid>
          </Grid>
        )}
      </HeadsUpAreaContainer>
    );
  },
);
