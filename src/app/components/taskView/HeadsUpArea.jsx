import Grid from '@material-ui/core/Grid';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTaskListStats,
  resetTasklistStats,
} from '../../actions/tasklist-actions';
import HeadsUpAreaChart from './HeadsUpArea.Chart';
import {
  taskListStatsElements,
  taskListStatsTabs,
  taskListTrendsTabs,
} from './HeadsUpArea.Data';
import {
  HeadsUpAreaContainer,
  HeadsUpButtonsContainer,
  HeadsUpChartContainer,
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

const renderCurrentTab = ({
  currentStatsTab,
  currentFilter,
  taskListStats,
  filterChange,
}) => {
  return taskListStatsElements
    .filter(({ tab }) => tab === currentStatsTab)
    .map(({ key, label, filter }, _, elements) => {
      const elementsCount = elements.length;
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
          elementsCount={elementsCount}
        >
          <HeadsUpSectionButtonCount active={isFilterCurrentlySelected}>
            {value}
          </HeadsUpSectionButtonCount>
          <HeadsUpSectionButtonLabel active={isFilterCurrentlySelected}>
            <HeadsUpSectionLabelOuterContainer>
              <HeadsUpSectionLabelInnerContainer>
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
      taskListStatsTabs.me,
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

    const elementsCount = taskListStatsElements.filter(
      ({ tab }) => tab === currentStatsTab,
    ).length;

    return (
      <HeadsUpAreaContainer ref={reference}>
        {taskListStatsOk && (
          <Grid container>
            <HeadsUpSectionGrid container item xs={8}>
              <HeadsUpSectionContainer>
                <div>
                  <HeadsUpSectionHeader>
                    {renderTabSwitches({
                      currentActiveTab: currentStatsTab,
                      tabData: taskListStatsTabs,
                      tabSwitchMethod: tabSwitchAction,
                    })}
                  </HeadsUpSectionHeader>
                  <HeadsUpSectionDivider />
                </div>
                <HeadsUpButtonsContainer elementsCount={elementsCount}>
                  {renderCurrentTab({
                    currentStatsTab,
                    taskListStats,
                    filterChange,
                    currentFilter,
                  })}
                </HeadsUpButtonsContainer>
                <HeadsUpSectionDivider />
              </HeadsUpSectionContainer>
            </HeadsUpSectionGrid>
            <HeadsUpSectionGrid item xs={4}>
              <HeadsUpSectionContainer>
                <div>
                  <HeadsUpSectionHeader>
                    {renderChartLabel({
                      currentActiveTab: currentStatsTab,
                      tabData: taskListTrendsTabs,
                    })}
                  </HeadsUpSectionHeader>
                  <HeadsUpSectionDivider />
                </div>
                <HeadsUpChartContainer>
                  {renderCurrentTrendTab({ currentStatsTab, taskListStats })}
                </HeadsUpChartContainer>
                <HeadsUpSectionDivider />
              </HeadsUpSectionContainer>
            </HeadsUpSectionGrid>
          </Grid>
        )}
      </HeadsUpAreaContainer>
    );
  },
);
