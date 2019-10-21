import $ from 'jquery';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import SortFilterTasks from '../components/LEGACY_common/SortFilterTasks';
import PersonTaskListContainer from '../components/LEGACY_list/PersonTaskListContainer';
import AddTask from '../components/LEGACY_task/AddTask';

class PersonTaskList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  componentDidMount() {
    const { personId } = this.props.routeParams;

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });
    this.props.taskActions.loading();

    this.props.taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      undefined,
      undefined,
      'INCOMPLETE',
    );
  }

  getListTasks = (sortBy, filterBy) => {
    this.props.taskActions.loading();
    this.props.taskActions.getTasksAssignedToSpecificUser(
      this.props.routeParams.personId,
      undefined,
      sortBy,
      filterBy,
      'INCOMPLETE',
    );
  };

  getCompletedTasks = () => {
    this.props.taskActions.getTasksAssignedToSpecificUser(
      this.props.routeParams.personId,
      undefined,
      undefined,
      undefined,
      'COMPLETE',
    );
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.taskActions.searchTasks(this.state.searchTerm, 'INCOMPLETE');
    }
  };

  handleAddTask = () => {
    this.props.taskActions.taskToState(null);
    openAddForm();
  };

  toggleSlimView = () => {
    $(this).toggleClass('active');
    $('.task-item-wrapper').toggleClass('slim');
    $('.task-item .row, .task-item, .main-task-item').toggleClass(
      'align-middle',
    );
  };

  render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <div className="top-bar">
              <div className="top-bar-left">
                <button
                  className="menu-icon hide-for-medium"
                  type="button"
                  data-toggle="sidebar"
                />
                <h3>
                  Tasks Assigned To
                  {this.props.routeParams.memberName}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <div className="wrapper list-filter row collapse align-middle align-right " />
          </div>
        </div>

        <AddTask
          taskListId={this.props.taskListId}
          addTask={this.props.taskActions.addTask}
          taskLists={this.props.taskList}
          patients={this.props.patients}
          title={this.props.title}
          members={this.props.members}
          activeListMembers={this.props.activeListMembers}
        />

        <div className="wrapper-search">
          <SortFilterTasks
            title="Person Tasks"
            getListTasks={this.getListTasks}
          />

          {this.props.isFetching ? (
            <div className="sk-circle">
              <div className="sk-circle1 sk-child" />
              <div className="sk-circle2 sk-child" />
              <div className="sk-circle3 sk-child" />
              <div className="sk-circle4 sk-child" />
              <div className="sk-circle5 sk-child" />
              <div className="sk-circle6 sk-child" />
              <div className="sk-circle7 sk-child" />
              <div className="sk-circle8 sk-child" />
              <div className="sk-circle9 sk-child" />
              <div className="sk-circle10 sk-child" />
              <div className="sk-circle11 sk-child" />
              <div className="sk-circle12 sk-child" />
            </div>
          ) : (
            <PersonTaskListContainer
              getCompletedTasks={this.getCompletedTasks}
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
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
)(PersonTaskList);
