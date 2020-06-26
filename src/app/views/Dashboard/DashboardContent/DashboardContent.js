import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { toggleDashboardTaskComplete as toggleDashboardTaskCompleteAction } from 'sagas/dashboard-saga';
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
