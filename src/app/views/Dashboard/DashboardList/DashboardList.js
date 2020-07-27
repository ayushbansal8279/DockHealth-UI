/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import { bindActionCreators } from 'redux';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import * as ModalActions from 'modal/actions';
import { getSharedTaskListsWithCurrentUser } from 'api/tasklist-api';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';
import { selectedTaskIdentifierSelector } from 'selectors/task-selectors';
import * as DashboardActions from 'sagas/dashboard-saga';
import DashboardNewUserInfo from 'views/Dashboard/DashboardNewUserInfo/DashboardNewUserInfo';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import Search from 'components/taskView/Search/Search';
import { storeAsCurrentTask as storeAsCurrentTaskAction } from 'actions/task-actions';
import {
  openDrawer as openDrawerAction,
  closeDrawer as closeDrawerAction,
} from 'actions/task-drawer-actions';
import { showNavbar as showNavbarAction } from 'actions/template-actions';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { MontserratTypography } from 'styles/theme-montserrat';
import { ContextRefreshTriggers } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Utilities';

import DashboardTasksGroup from './DashboardTasksGroup';
import { SearchGrid, EmptyDashboard, StickyHeader } from './styled';

const searchDashboardTasks = (dashboardTasks, searchValue) =>
  dashboardTasks.reduce((accumulator, currentValue) => {
    const filteredTasks = currentValue.tasks?.filter(({ description }) =>
      description.toLowerCase().includes(searchValue.toLowerCase()),
    );
    if (filteredTasks?.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

const SORT_CONFIG = {
  default: 'DEFAULT',
  dueDateAsc: 'DUE_DATE_ASC',
  dueDateDsc: 'DUE_DATE_DSC',
  listNameAsc: 'LIST_NAME_ASC',
  listNameDsc: 'LIST_NAME_DSC',
};

const SORT_METHODS = {
  [SORT_CONFIG.default]: list => list.map(item => item),
  [SORT_CONFIG.dueDateAsc]: list =>
    list
      .map(item => item)
      .sort((a, b) => {
        return b?.dueDate > a?.dueDate ? 1 : -1;
      }),
  [SORT_CONFIG.dueDateDsc]: list =>
    list
      .map(item => item)
      .sort((a, b) => {
        return a?.dueDate > b?.dueDate ? 1 : -1;
      }),
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
  dashboardActions: {
    redirectToParentTask,
    toggleDashboardTaskComplete,
    quickAddDashboardTask,
    sortDashboardTasks,
    reloadDashboardTasks,
  },
}) => {
  const { openModal } = modalActions;
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortType, setSortType] = useState(SORT_CONFIG.default);
  const filteredDashboardTasks = dashboardTasks.filter(
    ({ tasks }) => tasks && tasks.length !== 0,
  );
  const { userIdentifier, usageState } = currentUser;

  const currentSortMethod = SORT_METHODS[sortType];
  const isSortApplied = sortType !== SORT_CONFIG.default;

  const onClickDueDateSort = () => {
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

  const showResetSortingModal = () => {
    if (sortType !== SORT_CONFIG.default) {
      openModal('ResetSorting', {
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

    // if login count is < 5
    if (usageState?.loginCount < 5) return <DashboardNewUserInfo />;

    return (
      <EmptyDashboard>
        <MontserratTypography>
          Way to go! You have no tasks!
        </MontserratTypography>
      </EmptyDashboard>
    );
  };
  const searchedDashboardTasks = useMemo(() => {
    return searchValue
      ? searchDashboardTasks(filteredDashboardTasks, searchValue)
      : filteredDashboardTasks;
  }, [searchValue, filteredDashboardTasks]);

  return (
    <>
      <StickyHeader>
        <Grid container direction="row" justify="flex-end">
          <SearchGrid isFocused={searchFocused || searchValue} item>
            <Search
              fullWidth
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              value={searchValue}
              onChange={event => setSearchValue(event?.target?.value)}
            />
          </SearchGrid>
        </Grid>
        <Spacing vertical={3} />
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
      <ViewLoader isFetchingData={dashboardTasksIsLoading}>
        {!isEmpty(searchedDashboardTasks)
          ? searchedDashboardTasks?.map(item => (
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
                onClickDueDateSort={onClickDueDateSort}
                onClickListNameSort={onClickListNameSort}
                showResetSortingModal={showResetSortingModal}
                isSortApplied={isSortApplied}
              />
            ))
          : renderEmptyState()}
      </ViewLoader>
      <NewTaskDrawer
        modalActions={modalActions}
        refreshTriggers={[
          ContextRefreshTriggers.DUE_DATE_CHANGE,
          ContextRefreshTriggers.ASSIGNED_TO_CHANGE,
        ]}
        refreshList={reloadDashboardTasks}
      />
    </>
  );
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  selectedTaskIdentifier: selectedTaskIdentifierSelector(state),
});

const mapDispatchToProps = dispatch => ({
  dashboardActions: bindActionCreators(DashboardActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  storeAsCurrentTask: bindActionCreators(storeAsCurrentTaskAction, dispatch),
  openDrawer: bindActionCreators(openDrawerAction, dispatch),
  closeDrawer: bindActionCreators(closeDrawerAction, dispatch),
  showNavbar: bindActionCreators(showNavbarAction, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardList);
