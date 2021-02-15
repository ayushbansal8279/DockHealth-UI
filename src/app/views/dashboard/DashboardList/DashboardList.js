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
import {
  identity,
  isEmpty,
  pipe,
  prop,
  path,
  sortWith,
  ascend,
  descend,
  defaultTo,
  toLower,
  trim,
  ifElse,
} from 'ramda';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';
import EmptyTaskListBird from 'img/animals/bird';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import { Grid } from '@material-ui/core';
import Switch from 'components/common/Switch/Switch';
import Spacing from 'components/common/Spacing';
import * as ModalActions from 'modal/actions';
import { getSharedTaskListsWithCurrentUser } from 'api/tasklist-api';
import { getTaskStatsForUser } from 'api/task-api';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';
import { userProfileDashbaordPrefsSelector } from 'selectors/user-selectors';
import { selectedTaskIdentifierSelector } from 'selectors/task-selectors';
import { dashboardStatisticsIsLoadingSelector } from 'selectors/dashboard-statistics-selectors';
import * as DashboardActions from 'sagas/dashboard-saga';
import DashboardNewUserInfo from 'views/dashboard/DashboardNewUserInfo/DashboardNewUserInfo';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Search from 'components/task-view/Search/Search';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import {
  storeAsCurrentTask as storeAsCurrentTaskAction,
  updateWorkflowStatus as updateWorkflowStatusAction,
} from 'actions/task-actions';
import {
  openDrawer as openDrawerAction,
  closeDrawer as closeDrawerAction,
} from 'actions/task-drawer-actions';
import { showNavbar as showNavbarAction } from 'actions/template-actions';
import NewTaskDrawer from 'components/task-drawer/NewTaskDrawer';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import {
  megaFilterSelector,
  hasFiltersAppliedSelector,
} from 'selectors/mega-filter-selectors';
import { SortOrderType } from 'helpers/sorting-helper';
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
import { DashboardColumnKey } from '../config';

const SORT_METHODS = {
  [DashboardColumnKey.DUE_DATE]: sortWith([
    ascend(pipe(prop('dueDate'), defaultTo('~'))),
  ]),
  [DashboardColumnKey.WORKFLOW_STATUS]: sortWith([
    ascend(pipe(prop('workflowStatus'), defaultTo('~'), toLower)),
  ]),
  [DashboardColumnKey.PATIENT]: sortWith([
    ascend(
      ifElse(
        path(['patient', 'patientName']),
        pipe(path(['patient', 'patientName']), defaultTo('~'), toLower),
        pipe(
          path(['parentTask', 'patient', 'patientName']),
          defaultTo('~'),
          toLower,
        ),
      ),
    ),
  ]),
  [DashboardColumnKey.ASSIGNED]: sortWith([
    ascend(pipe(path(['assignedTo', 'userName']), defaultTo('~'), toLower)),
  ]),
  [DashboardColumnKey.LIST_NAME]: sortWith([
    ascend(pipe(path(['taskList', 'listName']), defaultTo('~'), toLower, trim)),
  ]),
};

