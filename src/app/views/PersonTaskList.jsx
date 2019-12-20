import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import GenericHeader from '../components/common/GenericHeader';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';

class TaskListSearch extends PureComponent {
  state = {
    searchTerm: '',
  };

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });

    const {
      taskActions,
      routeParams: { personId },
    } = this.props;

    taskActions.loading();
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      undefined,
      undefined,
      'INCOMPLETE',
    );
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      undefined,
      undefined,
      'COMPLETE',
    );
  }

  handleKeyPress = event => {
    const { taskActions } = this.props;
    const { searchTerm } = this.state;

    if (event.key === 'Enter') {
      taskActions.searchTasks(searchTerm, 'INCOMPLETE');
    }
  };

  handleFilterChange = (filterBy, sortBy) => {
    const {
      taskActions,
      routeParams: { personId },
    } = this.props;

    taskActions.loading();
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      sortBy,
      filterBy,
      'INCOMPLETE',
    );
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      sortBy,
      filterBy,
      'COMPLETE',
    );
  };

  render() {
    const { searchPerformed } = this.state;
    const {
      routeParams: { memberName },
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader isFetching={false}>
          {`Tasks Assigned To ${memberName}`}
        </GenericHeader>
        <div className="wrapper-search">
          <TaskListSearchContainer
            searchPerformed={searchPerformed}
            onFilter={this.handleFilterChange}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.taskState.tasks,
    isFetching: state.taskState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearch);
