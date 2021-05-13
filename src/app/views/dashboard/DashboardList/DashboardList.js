/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { identity, isEmpty } from 'ramda';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';
import EmptyTaskListBird from 'img/animals/bird';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import { Grid } from '@material-ui/core';
import Switch from 'components/common/Switch/Switch';
import Spacing from 'components/common/Spacing';
import * as ModalActions from 'modal/actions';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import { getTaskStatsForUser } from 'api/task-api';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
  dashboardAllTaskItemsSelector,
} from 'selectors/dashboard-tasks-selectors';
import { userProfileDashboardPrefsSelector } from 'selectors/user-selectors';
import { selectedTaskIdentifierSelector } from 'selectors/task-drawer-selectors';
import { dashboardStatisticsIsLoadingSelector } from 'selectors/dashboard-statistics-selectors';
import * as DashboardActions from 'sagas/dashboard-saga';
import DashboardNewUserInfo from 'views/dashboard/DashboardNewUserInfo/DashboardNewUserInfo';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import Search from 'components/task-view/Search/Search';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import {
  TASK_ITEM_BASE_COLUMN_CONFIG,
  TaskItemColumn,
  TASK_ITEM_SORT_METHODS,
  TASK_ITEM_SORT_DESC_METHODS,
} from 'helpers/task-helpers';

import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import { showNavbar as showNavbarAction } from 'actions/template-actions';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import {
  megaFilterSelector,
  hasFiltersAppliedSelector,
} from 'selectors/mega-filter-selectors';
import { onSearchChanged, onSortChanged } from 'helpers/ga-event-helper';
import { SortOrderType } from 'helpers/sorting-helper';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import DashboardSettings from '../DashboardSettings/DashboardSettings';
import DashboardTasksGroup from './DashboardTasksGroup';
import {
  ToolbarContainer,
  SearchGrid,
  ActionsContainer,
  StickyHeader,
  DasboardTabsContainer,
  DashboardTab as StyledDashboardTab,
  DashboardTabHighlight,
  EmptyStateContainer,
  TipsSwitchLabel,
} from './styled';
import DashboardSkeletonLoader from '../DashboardSkeletonLoader/DashboardSkeletonLoader';

const DASHBOARD_BASE_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.LIST_NAME]: true,
};

const DASHBOARD_CONFIGURABLE_COLUMNS_CONFIG = {
  [TaskItemColumn.WORKFLOW_STATUS]: false,
  [TaskItemColumn.ASSIGNED]: false,
  [TaskItemColumn.ACTIVITY]: false,
};

export const DashboardTab = ({
  label,
  setHighlightPosition,
  isSelected,
  onClick,
}) => {
  const labelReference = useRef(null);
  useEffect(() => {
    if (isSelected) {
      setHighlightPosition({
        width: labelReference?.current?.offsetWidth,
        left: labelReference?.current?.offsetLeft,
      });
    }
  }, [labelReference, setHighlightPosition, isSelected]);

  return (
    <StyledDashboardTab
      ref={labelReference}
      onClick={onClick}
      isSelected={isSelected}
    >
      {label}
    </StyledDashboardTab>
  );
};

const debouncer = debounce(f => f(), 1100, { leading: true });

