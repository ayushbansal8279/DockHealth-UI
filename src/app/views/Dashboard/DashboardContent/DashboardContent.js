import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardTasksSelector,
  dashboardTasksIsLoadingSelector,
} from 'selectors/dashboard-tasks-selectors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DashboardContent = ({ dashboardTasks, dashboardTasksIsLoading }) => {
  return <div>Content</div>;
};

const mapStateToProps = state => ({
  dashboardTasks: dashboardTasksSelector(state),
  dashboardTasksIsLoading: dashboardTasksIsLoadingSelector(state),
});

export default connect(mapStateToProps)(DashboardContent);
