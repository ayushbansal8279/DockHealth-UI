/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { identity, isEmpty } from 'ramda';
import { bindActionCreators } from 'redux';
import EmptyTaskListBird from 'img/animals/bird';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import Spacing from 'components/common/Spacing';
import * as ModalActions from 'modal/actions';
import { getUserTaskStats } from 'api/user-api';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
  dashboardAllTaskItemsSelector,
  dashboardTabNameSelector,
  dashboardSearchValueSelector,
} from 'selectors/dashboard-selectors';
import {
  selectedTaskIdentifierSelector,
  taskDrawerOpenSelector,
} from 'selectors/task-drawer-selectors';
import DashboardNewUserInfo from 'views/dashboard/DashboardNewUserInfo/DashboardNewUserInfo';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import {
  getDashboardFilters,
  getDashboardTasks,
} from 'actions/dashboard-actions';
import {
  TASK_ITEM_SORT_METHODS,
  TASK_ITEM_SORT_DESC_METHODS,
} from 'helpers/task-helpers';
import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import { showNavbar as showNavbarAction } from 'actions/template-actions';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { onSortChanged } from 'helpers/ga-event-helper';
import { SortOrderType } from 'helpers/sorting-helper';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import Calendar from 'components/common/Calendar/Calendar';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import DashboardTasksGroup from './DashboardTasksGroup';
import {
  StickyHeader,
  EmptyStateContainer,
  VerticalScrollContainer,
  DashboardTaskGroupsWrapper,
} from './styled';
import DashboardToolbar from '../DashboardToolbar/DashboardToolbar';

