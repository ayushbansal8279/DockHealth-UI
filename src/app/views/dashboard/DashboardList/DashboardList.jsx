/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import identity from 'ramda/src/identity';
import isEmpty from 'ramda/src/isEmpty';
import Spacing from 'components/common/Spacing';
import * as ModalActions from 'modal/actions';
import { getUserTaskStats } from 'api/user-api';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
  dashboardTabNameSelector,
  dashboardSearchValueSelector,
  selectedTasksSelector,
} from 'selectors/dashboard-selectors';
import DashboardNewUserInfo from 'views/dashboard/DashboardNewUserInfo/DashboardNewUserInfo';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import {
  getDashboardFilters,
  getDashboardGroups,
  getDashboardTasks,
  getDashboardTasksForGroup,
  reorderDashboardTaskGroups,
  updateSortDashboardTasks,
} from 'actions/dashboard-actions';
import { TaskOrigin } from 'helpers/task-helpers';
import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { onSortChanged } from 'helpers/ga-event-helper';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';

import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import {
  dashboardGroupsPreferencesSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { Context } from 'components/common/HorizontalScroll/HorizontalScrollContainer';
import useActions from 'hooks/use-actions';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import { getMultipleSelectedQuickFilterStorageKey } from 'helpers/mega-filter-helper';
import DashboardTasksGroup from './DashboardTasksGroup';
import DashboardToolbar from '../DashboardToolbar/DashboardToolbar';
import {
  StickyHeader,
  EmptyStateContainer,
  VerticalScrollContainer,
  DashboardTaskGroupsWrapper,
} from './styled';
import DashboardCalendar from '../DashboardCalendar/DashboardCalendar';
import localStorageHelper from '@/app/helpers/local-storage-helper';
import { move } from 'ramda';

const DashboardList = ({
  currentUser,
  tourModalIsOpen,
  openTourModal,
  setClearSearch,
  clearFilter,
  setClearFilter,
  isAddTaskDrawer,
  setAddTaskDrawer,
}) => {
  const searchValue = useSelector(dashboardSearchValueSelector);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const viewType = getViewTypeFromQueryString(search);
  const tabName = useSelector(dashboardTabNameSelector);
  const dashboardGroupsPreferences = useSelector(
    dashboardGroupsPreferencesSelector,
  );

  const taskDrawerActions = useActions(TaskDrawerActions);
  const modalActions = useActions(ModalActions);
  const taskActions = useActions(TaskActions);
  const { openModal } = modalActions;
  const isSearchApplied = !!searchValue;

  const dashboardTasks = useSelector(dashboardTasksSelector);
  const dashboardTasksIsLoading = useSelector(dashboardTasksIsLoadingSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);

  const [currentSort, setCurrentSort] = useState({
    key: null,
    order: null,
  });
  const [completeTaskCount, setCompleteTaskCount] = useState();
  const { usageState } = currentUser;
  const isSortApplied = !!currentSort?.key;

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const currentSortMethodWithOrder = useMemo(() => {
    return identity;
  }, []);

  function resetSort() {
    setCurrentSort({
      key: null,
      order: null,
    });
  }

  useEffect(() => {
    if (currentUser) {
      if (tabName === DashboardTasksTab.MY_TASKS) {
        getUserTaskStats(currentUser.userIdentifier).then((counters) => {
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
      dispatch(updateSortDashboardTasks(key, order));
      dashboardTasks?.forEach((item) => {
        if (!areFiltersApplied) {
          dispatch(
            getDashboardTasksForGroup(
              item?.groupType,
              item?.taskGroupIdentifier,
              key,
              order,
            ),
          );
        } else {
          dispatch(getDashboardTasks());
        }
      });
    },
    [dispatch, dashboardTasks, taskActions, areFiltersApplied],
  );

  const showClearSortFiltersModal = useCallback(() => {
    if (isSortApplied || areFiltersApplied || isSearchApplied) {
      openModal('ClearSortFilters', {
        confirm: () => {
          if (isSortApplied) resetSort();
          if (isSearchApplied) setClearSearch(true);
          if (areFiltersApplied) setClearFilter(true);
        },
        closeOnConfirm: true,
      });
    }
  }, [
    areFiltersApplied,
    isSearchApplied,
    isSortApplied,
    openModal,
    setClearFilter,
    setClearSearch,
  ]);

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (usageState?.loginCount < 5) return <DashboardNewUserInfo />;

    if (tabName === DashboardTasksTab.SHARED_TASKS) {
      return (
        <EmptyListView
          title={['There are currently no tasks', 'shared with you.']}
          description=""
        />
      );
    }

    if (completeTaskCount > 0 && tabName === DashboardTasksTab.MY_TASKS) {
      return (
        <EmptyListView
          title={['Way to go!', "You've completed all of your tasks."]}
          description=""
        />
      );
    }

    if (tabName === DashboardTasksTab.MY_TASKS) {
      return (
        <EmptyListView
          widthBreakpoint={1400}
          title={['There are no tasks assigned to you.']}
          description="Please refine filters."
        />
      );
    }

    return (
      <EmptyListView
        widthBreakpoint={1400}
        title={['No tasks to display.']}
        description="Please refine filters."
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

  const groupOrder = useMemo(() => {
    const defaultGroupOrder = dashboardTasks.map((g) =>
      g.groupType === 'QUICK_FILTER' ? g.taskGroupIdentifier : g.groupType,
    );
    // return dashboardGroupsPreferences || defaultGroupOrder;
    return defaultGroupOrder;
  }, [dashboardGroupsPreferences, dashboardTasks]);

  const flattedOrderedDashboardTasks = useMemo(
    () => dashboardTasks.map((g) => g.groupType),
    [dashboardTasks],
  );

  const moveGroupUp = useCallback(
    (groupToMove) => {
      const elementToMove =
        groupToMove.groupType === 'QUICK_FILTER'
          ? groupToMove.groupIdentifier
          : groupToMove.groupType;
      const elementToMoveWholeListIndex = groupOrder.indexOf(elementToMove);

      const newOrder = move(
        elementToMoveWholeListIndex,
        elementToMoveWholeListIndex - 1,
        groupOrder,
      );

      localStorageHelper.setItem(
        getMultipleSelectedQuickFilterStorageKey('dashboard', tabName),
        JSON.stringify(newOrder),
      );
      dispatch(
        reorderDashboardTaskGroups(
          elementToMoveWholeListIndex,
          elementToMoveWholeListIndex - 1,
        ),
      );
    },
    [dispatch, groupOrder, tabName],
  );

  const moveGroupDown = useCallback(
    (groupToMove) => {
      const elementToMove =
        groupToMove.groupType === 'QUICK_FILTER'
          ? groupToMove.groupIdentifier
          : groupToMove.groupType;
      const elementToMoveWholeListIndex = groupOrder.indexOf(elementToMove);

      const newOrder = move(
        elementToMoveWholeListIndex,
        elementToMoveWholeListIndex + 1,
        groupOrder,
      );

      localStorageHelper.setItem(
        getMultipleSelectedQuickFilterStorageKey('dashboard', tabName),
        JSON.stringify(newOrder),
      );
      dispatch(
        reorderDashboardTaskGroups(
          elementToMoveWholeListIndex,
          elementToMoveWholeListIndex + 1,
        ),
      );
      // setTimeout(() => dispatch(getDashboardTasks()), 1000); // If we want to refresh Dashboard
    },
    [dispatch, groupOrder, tabName],
  );

  const parentContainerWidth = useContext(Context);

  const bulkEditTasks = useSelector(selectedTasksSelector);

  return (
    <BulkEditSection
      allTasks={bulkEditTasks}
      refreshTasks={handleRefreshForBulkEdit}
      searchValue={searchValue}
    >
      <>
        <StickyContainer stickyTop zIndex={101}>
          <StickyHeader>
            {parentContainerWidth !== 0 && (
              <DashboardToolbar
                tourModalIsOpen={tourModalIsOpen}
                openTourModal={openTourModal}
                iconColorFilterActive={iconColorFilterActiveItem?.value}
                iconColorActive={iconColorActiveItem?.value}
              />
            )}
          </StickyHeader>
        </StickyContainer>
        <Spacing vertical={1} />
        {viewType === ViewType.CALENDAR_VIEW && (
          <DashboardCalendar clearFilter={clearFilter} />
        )}
        {viewType === ViewType.LIST_VIEW && (
          <VerticalScrollContainer>
            {dashboardTasksIsLoading || completeTaskCount === undefined ? (
              <GroupedListSkeletonLoader numberOfGroups={3} />
            ) : (
              <DashboardTaskGroupsWrapper>
                {isEmpty(dashboardTasks) ? (
                  <EmptyStateContainer>
                    {renderEmptyState()}
                  </EmptyStateContainer>
                ) : (
                  dashboardTasks?.map(
                    (item, index) =>
                      item && (
                        <DashboardTasksGroup
                          key={item?.groupType}
                          dashboardTasksGroup={item}
                          storeAsCurrentTask={taskActions.storeAsCurrentTask}
                          currentSortMethod={currentSortMethodWithOrder}
                          currentSort={currentSort}
                          onSortChange={handleSortChange}
                          showClearSortFiltersModal={showClearSortFiltersModal}
                          isSortApplied={isSortApplied}
                          areFiltersApplied={areFiltersApplied}
                          currentUser={currentUser}
                          updateWorkflowStatus={
                            taskActions.updateWorkflowStatus
                          }
                          isSearching={!!searchValue}
                          closeDrawer={taskDrawerActions.closeDrawer}
                          openModal={openModal}
                          isFirstGroup={index === 0}
                          isLastGroup={index === dashboardTasks.length - 1}
                          moveGroupUp={() => moveGroupUp(item)}
                          moveGroupDown={() => moveGroupDown(item)}
                          iconColorActive={iconColorActiveItem?.value}
                          backgroundColor={!(index % 2 === 0)}
                          showHeader={
                            dashboardTasks.length > 1 ||
                            item?.groupType === 'QUICK_FILTER'
                          }
                        />
                      ),
                  )
                )}
              </DashboardTaskGroupsWrapper>
            )}
          </VerticalScrollContainer>
        )}
        <TaskDrawer
          onTaskUpdate={handleTaskUpdate}
          onTaskCreation={handleTaskUpdate}
          onTaskDelete={() => dispatch(getDashboardFilters())}
          origin={TaskOrigin.DASHBOARD}
          isAddTaskDrawer={isAddTaskDrawer}
          setAddTaskDrawer={setAddTaskDrawer}
        />
      </>
    </BulkEditSection>
  );
};

export default React.memo(DashboardList);
