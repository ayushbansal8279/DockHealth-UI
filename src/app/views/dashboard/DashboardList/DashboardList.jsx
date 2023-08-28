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
} from 'actions/dashboard-actions';
import {
  TASK_ITEM_SORT_METHODS,
  TASK_ITEM_SORT_DESC_METHODS,
  TaskOrigin,
} from 'helpers/task-helpers';
import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { onSortChanged } from 'helpers/ga-event-helper';
import { SortOrderType } from 'helpers/sorting-helper';
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
import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
// import path from 'ramda/src/path';
import sortWith from 'ramda/src/sortWith';
import ascend from 'ramda/src/ascend';
import descend from 'ramda/src/descend';
import toLower from 'ramda/src/toLower';
import defaultTo from 'ramda/src/defaultTo';
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

const DashboardList = ({ currentUser, tourModalIsOpen, openTourModal }) => {
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
  const { key: sortKey, order: sortOrder } = currentSort;

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
    return dashboardTasks?.filter((taskGroupInfo) =>
      dashboardGroupsPreferences?.includes(taskGroupInfo?.groupType),
    );
  }, [dashboardGroupsPreferences, dashboardTasks, tabName]);

  const orderedDashboardTasks = useMemo(() => {
    if (tabName === DashboardTasksTab.SHARED_TASKS) {
      return filteredDashboardTasks;
    }
    const sorted = () => {
      return dashboardGroupsPreferences
        .map((groupType) =>
          filteredDashboardTasks.find((g) => g.groupType === groupType),
        )
        .filter(Boolean);
    };
    return dashboardGroupsPreferences ? sorted() : filteredDashboardTasks;
  }, [dashboardGroupsPreferences, filteredDashboardTasks, tabName]);

  const currentSortMethod = useMemo(() => {
    if (!sortKey) return identity;
    if (sortKey.length === 36) {
      return sortWith([
        ascend(pipe(prop('description'), defaultTo(' '), toLower)),
      ]);
    }
    return TASK_ITEM_SORT_METHODS[sortKey];
  }, [sortKey]);

  const currentSortDescMethod = useMemo(() => {
    if (!sortKey) return identity;
    if (sortKey.length === 36) {
      return sortWith([
        descend(pipe(prop('description'), defaultTo(' '), toLower)),
      ]);
    }
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
          title={['Way to go!', 'You’ve completed all of your tasks.']}
          description="Take a breather, tomorrow is a new day full of possibilities."
        />
      );
    }

    return (
      <EmptyListView
        widthBreakpoint={1400}
        title={['There are no tasks', 'assigned to you.']}
        description="Add tasks above to automatically assign to yourself."
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
