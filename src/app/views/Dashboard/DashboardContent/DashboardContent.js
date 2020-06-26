import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spacing from 'components/common/Spacing';
import * as ModalActions from 'modal/actions';
import { getSharedTaskListsWithCurrentUser } from 'api/tasklist-api';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { toggleDashboardTaskComplete as toggleDashboardTaskCompleteAction } from 'sagas/dashboard-saga';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import DashboardTasksGroup from './DashboardTasksGroup';
import { DashboardContainer } from './styled';
import DashboardHeader from '../DashboardHeader/DashboardHeader';

const DashboardContent = ({
  dashboardTasks,
  toggleDashboardTaskComplete,
  currentUser,
  modalActions,
}) => {
  const handleQuickAddTask = taskName => {
    const { userIdentifier } = currentUser;

    modalActions.openModal('ListPicker', {
      fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
      listCreationPayload: {
        memberIdentifiers:
          currentUser.userIdentifier !== userIdentifier ? [userIdentifier] : [],
      },
      confirm: taskListIdentifier => {
        console.log(taskListIdentifier, taskName);
      },
    });
  };

  return (
    <DashboardContainer>
      <DashboardHeader currentUser={currentUser} />
      <Spacing vertical={6} />
      <QuickAddTaskInput quickAddTask={handleQuickAddTask} />
      {dashboardTasks?.map(item => (
        <DashboardTasksGroup
          dashboardTasksGroup={item}
          toggleDashboardTaskComplete={toggleDashboardTaskComplete}
        />
      ))}
    </DashboardContainer>
  );
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
});

const mapDispatchToProps = dispatch => ({
  toggleDashboardTaskComplete: toggleDashboardTaskCompleteAction,
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