const SORT_DESC_METHODS = {
  [DashboardColumnKey.DUE_DATE]: sortWith([
    descend(pipe(prop('dueDate'), defaultTo(' '))),
  ]),
  [DashboardColumnKey.WORKFLOW_STATUS]: sortWith([
    descend(pipe(prop('workflowStatus'), defaultTo(' '), toLower)),
  ]),
  [DashboardColumnKey.PATIENT]: sortWith([
    descend(
      ifElse(
        path(['patient', 'patientName']),
        pipe(path(['patient', 'patientName']), defaultTo(' '), toLower),
        pipe(
          path(['parentTask', 'patient', 'patientName']),
          defaultTo(' '),
          toLower,
        ),
      ),
    ),
  ]),
  [DashboardColumnKey.ASSIGNED]: sortWith([
    descend(pipe(path(['assignedTo', 'userName']), defaultTo(' '), toLower)),
  ]),
  [DashboardColumnKey.LIST_NAME]: sortWith([
    descend(
      pipe(path(['taskList', 'listName']), defaultTo(' '), toLower, trim),
    ),
  ]),
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
  dashboardTasks,
  dashboardTasksIsLoading,
  currentUser,
  modalActions,
  storeAsCurrentTask,
  openDrawer,
  isTaskDrawerOpen,
  selectedTaskIdentifier,
  closeDrawer,
  userPreferColumn,
  dashboardTab,
  dashboardActions: {
    redirectToParentTask,
    toggleDashboardTaskComplete,
    quickAddDashboardTask,
    sortDashboardTasks,
    reloadDashboardTasks,
    updateDashboardTaskDueDate,
    updateDashboardSelectedFilters,
    reassignDashboardTask,
    fetchDashboardFilters,
    fetchImplicitGroup,
    fetchSearchedTermImplicitGroups,
    initializeDashboardView,
  },
  megaFilter,
  areFiltersApplied,
  tourModalIsOpen,
  openTourModal,
  updateWorkflowStatus,
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
  const [dynamicColumnType, setDynamicColumnType] = useState(
    userPreferColumn || DashboardColumnKey.DUE_DATE,
  );
  const quickAddTaskInputReference = useRef(null);

  const filteredDashboardTasks = dashboardTasks?.filter(
    taskGroupInfo => taskGroupInfo?.metricValue !== 0,
  );
  const { userIdentifier, usageState } = currentUser;
  const { filters, selectedFilters } = megaFilter;

  const isSortApplied = !!currentSort?.key;

  const { key: sortKey, order: sortOrder } = currentSort;

  const currentSortMethod = useMemo(() => {
    if (!sortKey) return identity;
    return SORT_METHODS[sortKey];
  }, [sortKey]);

  const currentSortDescMethod = useMemo(() => {
    if (!sortKey) return identity;
    return SORT_DESC_METHODS[sortKey];
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
  }, [dynamicColumnType]);

  const handleSortChange = useCallback(
    (key, order) => {
      setCurrentSort({
        key: order ? key : null,
        order,
      });
    },
    [setCurrentSort],
  );

  const showClearSortFiltersModal = () => {
    if (isSortApplied || areFiltersApplied) {
      openModal('ClearSortFilters', {
        confirm: () => {
          resetSort();
          updateDashboardSelectedFilters({});
        },
        closeOnConfirm: true,
      });
    }
  };

  const handleQuickAddTask = ({ description, patientIdentifier }) => {
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

  return (
    <>
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
              setDynamicColumnType={setDynamicColumnType}
              dynamicColumnType={dynamicColumnType}
            />
          </ActionsContainer>
        </ToolbarContainer>
        <QuickAddTaskInput
          ref={quickAddTaskInputReference}
          quickAddTask={handleQuickAddTask}
          onFocus={() => {
            if (isTaskDrawerOpen) {
              closeDrawer();
              storeAsCurrentTask(null);
            }
          }}
          validator={value => {
            if ([...value]?.filter(char => char !== ' ').length < 2)
              return 'The task description is too short (min. 2 characters)';

            return null;
          }}
        />
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
                    storeAsCurrentTask={storeAsCurrentTask}
                    sortDashboardTasks={sortDashboardTasks}
                    openDrawer={openDrawer}
                    isTaskDrawerOpen={isTaskDrawerOpen}
                    selectedTaskIdentifier={selectedTaskIdentifier}
                    currentSortMethod={currentSortMethodWithOrder}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    dynamicColumnType={dynamicColumnType}
                    showClearSortFiltersModal={showClearSortFiltersModal}
                    isSortApplied={isSortApplied}
                    areFiltersApplied={areFiltersApplied}
                    isAllTasksTab={selectedTab === 'ALL_TASKS'}
                    updateDueDate={updateDashboardTaskDueDate}
                    currentUser={currentUser}
                    reassignDashboardTask={reassignDashboardTask}
                    updateWorkflowStatus={updateWorkflowStatus}
                    fetchImplicitGroup={fetchImplicitGroup}
                    fetchSearchedTermImplicitGroups={
                      fetchSearchedTermImplicitGroups
                    }
                    isSearching={!!searchValue}
                  />
                ),
            )
          ) : (
            <EmptyStateContainer>{renderEmptyState()}</EmptyStateContainer>
          )}
        </>
      )}

      <NewTaskDrawer
        modalActions={modalActions}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreation={handleTaskUpdate}
        onTaskDelete={fetchDashboardFilters}
        assignToSelf
      />
    </>
  );
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  dashboardStatisticsIsLoading: dashboardStatisticsIsLoadingSelector(state),
  selectedTaskIdentifier: selectedTaskIdentifierSelector(state),
  userPreferColumn: userProfileDashbaordPrefsSelector(state),
  megaFilter: megaFilterSelector(state),
  areFiltersApplied: hasFiltersAppliedSelector(state),
});

const mapDispatchToProps = dispatch => ({
  dashboardActions: bindActionCreators(DashboardActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  storeAsCurrentTask: bindActionCreators(storeAsCurrentTaskAction, dispatch),
  openDrawer: bindActionCreators(openDrawerAction, dispatch),
  closeDrawer: bindActionCreators(closeDrawerAction, dispatch),
  showNavbar: bindActionCreators(showNavbarAction, dispatch),
  updateWorkflowStatus: bindActionCreators(
    updateWorkflowStatusAction,
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(DashboardList));
