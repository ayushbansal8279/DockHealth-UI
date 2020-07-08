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
import * as DashboardActions from 'sagas/dashboard-saga';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import Search from 'components/taskView/Search/Search';
import { storeAsCurrentTask as storeAsCurrentTaskAction } from 'actions/task-actions';
import { openDrawer as openDrawerAction } from 'actions/task-drawer-actions';
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
    const filteredTasks = currentValue.tasks.filter(({ description }) =>
      description.toLowerCase().includes(searchValue.toLowerCase()),
    );
    if (filteredTasks?.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

const DashboardContent = ({
  dashboardTasks,
  dashboardTasksIsLoading,
  currentUser,
  modalActions,
  storeAsCurrentTask,
  openDrawer,
  isTaskDrawerOpen,
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
  const filteredDashboardTasks = dashboardTasks.filter(
    ({ tasks }) => tasks && tasks.length !== 0,
  );

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
          quickAddTask={handleQuickAddTask}
          validator={value => {
            if (value?.length < 2)
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
              />
            ))
          : renderEmptyState()}
      </ViewLoader>
      <NewTaskDrawer
        modalActions={modalActions}
        refreshTriggers={[ContextRefreshTriggers.DUE_DATE_CHANGE]}
        refreshList={reloadDashboardTasks}
      />
    </DashboardContainer>
  );
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
});

const mapDispatchToProps = dispatch => ({
  dashboardActions: bindActionCreators(DashboardActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  storeAsCurrentTask: bindActionCreators(storeAsCurrentTaskAction, dispatch),
  openDrawer: bindActionCreators(openDrawerAction, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
