import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import CubesLoader from '../components/common/CubesLoader';
import GenericHeader from '../components/common/GenericHeader';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

class TaskListSearch extends PureComponent {
  state = {
    searchTerm: ''
  };

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });
    var personId = this.props.routeParams.personId;
    this.props.taskActions.loading()
    this.props.taskActions.getTasksAssignedToSpecificUser(personId, undefined, undefined, undefined, "INCOMPLETE")
    this.props.taskActions.getTasksAssignedToSpecificUser(personId, undefined, undefined, undefined, "COMPLETE")
  }

  getListTasks = (sortBy, filterBy) => {
    this.props.taskActions.loading()
    this.props.taskActions.getTasksAssignedToSpecificUser(this.props.routeParams.personId, undefined, sortBy, filterBy, "INCOMPLETE")
    this.props.taskActions.getTasksAssignedToSpecificUser(this.props.routeParams.personId, undefined, sortBy, filterBy, "COMPLETE")
  }

  // getCompletedTasks = () => {
  //   this.props.taskActions.getTasksAssignedToSpecificUser(this.props.routeParams.personId, undefined, undefined, undefined, "COMPLETE")
  // }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      this.props.taskActions.searchTasks(this.state.searchTerm, "INCOMPLETE");
    }
  }

  handleFilterChange = (filterBy, sortBy) => {
    const {
      taskActions,
      routeParams: { taskListId },
    } = this.props;

    taskActions.loading();
    taskActions.getTasksAssignedToSpecificUser(this.props.routeParams.personId, undefined, sortBy, filterBy, "INCOMPLETE")
    taskActions.getTasksAssignedToSpecificUser(this.props.routeParams.personId, undefined, sortBy, filterBy, "COMPLETE")
    
  };

  render() {
    const { isFetching } = this.props;
    const { searchPerformed, searchTerm } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader isFetching={false} title={"Tasks Assigned To "+this.props.routeParams.memberName} />
        <div className="wrapper-search">
          <TaskListSearchContainer
            searchPerformed={searchPerformed}
            // getCompletedTasks={this.getCompletedTasks}
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
