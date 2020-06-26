import React from 'react';
import { connect } from 'react-redux';
import Spacing from 'components/common/Spacing';
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
}) => {
  return (
    <DashboardContainer>
      <DashboardHeader currentUser={currentUser} />
      <Spacing vertical={6} />
      <QuickAddTaskInput
        quickAddTask={out => {
          console.log('output', out);
        }}
      />
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

const mapDispatchToProps = {
  toggleDashboardTaskComplete: toggleDashboardTaskCompleteAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
