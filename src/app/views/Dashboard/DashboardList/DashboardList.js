/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { isEmpty } from 'ramda';
import { bindActionCreators } from 'redux';
import EmptyTaskListBird from 'img/animals/bird';
import EmptyTaskListAlpaca from 'img/animals/alpaca';
import { Grid } from '@material-ui/core';
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
import DashboardNewUserInfo from 'views/Dashboard/DashboardNewUserInfo/DashboardNewUserInfo';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import Search from 'components/taskView/Search/Search';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import { storeAsCurrentTask as storeAsCurrentTaskAction } from 'actions/task-actions';
import {
  openDrawer as openDrawerAction,
  closeDrawer as closeDrawerAction,
} from 'actions/task-drawer-actions';
import { showNavbar as showNavbarAction } from 'actions/template-actions';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import MegaFilter from 'components/common/MegaFilter/MegaFilter';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import {
  megaFilterSelector,
  hasFiltersAppliedSelector,
} from 'selectors/mega-filter-selectors';
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
  TipsSwitch,
  TipsSwitchLabel,
} from './styled';

const searchDashboardTasks = (dashboardTasks, searchValue) =>
  dashboardTasks.reduce((accumulator, currentValue) => {
    const filteredTasks = currentValue.tasks?.filter(
      ({ description, patient, assignedTo }) =>
        description.toLowerCase().includes(searchValue.toLowerCase()) ||
        patient?.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        patient?.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        assignedTo?.firstName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        assignedTo?.lastName.toLowerCase().includes(searchValue.toLowerCase()),
    );
    if (filteredTasks?.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

const SORT_CONFIG = {
  default: 'DEFAULT',
  dueDateAsc: 'DUE_DATE_ASC',
  dueDateDsc: 'DUE_DATE_DSC',
  workflowStatusAsc: 'WORKFLOW_STATUS_ASC',
  workflowStatusDsc: 'WORKFLOW_STATUS_DSC',
  patientAsc: 'PATIENT_ASC',
  patientDsc: 'PATIENT_DSC',
  assignedAsc: 'ASSIGNED_ASC',
  assignedDsc: 'ASSIGNED_DSC',
  listNameAsc: 'LIST_NAME_ASC',
  listNameDsc: 'LIST_NAME_DSC',
};

const SORT_METHODS = {
  [SORT_CONFIG.default]: list => list.map(item => item),
  [SORT_CONFIG.dueDateAsc]: list =>
    list
      .map(item => item)
      .sort((a, b) => {
        if (!b?.dueDate) return 1;
        return a?.dueDate > b?.dueDate ? 1 : -1;
      }),
  [SORT_CONFIG.dueDateDsc]: list =>
    list
      .map(item => item)
      .sort((a, b) => {
        if (!a?.dueDate) return 1;
        return b?.dueDate > a?.dueDate ? 1 : -1;
      }),
  [SORT_CONFIG.workflowStatusAsc]: list =>
    list
      .map(item => item)
      .sort((a, b) => {
        const aWorkflowStauts = a?.workflowStatus || '';
        const bWorkflowStauts = b?.workflowStatus || '';

        return aWorkflowStauts.localeCompare(bWorkflowStauts);
      }),
  [SORT_CONFIG.workflowStatusDsc]: list =>
    list
      .map(item => item)
      .sort((a, b) => {
        const aWorkflowStauts = a?.workflowStatus || '';
        const bWorkflowStauts = b?.workflowStatus || '';
        return bWorkflowStauts.localeCompare(aWorkflowStauts);
      }),
  [SORT_CONFIG.patientAsc]: list =>
    list
      .map(item => item)
      .sort((a, b) =>
        a?.patient?.firstName?.localeCompare(b?.patient?.firstName),
      ),
  [SORT_CONFIG.patientDsc]: list =>
    list
      .map(item => item)
      .sort((a, b) =>
        b?.patient?.firstName?.localeCompare(a?.patient?.firstName),
      ),
  [SORT_CONFIG.assignedAsc]: list =>
    list
      .map(item => item)
      .sort((a, b) =>
        a?.assignedTo?.userName?.localeCompare(b?.assignedTo?.userName),
      ),
  [SORT_CONFIG.assignedDsc]: list =>
    list
      .map(item => item)
      .sort((a, b) =>
        b?.assignedTo?.userName?.localeCompare(a?.assignedTo?.userName),
      ),
  [SORT_CONFIG.listNameAsc]: list =>
    list
      .map(item => item)
      .sort((a, b) =>
        a?.taskList?.listName?.localeCompare(b?.taskList?.listName),
      ),
  [SORT_CONFIG.listNameDsc]: list =>
    list
      .map(item => item)
      .sort((a, b) =>
        b?.taskList?.listName?.localeCompare(a?.taskList?.listName),
      ),
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

const DashboardList = ({
  dashboardTasks,
  dashboardTasksIsLoading,
  dashboardStatisticsIsLoading,
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
  },
  megaFilter,
  areFiltersApplied,
  tourModalIsOpen,
  openTourModal,
}) => {
  const { openModal } = modalActions;
  const [selectedTab, setSelectedTab] = useState('MY_TASKS');
  const [highlightPosition, setHighlightPosition] = useState({
    width: 0,
    left: 0,
  });
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortType, setSortType] = useState(SORT_CONFIG.default);
  const [completeTaskCount, setCompleteTaskCount] = useState(undefined);
  const [dynamicColumnType, setDynamicColumnType] = useState(
    userPreferColumn || 'DUE_DATE',
  );

  const filteredDashboardTasks = dashboardTasks.filter(
    ({ tasks }) => tasks && tasks.length !== 0,
  );
  const { userIdentifier, usageState } = currentUser;
  const { filters, selectedFilters } = megaFilter;

  const currentSortMethod = SORT_METHODS[sortType];
  const isSortApplied = sortType !== SORT_CONFIG.default;

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
    setSortType(SORT_CONFIG.default);
  }, [selectedTab]);

  useEffect(() => {
    setSortType(SORT_CONFIG.default);
  }, [dynamicColumnType]);

  const onClickDynamincColumnSort = () => {
    if (dynamicColumnType === 'DUE_DATE') {
      switch (sortType) {
        case SORT_CONFIG.dueDateAsc: {
          setSortType(SORT_CONFIG.dueDateDsc);
          break;
        }
        case SORT_CONFIG.dueDateDsc: {
          setSortType(SORT_CONFIG.dueDateAsc);
          break;
        }
        default: {
          setSortType(SORT_CONFIG.dueDateAsc);
          break;
        }
      }
    } else if (dynamicColumnType === 'STATUS') {
      switch (sortType) {
        case SORT_CONFIG.workflowStatusAsc: {
          setSortType(SORT_CONFIG.workflowStatusDsc);
          break;
        }
        case SORT_CONFIG.workflowStatusDsc: {
          setSortType(SORT_CONFIG.workflowStatusAsc);
          break;
        }
        default: {
          setSortType(SORT_CONFIG.workflowStatusAsc);
          break;
        }
      }
    } else if (dynamicColumnType === 'PATIENT') {
      switch (sortType) {
        case SORT_CONFIG.patientAsc: {
          setSortType(SORT_CONFIG.patientDsc);
          break;
        }
        case SORT_CONFIG.patientDsc: {
          setSortType(SORT_CONFIG.patientAsc);
          break;
        }
        default: {
          setSortType(SORT_CONFIG.patientAsc);
          break;
        }
      }
    }
  };

  const onClickAssignedSort = () => {
    switch (sortType) {
      case SORT_CONFIG.assignedAsc: {
        setSortType(SORT_CONFIG.assignedDsc);
        break;
      }
      case SORT_CONFIG.assignedDsc: {
        setSortType(SORT_CONFIG.assignedAsc);
        break;
      }
      default: {
        setSortType(SORT_CONFIG.assignedAsc);
        break;
      }
    }
  };

  const onClickListNameSort = () => {
    switch (sortType) {
      case SORT_CONFIG.listNameAsc: {
        setSortType(SORT_CONFIG.listNameDsc);
        break;
      }
      case SORT_CONFIG.listNameDsc: {
        setSortType(SORT_CONFIG.listNameAsc);
        break;
      }
      default: {
        setSortType(SORT_CONFIG.listNameAsc);
        break;
      }
    }
  };

  const showClearSortFiltersModal = () => {
    if (sortType !== SORT_CONFIG.default) {
      openModal('ClearSortFilters', {
        confirm: () => setSortType(SORT_CONFIG.default),
        closeOnConfirm: true,
      });
    }
  };

  const handleQuickAddTask = taskName => {
    modalActions.openModal('ListPicker', {
      fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
      listCreationPayload: {
        memberIdentifiers:
          currentUser.userIdentifier !== userIdentifier ? [userIdentifier] : [],
      },
      confirm: taskListIdentifier => {
        quickAddDashboardTask(taskName, taskListIdentifier, userIdentifier);
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
  const searchedDashboardTasks = useMemo(() => {
    return searchValue
      ? searchDashboardTasks(filteredDashboardTasks, searchValue)
      : filteredDashboardTasks;
  }, [searchValue, filteredDashboardTasks]);

  const activeTasksCount = useMemo(
    () =>
      searchedDashboardTasks.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.tasks?.length || 0),
        0,
      ),
    [searchedDashboardTasks],
  );

  return (
    <>
      <StickyHeader>
        <ToolbarContainer container direction="row" justify="space-between">
          <Grid item xs={5}>
            <DasboardTabsContainer>
              <DashboardTab
                label="My Tasks"
                setHighlightPosition={setHighlightPosition}
                onClick={() => {
                  setSelectedTab('MY_TASKS');
                  hashHistory.push('/home/my-tasks');
                }}
                isSelected={selectedTab === 'MY_TASKS'}
              />
              <DashboardTab
                label="All Tasks"
                setHighlightPosition={setHighlightPosition}
                onClick={() => {
                  setSelectedTab('ALL_TASKS');
                  hashHistory.push('/home/all-tasks');
                }}
                isSelected={selectedTab === 'ALL_TASKS'}
              />
              <DashboardTabHighlight {...highlightPosition} />
            </DasboardTabsContainer>
          </Grid>

          <ActionsContainer item xs={7}>
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
              />
            </SearchGrid>
            <Spacing horizontal={4} />
            <div>
              <TipsSwitchLabel>Tips</TipsSwitchLabel>
              <TipsSwitch checked={tourModalIsOpen} onChange={openTourModal} />
            </div>
            <Spacing horizontal={4} />
            <DashboardSettings
              setDynamicColumnType={setDynamicColumnType}
              dynamicColumnType={dynamicColumnType}
            />
          </ActionsContainer>
        </ToolbarContainer>
        <QuickAddTaskInput
          autoComplete="off"
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
      <Spacing vertical={5} />
      <ViewLoader
        isFetchingData={
          dashboardTasksIsLoading ||
          dashboardStatisticsIsLoading ||
          completeTaskCount === undefined
        }
      >
        {!isEmpty(searchedDashboardTasks) ? (
          searchedDashboardTasks?.map(item => (
            <DashboardTasksGroup
              key={item.groupType}
              dashboardTasksGroup={item}
              toggleDashboardTaskComplete={toggleDashboardTaskComplete}
              redirectToParentTask={redirectToParentTask}
              storeAsCurrentTask={storeAsCurrentTask}
              sortDashboardTasks={sortDashboardTasks}
              openDrawer={openDrawer}
              isTaskDrawerOpen={isTaskDrawerOpen}
              selectedTaskIdentifier={selectedTaskIdentifier}
              currentSortMethod={currentSortMethod}
              currentSortType={sortType}
              dynamicColumnType={dynamicColumnType}
              onClickDynamincColumnSort={onClickDynamincColumnSort}
              onClickAssignedSort={onClickAssignedSort}
              onClickListNameSort={onClickListNameSort}
              showClearSortFiltersModal={showClearSortFiltersModal}
              isSortApplied={isSortApplied}
              isAllTasksTab={selectedTab === 'ALL_TASKS'}
              updateDueDate={updateDashboardTaskDueDate}
              currentUser={currentUser}
              reassignDashboardTask={reassignDashboardTask}
            />
          ))
        ) : (
          <EmptyStateContainer>{renderEmptyState()}</EmptyStateContainer>
        )}
      </ViewLoader>
      <NewTaskDrawer
        modalActions={modalActions}
        refreshList={() => {
          reloadDashboardTasks();
          fetchDashboardFilters();
        }}
        assignToSelf={true}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(DashboardList));
