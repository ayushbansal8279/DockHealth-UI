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
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import Search from 'components/taskView/Search/Search';
import { storeAsCurrentTask as storeAsCurrentTaskAction } from 'actions/task-actions';
import DashboardTasksGroup from './DashboardTasksGroup';
import { DashboardContainer, SearchGrid } from './styled';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const searchDashboardTasks = (dashboardTasks, searchValue) =>
  dashboardTasks.reduce((accumulator, currentValue) => {
    const filteredTasks = currentValue.tasks.filter(({ description }) =>
      description.toLowerCase().includes(searchValue.toLowerCase()),
    );
    if (filteredTasks.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

const DashboardContent = ({
  dashboardTasks,
  dashboardTasksIsLoading,
  currentUser,
  modalActions,
  storeAsCurrentTask,
  dashboardActions: {
    redirectToParentTask,
    toggleDashboardTaskComplete,
    quickAddDashboardTask,
  },
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

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

    return <EmptyListView />;
  };
  const searchedDashboardTasks = useMemo(() => {
    return searchValue
      ? searchDashboardTasks(dashboardTasks, searchValue)
      : dashboardTasks;
  }, [searchValue, dashboardTasks]);

  return (
    <DashboardContainer>
      <DashboardHeader currentUser={currentUser} />
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
      <QuickAddTaskInput quickAddTask={handleQuickAddTask} />
      <ViewLoader isFetchingData={dashboardTasksIsLoading}>
        {!isEmpty(searchedDashboardTasks)
          ? searchedDashboardTasks?.map(item => (
              <DashboardTasksGroup
                dashboardTasksGroup={item}
                toggleDashboardTaskComplete={toggleDashboardTaskComplete}
                redirectToParentTask={redirectToParentTask}
                storeAsCurrentTask={storeAsCurrentTask}
              />
            ))
          : renderEmptyState()}
      </ViewLoader>
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
  storeAsCurrentTask: storeAsCurrentTaskAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
