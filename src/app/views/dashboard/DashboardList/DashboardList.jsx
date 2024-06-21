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
  getDashboardTasks,
  getDashboardTasksForGroup,
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
// import ifElse from 'ramda/src/ifElse';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import DashboardTasksGroup from './DashboardTasksGroup';
import DashboardToolbar from '../DashboardToolbar/DashboardToolbar';
import {
  StickyHeader,
  EmptyStateContainer,
  VerticalScrollContainer,
  DashboardTaskGroupsWrapper,
} from './styled';
import DashboardCalendar from '../DashboardCalendar/DashboardCalendar';

const DashboardList = ({
  currentUser,
  tourModalIsOpen,
  openTourModal,
  setClearSearch,
  setClearFilter,
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
  // const { key: sortKey, order: sortOrder } = currentSort;

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const filteredDashboardTasks = useMemo(() => {
    if (tabName === DashboardTasksTab.SHARED_TASKS) {
      return dashboardTasks;
    }

    // if (tabName === DashboardTasksTab.UPCOMING) {
    //   return dashboardTasks?.filter(
    //     (taskGroupInfo) =>
    //       !(
    //         taskGroupInfo?.groupType
    //           .toLowerCase()
    //           .includes(DashboardTasksTab.COMPLETED.toLowerCase()) ||
    //         taskGroupInfo?.groupType
    //           .toLowerCase()
    //           .includes(DashboardTasksTab.OVERDUE.toLowerCase())
    //       ),
    //   );
    // }

    // if (tabName === DashboardTasksTab.OVERDUE) {
    //   return dashboardTasks?.filter((taskGroupInfo) =>
    //     taskGroupInfo?.groupType
    //       .toLowerCase()
    //       .includes(DashboardTasksTab.OVERDUE.toLowerCase()),
    //   );
    // }

    // if (tabName === DashboardTasksTab.COMPLETED) {
    //   return dashboardTasks?.filter((taskGroupInfo) =>
    //     taskGroupInfo?.groupType
    //       .toLowerCase()
    //       .includes(DashboardTasksTab.COMPLETED.toLowerCase()),
    //   );
    // }

    // return dashboardTasks?.filter((taskGroupInfo) =>
    //   dashboardGroupsPreferences?.includes(taskGroupInfo?.groupType),
    // );
    return dashboardTasks;
  }, [dashboardTasks, tabName]);

  const orderedDashboardTasks = useMemo(() => {
    if (tabName === DashboardTasksTab.SHARED_TASKS) {
      return filteredDashboardTasks;
    }
    // const sorted = () => {
    //   return dashboardGroupsPreferences
    //     .map((groupType) =>
    //       filteredDashboardTasks.find((g) => g.groupType === groupType),
    //     )
    //     .filter(Boolean);
    // };
    // return dashboardGroupsPreferences ? sorted() : filteredDashboardTasks;
    return filteredDashboardTasks;
  }, [filteredDashboardTasks, tabName]);

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
      // eslint-disable-next-line array-callback-return
      orderedDashboardTasks?.map((item) => {
        if (!areFiltersApplied) {
          dispatch(getDashboardTasksForGroup(item?.groupType, key, order));
        } else {
          dispatch(getDashboardTasks(key, order));
        }
      });
    },
    [areFiltersApplied, dispatch, orderedDashboardTasks, taskActions],
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
    const defaultGroupOrder = dashboardTasks.map((g) => g.groupType);
    return dashboardGroupsPreferences || defaultGroupOrder;
  }, [dashboardGroupsPreferences, dashboardTasks]);

  const flattedOrderedDashboardTasks = useMemo(
    () => orderedDashboardTasks.map((g) => g.groupType),
    [orderedDashboardTasks],
  );

  const moveGroupUp = useCallback(
    (groupToMove) => {
      const elementToMove = groupToMove.groupType;
      const elementToMoveWholeListIndex = groupOrder.indexOf(elementToMove);
      const elementToMoveLimitedListIndex =
        flattedOrderedDashboardTasks.indexOf(elementToMove);
      const elementAbove =
        flattedOrderedDashboardTasks[elementToMoveLimitedListIndex - 1];
      const elementAboveWholeListIndex = groupOrder.indexOf(elementAbove);
      const partBeforeUpperElement = groupOrder.slice(
        0,
        elementAboveWholeListIndex,
      );
      const partAfterUpperElement = [
        ...groupOrder.slice(
          elementAboveWholeListIndex + 1,
          elementToMoveWholeListIndex,
        ),
        ...groupOrder.slice(elementToMoveWholeListIndex + 1),
      ];
      const newOrder = [
        ...partBeforeUpperElement,
        elementToMove,
        elementAbove,
        ...partAfterUpperElement,
      ];
      dispatch(
        updateCurrentUserPreferences({
          displayGroups: newOrder,
        }),
      );
    },
    [dispatch, flattedOrderedDashboardTasks, groupOrder],
  );

  const moveGroupDown = useCallback(
    (groupToMove) => {
      const elementToMove = groupToMove.groupType;
      const elementToMoveWholeListIndex = groupOrder.indexOf(elementToMove);
      const elementToMoveLimitedListIndex =
        flattedOrderedDashboardTasks.indexOf(elementToMove);

      const elementBelow =
        flattedOrderedDashboardTasks[elementToMoveLimitedListIndex + 1];
      const elementBelowWholeListIndex = groupOrder.indexOf(elementBelow);

      const partBeforeFirstElement = groupOrder.slice(
        0,
        elementToMoveWholeListIndex,
      );
      const partBetweenFirstAndSecondElement = groupOrder.slice(
        elementToMoveWholeListIndex + 1,
        elementBelowWholeListIndex,
      );

      const partAfterUpperElement = groupOrder.slice(
        elementBelowWholeListIndex + 1,
      );

      const newOrder = [
        ...partBeforeFirstElement,
        ...partBetweenFirstAndSecondElement,
        elementBelow,
        elementToMove,
        ...partAfterUpperElement,
      ];

      dispatch(
        updateCurrentUserPreferences({
          displayGroups: newOrder,
        }),
      );
    },
    [dispatch, flattedOrderedDashboardTasks, groupOrder],
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
        {viewType === ViewType.CALENDAR_VIEW && <DashboardCalendar />}
        {viewType === ViewType.LIST_VIEW && (
          <VerticalScrollContainer>
            {dashboardTasksIsLoading || completeTaskCount === undefined ? (
              <GroupedListSkeletonLoader numberOfGroups={3} />
            ) : (
              <DashboardTaskGroupsWrapper>
                {isEmpty(orderedDashboardTasks) ? (
                  <EmptyStateContainer>
                    {renderEmptyState()}
                  </EmptyStateContainer>
                ) : (
                  orderedDashboardTasks?.map(
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
                          isLastGroup={
                            index === orderedDashboardTasks.length - 1
                          }
                          moveGroupUp={() => moveGroupUp(item)}
                          moveGroupDown={() => moveGroupDown(item)}
                          iconColorActive={iconColorActiveItem?.value}
                          backgroundColor={!(index % 2 === 0)}
                          showHeader={orderedDashboardTasks.length > 1}
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
        />
      </>
    </BulkEditSection>
  );
};

export default React.memo(DashboardList);
