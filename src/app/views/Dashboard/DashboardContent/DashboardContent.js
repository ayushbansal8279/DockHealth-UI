import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';
import { toggleDashboardTaskComplete as toggleDashboardTaskCompleteAction } from 'sagas/dashboard-saga';
import DashboardTasksGroup from './DashboardTasksGroup';
import { DashboardContainer } from './styled';

const DashboardContent = ({ dashboardTasks, toggleDashboardTaskComplete }) => {
  return (
    <DashboardContainer>
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
});

const mapDispatchToProps = {
  toggleDashboardTaskComplete: toggleDashboardTaskCompleteAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