const DashboardList = ({
  allDashboardTasks,
  dashboardTasks,
  dashboardTasksIsLoading,
  currentUser,
  modalActions,
  taskDrawerActions,
  taskActions,
  isTaskDrawerOpen,
  selectedTaskIdentifier,
  areFiltersApplied,
  tourModalIsOpen,
  openTourModal,
}) => {
  const searchValue = useSelector(dashboardSearchValueSelector);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const viewType = getViewTypeFromQueryString(search);
  const { openModal } = modalActions;
  const tabName = useSelector(dashboardTabNameSelector);

  const [currentSort, setCurrentSort] = useState({
    key: null,
    order: null,
  });
  const [completeTaskCount, setCompleteTaskCount] = useState(undefined);

  const filteredDashboardTasks = dashboardTasks?.filter(
    taskGroupInfo => taskGroupInfo?.metricValue !== 0,
  );
  const { usageState } = currentUser;

  const isSortApplied = !!currentSort?.key;

  const { key: sortKey, order: sortOrder } = currentSort;

  const currentSortMethod = useMemo(() => {
    if (!sortKey) return identity;
    return TASK_ITEM_SORT_METHODS[sortKey];
  }, [sortKey]);

  const currentSortDescMethod = useMemo(() => {
    if (!sortKey) return identity;
    return TASK_ITEM_SORT_DESC_METHODS[sortKey];
  }, [sortKey]);

  const currentSortMethodWithOrder = useMemo(() => {
    if (sortOrder === SortOrderType.DESC) {
      return currentSortDescMethod;
    }
    return currentSortMethod;
  }, [sortOrder, currentSortMethod, currentSortDescMethod]);

  function resetSort() {
    setCurrentSort({
      key: null,
      order: null,
    });
  }

  useEffect(() => {
    if (currentUser) {
      if (tabName === DashboardTasksTab.MY_TASKS) {
        getUserTaskStats(currentUser.userIdentifier).then(counters => {
          const completeTaskCounter = counters.find(
            ({ metricName }) => metricName === 'COMPLETE_TASKS_COUNT',
          );

          if (completeTaskCounter) {
            setCompleteTaskCount(completeTaskCounter.metricValue);
          }
        });
      } else {
        setCompleteTaskCount(null);
      }
    }
  }, [currentUser, tabName]);

  useEffect(() => {
    resetSort();
  }, [tabName]);

  const handleSortChange = useCallback(
    (key, order) => {
      taskActions.unselectAllTasks();
      onSortChanged(order ? key : null, order);
      setCurrentSort({
        key: order ? key : null,
        order,
      });
    },
    [taskActions],
  );

  const showClearSortFiltersModal = () => {
    if (isSortApplied) {
      openModal('ClearSortFilters', {
        confirm: () => {
          resetSort();
        },
        closeOnConfirm: true,
      });
    }
  };

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (usageState?.loginCount < 5) return <DashboardNewUserInfo />;

    if (completeTaskCount > 0 && tabName === DashboardTasksTab.MY_TASKS)
      return (
        <EmptyListView
          title={['Way to go!', 'You’ve completed all of your tasks.']}
          description="Take a breather, tomorrow is a new day full of possibilities."
          image={EmptyTaskListAlpaca}
        />
      );

    return (
      <EmptyListView
        widthBreakpoint={1400}
        title={['There are no tasks', 'assigned to you.']}
        description="Add tasks above to automatically assign to yourself."
        image={EmptyTaskListBird}
      />
    );
  };

  const handleTaskUpdate = useCallback(() => {
    dispatch(getDashboardFilters());
  }, [dispatch]);

  const handleRefreshForBulkEdit = useCallback(() => {
    dispatch(getDashboardFilters());
    dispatch(getDashboardTasks());
  }, [dispatch]);

  const tasks = useMemo(
    () =>
      filteredDashboardTasks.reduce((accumulator, value) => {
        return value?.tasks ? [...accumulator, ...value.tasks] : accumulator;
      }, []),
    [filteredDashboardTasks],
  );

  return (
    <BulkEditSection
      allTasks={allDashboardTasks}
      refreshTasks={handleRefreshForBulkEdit}
      searchValue={searchValue}
    >
      <StickyHeader>
        <DashboardToolbar
          tourModalIsOpen={tourModalIsOpen}
          openTourModal={openTourModal}
        />
      </StickyHeader>
      <Spacing vertical={1} />
      {viewType === ViewType.CALENDAR_VIEW && (
        <Calendar taskList={tasks} showInCompleteTasksOnly />
      )}
      {viewType === ViewType.LIST_VIEW && (
        <VerticalScrollContainer>
          {dashboardTasksIsLoading || completeTaskCount === undefined ? (
            <GroupedListSkeletonLoader numberOfGroups={3} />
          ) : (
            <DashboardTaskGroupsWrapper>
              {!isEmpty(filteredDashboardTasks) ? (
                filteredDashboardTasks?.map(
                  item =>
                    item && (
                      <DashboardTasksGroup
                        key={item?.groupType}
                        dashboardTasksGroup={item}
                        storeAsCurrentTask={taskActions.storeAsCurrentTask}
                        openDrawer={taskDrawerActions.openDrawer}
                        isTaskDrawerOpen={isTaskDrawerOpen}
                        selectedTaskIdentifier={selectedTaskIdentifier}
                        currentSortMethod={currentSortMethodWithOrder}
                        currentSort={currentSort}
                        onSortChange={handleSortChange}
                        showClearSortFiltersModal={showClearSortFiltersModal}
                        isSortApplied={isSortApplied}
                        areFiltersApplied={areFiltersApplied}
                        isAllTasksTab={tabName === DashboardTasksTab.ALL_TASKS}
                        currentUser={currentUser}
                        updateWorkflowStatus={taskActions.updateWorkflowStatus}
                        isSearching={!!searchValue}
                        closeDrawer={taskDrawerActions.closeDrawer}
                        openModal={openModal}
                      />
                    ),
                )
              ) : (
                <EmptyStateContainer>{renderEmptyState()}</EmptyStateContainer>
              )}
            </DashboardTaskGroupsWrapper>
          )}
        </VerticalScrollContainer>
      )}
      <TaskDrawer
        onTaskUpdate={handleTaskUpdate}
        onTaskCreation={handleTaskUpdate}
        onTaskDelete={() => dispatch(getDashboardFilters())}
      />
    </BulkEditSection>
  );
};

const mapStateToProps = state => ({
  allDashboardTasks: dashboardAllTaskItemsSelector(state),
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  selectedTaskIdentifier: selectedTaskIdentifierSelector(state),
  areFiltersApplied: hasFiltersAppliedSelector(state),
  isTaskDrawerOpen: taskDrawerOpenSelector(state),
});

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  showNavbar: bindActionCreators(showNavbarAction, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(DashboardList));