function usePrevious(value) {
  const reference = useRef();
  useEffect(() => {
    reference.current = value;
  });
  return reference.current;
}

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
  userPreferColumns,
  dashboardTab,
  dashboardActions: {
    redirectToParentTask,
    toggleDashboardTaskComplete,
    quickAddDashboardTask,
    sortDashboardTasks,
    reloadDashboardTasks,
    updateDashboardTaskDueDate,
    updateDashboardSelectedFilters,
    updateDashboardTask,
    fetchDashboardFilters,
    fetchImplicitGroup,
    fetchSearchedTermImplicitGroups,
    initializeDashboardView,
  },
  megaFilter,
  areFiltersApplied,
  tourModalIsOpen,
  openTourModal,
}) => {
  const history = useHistory();
  const { openModal } = modalActions;
  const [selectedTab, setSelectedTab] = useState('MY_TASKS');
  const [highlightPosition, setHighlightPosition] = useState({
    width: 0,
    left: 0,
  });
  const [searchValue, setSearchValue] = useState('');
  const previousSearchState = usePrevious({ searchValue });
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentSort, setCurrentSort] = useState({
    key: null,
    order: null,
  });
  const [completeTaskCount, setCompleteTaskCount] = useState(undefined);
  const [columnsConfig, setColumnsConfig] = useState(
    () =>
      userPreferColumns?.reduce(
        (accumulator, value) => ({ ...accumulator, [value]: true }),
        DASHBOARD_CONFIGURABLE_COLUMNS_CONFIG,
      ) || {},
  );
  const { filters, selectedFilters } = megaFilter;

  const previousSelectedFilters = useRef(selectedFilters);
  const previousSearchValue = useRef(null);
  const previousSelectedTab = useRef(null);

  useEffect(() => {
    previousSelectedFilters.current = selectedFilters;
  }, [selectedFilters]);

  useEffect(() => {
    previousSearchValue.current = searchValue;
  }, [searchValue]);

  useEffect(() => {
    previousSelectedTab.current = selectedTab;
  }, [selectedTab]);

  const filteredDashboardTasks = dashboardTasks?.filter(
    taskGroupInfo => taskGroupInfo?.metricValue !== 0,
  );
  const { userIdentifier, usageState } = currentUser;

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
      if (selectedTab === 'MY_TASKS') {
        getTaskStatsForUser(currentUser.userIdentifier).then(counters => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTasks, selectedTab]);

  useEffect(
    () =>
      debouncer(() => {
        if (searchValue !== previousSearchState?.searchValue && searchFocused) {
          onSearchChanged();
          fetchSearchedTermImplicitGroups(searchValue);
        }

        if (previousSearchState?.searchValue && !searchValue && searchFocused) {
          initializeDashboardView();
        }
      }),
    [
      searchValue,
      searchFocused,
      fetchSearchedTermImplicitGroups,
      initializeDashboardView,
      previousSearchState,
    ],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (dashboardTab === 'all-tasks') {
      setSelectedTab('ALL_TASKS');
    } else {
      setSelectedTab('MY_TASKS');
    }
  });

  useEffect(() => {
    setSearchValue('');
    setSearchFocused(false);
    resetSort();
  }, [selectedTab]);

  useEffect(() => {
    resetSort();
  }, [columnsConfig]);

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

  const handleQuickAddTask = (
    quickAddTaskInputReference,
    { description, patientIdentifier },
    dueDate,
  ) => {
    modalActions.openModal('ListPicker', {
      fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
      listCreationPayload: {
        adminIdentifiers:
          currentUser.userIdentifier !== userIdentifier ? [userIdentifier] : [],
      },
      confirm: taskListIdentifier => {
        quickAddDashboardTask({
          description,
          taskListIdentifier,
          assignedToIdentifier: userIdentifier,
          patientIdentifier,
          dueDate,
        });
        quickAddTaskInputReference.current.focus();
      },
    });
  };

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (usageState?.loginCount < 5) return <DashboardNewUserInfo />;

    if (completeTaskCount > 0 && selectedTab === 'MY_TASKS')
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

  const activeTasksCount = useMemo(
    () =>
      filteredDashboardTasks?.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue?.tasks?.length || 0),
        0,
      ),
    [filteredDashboardTasks],
  );

  const handleTaskUpdate = useCallback(() => {
    fetchDashboardFilters();
    reloadDashboardTasks();
  }, [reloadDashboardTasks, fetchDashboardFilters]);

  const mergedColumnsConfig = useMemo(
    () => ({ ...DASHBOARD_BASE_COLUMNS_CONFIG, ...columnsConfig }),
    [columnsConfig],
  );

  return (
    <BulkEditSection
      allTasks={allDashboardTasks}
      refreshTasks={handleTaskUpdate}
      searchValue={searchValue}
      shouldRefreshTasksEveryTime
    >
      <StickyHeader>
        <ToolbarContainer container direction="row" justify="space-between">
          <Grid item md={4}>
            <DasboardTabsContainer>
              <DashboardTab
                label="My Tasks"
                setHighlightPosition={setHighlightPosition}
                onClick={() => {
                  setSelectedTab('MY_TASKS');
                  history.push('/core/home/my-tasks');
                }}
                isSelected={selectedTab === 'MY_TASKS'}
              />
              <DashboardTab
                label="All Tasks"
                setHighlightPosition={setHighlightPosition}
                onClick={() => {
                  setSelectedTab('ALL_TASKS');
                  history.push('/core/home/all-tasks');
                }}
                isSelected={selectedTab === 'ALL_TASKS'}
              />
              <DashboardTabHighlight {...highlightPosition} />
            </DasboardTabsContainer>
          </Grid>
          <ActionsContainer item md={8}>
            <MegaFilter
              popoverStyles={{
                width: 'calc(100% - 420px)',
                right: '100px',
              }}
              filters={filters}
              selectedFilters={selectedFilters}
              onSelectFilters={updateDashboardSelectedFilters}
              taskStatus="INCOMPLETE"
              activeItemsAmount={activeTasksCount}
            />
            <Spacing horizontal={4} />
            <SearchGrid isFocused={searchFocused || searchValue}>
              <Search
                fullWidth
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                value={searchValue}
                onChange={event => setSearchValue(event?.target?.value)}
                placeholder="Search Tasks"
              />
            </SearchGrid>
            <Spacing horizontal={4} />
            <div>
              <TipsSwitchLabel>Tips</TipsSwitchLabel>
              <Switch checked={tourModalIsOpen} onChange={openTourModal} />
            </div>
            <Spacing horizontal={4} />
            <DashboardSettings
              columnsConfig={columnsConfig}
              setColumnsConfig={setColumnsConfig}
            />
          </ActionsContainer>
        </ToolbarContainer>
      </StickyHeader>
      <Spacing vertical={1} />
      {dashboardTasksIsLoading || completeTaskCount === undefined ? (
        <DashboardSkeletonLoader />
      ) : (
        <>
          {!isEmpty(filteredDashboardTasks) ? (
            filteredDashboardTasks?.map(
              item =>
                item && (
                  <DashboardTasksGroup
                    key={item?.groupType}
                    dashboardTasksGroup={item}
                    toggleDashboardTaskComplete={toggleDashboardTaskComplete}
                    redirectToParentTask={redirectToParentTask}
                    storeAsCurrentTask={taskActions.storeAsCurrentTask}
                    sortDashboardTasks={sortDashboardTasks}
                    openDrawer={taskDrawerActions.openDrawer}
                    isTaskDrawerOpen={isTaskDrawerOpen}
                    selectedTaskIdentifier={selectedTaskIdentifier}
                    currentSortMethod={currentSortMethodWithOrder}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    columnsConfig={mergedColumnsConfig}
                    showClearSortFiltersModal={showClearSortFiltersModal}
                    isSortApplied={isSortApplied}
                    areFiltersApplied={areFiltersApplied}
                    isAllTasksTab={selectedTab === 'ALL_TASKS'}
                    updateDueDate={updateDashboardTaskDueDate}
                    currentUser={currentUser}
                    onTaskUpdate={updateDashboardTask}
                    updateWorkflowStatus={taskActions.updateWorkflowStatus}
                    fetchImplicitGroup={fetchImplicitGroup}
                    fetchSearchedTermImplicitGroups={
                      fetchSearchedTermImplicitGroups
                    }
                    isSearching={!!searchValue}
                    closeDrawer={taskDrawerActions.closeDrawer}
                    handleQuickAddTask={handleQuickAddTask}
                    openModal={openModal}
                  />
                ),
            )
          ) : (
            <EmptyStateContainer>{renderEmptyState()}</EmptyStateContainer>
          )}
        </>
      )}
      <TaskDrawer
        modalActions={modalActions}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreation={handleTaskUpdate}
        onTaskDelete={fetchDashboardFilters}
        assignToSelf
      />
    </BulkEditSection>
  );
};

const mapStateToProps = state => ({
  allDashboardTasks: dashboardAllTaskItemsSelector(state),
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  dashboardStatisticsIsLoading: dashboardStatisticsIsLoadingSelector(state),
  selectedTaskIdentifier: selectedTaskIdentifierSelector(state),
  userPreferColumns: userProfileDashboardPrefsSelector(state),
  megaFilter: megaFilterSelector(state),
  areFiltersApplied: hasFiltersAppliedSelector(state),
});

const mapDispatchToProps = dispatch => ({
  dashboardActions: bindActionCreators(DashboardActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  showNavbar: bindActionCreators(showNavbarAction, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(DashboardList));
