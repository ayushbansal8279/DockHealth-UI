import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';
import DashboardTasksGroup from './DashboardTasksGroup';
import { DashboardContainer } from './styled';

const DashboardContent = ({ dashboardTasks }) => {
  return (
    <DashboardContainer>
      {dashboardTasks?.map(item => (
        <DashboardTasksGroup dashboardTasksGroup={item} />
      ))}
    </DashboardContainer>
  );
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
});

export default connect(mapStateToProps)(DashboardContent);
