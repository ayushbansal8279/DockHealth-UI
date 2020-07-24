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
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedTaskIdentifierSelector } from 'selectors/task-selectors';
import * as DashboardActions from 'sagas/dashboard-saga';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import Search from 'components/taskView/Search/Search';
import { storeAsCurrentTask as storeAsCurrentTaskAction } from 'actions/task-actions';
import {
  openDrawer as openDrawerAction,
  closeDrawer as closeDrawerAction,
} from 'actions/task-drawer-actions';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { MontserratTypography } from 'styles/theme-montserrat';
import { ContextRefreshTriggers } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Utilities';

import DashboardTasksGroup from './DashboardTasksGroup';
import {
  DashboardContainer,
  SearchGrid,
  DashboardHeaderContainer,
  EmptyDashboard,
  StickyHeader,
} from './styled';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

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
  [SORT_CONFIG.default]: list => list,
  [SORT_CONFIG.dueDateAsc]: list =>
    list.sort((a, b) => new Date(b?.dueDate) - new Date(a?.dueDate)),
  [SORT_CONFIG.dueDateDsc]: list =>
    list.sort((a, b) => new Date(a?.dueDate) - new Date(b?.dueDate)),
  [SORT_CONFIG.listNameAsc]: list =>
    list.sort((a, b) =>
      a?.taskList?.listName?.localeCompare(b?.taskList?.listName),
    ),
  [SORT_CONFIG.listNameDsc]: list =>
    list.sort((a, b) =>
      b?.taskList?.listName?.localeCompare(a?.taskList?.listName),
    ),
};

const DashboardContent = ({
  dashboardTasks,
  dashboardTasksIsLoading,
  currentUser,
  modalActions,
  storeAsCurrentTask,
  openDrawer,
  isTaskDrawerOpen,
  selectedTaskIdentifier,
  closeDrawer,
  openModal,
  dashboardActions: {
    redirectToParentTask,
    toggleDashboardTaskComplete,
    quickAddDashboardTask,
    sortDashboardTasks,
    reloadDashboardTasks,
  },
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortType, setSortType] = useState(SORT_CONFIG.default);
  const filteredDashboardTasks = dashboardTasks.filter(
    ({ tasks }) => tasks && tasks.length !== 0,
  );

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
    const { userIdentifier } = currentUser;

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
    <DashboardContainer>
      <DashboardHeaderContainer>
        <DashboardHeader currentUser={currentUser} />
      </DashboardHeaderContainer>
      <Spacing vertical={3} />
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
    </DashboardContainer>
  );
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
  selectedTaskIdentifier: selectedTaskIdentifierSelector(state),
});

const mapDispatchToProps = dispatch => ({
  dashboardActions: bindActionCreators(DashboardActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  storeAsCurrentTask: bindActionCreators(storeAsCurrentTaskAction, dispatch),
  openDrawer: bindActionCreators(openDrawerAction, dispatch),
  closeDrawer: bindActionCreators(closeDrawerAction, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
