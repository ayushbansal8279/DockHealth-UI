import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as InvitationActions from '../actions/invitation-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import AddListForm from '../components/LEGACY_list/AddListForm';
import ListsComponent from '../components/LEGACY_list/ListsComponent';
import PendingListsComponent from '../components/LEGACY_list/PendingListsComponent';
import AddTaskListButton from '../components/taskList/AddTaskListButton';

class TaskListView extends PureComponent {
  constructor(props) {
    super(props);
    this.deleteList = this.deleteList.bind(this);
  }

  componentDidMount() {
    this.props.taskListAction.loading();
    this.props.invitationAction.findPendingTaskListsForUser();
    this.props.taskListAction.getGenericListCounts();
    this.props.taskListAction.getTaskListForUser();
    // debugger;
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'Lists',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // enableFoundationComponent(".item-list-wrapper")
    enableFoundationForMultipleComponents('.item-list-wrapper', '.row');
  }

  submit = form => {
    this.props.taskListAction.saveTaskList(form);
    $('.add').click();
  };

  addTaskList = () => {
    this.props.taskListAction.setTaskListAsCurrentList(null);
    openAddForm();
    scrollToTop();
  };

  editTaskList = taskList => {
    this.props.taskListAction.setTaskListAsCurrentList(taskList);
    toggleTaskForm();
    scrollToTop();
  };

  deleteList = taskListId => {
    this.props.taskListAction.deleteTaskListById(taskListId);
  };

  leaveList = taskListId => {
    this.props.taskListAction.leaveList(taskListId);
  };

  acceptInviteToTaskList = taskList => {
    this.props.invitationAction.acceptInviteToTaskList(taskList);
  };

  rejectInviteToTaskList = taskList => {
    this.props.invitationAction.rejectInviteToTaskList(taskList);
  };

  refresh = () => {
    this.props.taskListAction.loading();
    this.props.taskListAction.getTaskListForUser();
  };

  render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <header className="nav-down">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button
                    className="menu-icon hide-for-medium"
                    type="button"
                    data-toggle="sidebar"
                  />
                  <h3>Lists</h3>
                </div>
              </div>

              {/* <div className="wrapper list-filter row collapse align-middle align-right">
                <div className="columns shrink icon-group controls">
                  <span onClick={e => this.refresh()}>
                    <svg className="icon refresh">
                      <use xlinkHref="#icon-activity" />
                    </svg>
                  </span>
                </div>
                <div className="columns shrink">
                  <svg
                    id="icon-lists"
                    className="add add-other icon"
                    onClick={this.addTaskList}
                  >
                    <use xlinkHref="#icon-lists" />
                  </svg>
                </div>
              </div> */}

          <AddTaskListButton
            onClick={this.addTaskList}
          />              
          </header>

          <AddListForm onSubmit={this.submit}/>

            <div className="list-wrapper dashboard-section">
              <div className="row collapse">
                {this.props.genericLists &&
                  this.props.genericLists.map(list => {
                    let iconName = '';
                    let iconColor = '';
                    let panelName = '';
                    if (list.metricName === 'Inbox_Count') {
                      iconName = 'icon-email';
                      panelName = 'Inbox';
                    } else if (list.metricName === 'AssignedToMe_Count') {
                      iconName = 'icon-list';
                      panelName = 'Assigned to me';
                    } else if (list.metricName === 'AssignedByMe_Count') {
                      iconName = 'icon-assign-to';
                      iconColor = 'blue';
                      panelName = 'Assigned by me';
                    } else if (list.metricName === 'HighPriority_Count') {
                      iconName = 'icon-flag';
                      iconColor = 'orange';
                      panelName = 'Flagged';
                    } else if (list.metricName === 'Overdue_Count') {
                      iconName = 'icon-calendar';
                      iconColor = 'red';
                      panelName = 'Overdue';
                    } else if (list.metricName === 'DueToday_Count') {
                      iconName = 'icon-calendar';
                      iconColor = 'blue';
                      panelName = 'Due Today';
                    } else if (list.metricName === 'DueThisWeek_Count') {
                      iconName = 'icon-calendar';
                      iconColor = 'green';
                      panelName = 'Due This Week';
                    } else if (list.metricName === 'CompletedThisWeek_Count') {
                      iconName = 'icon-checkmark';
                      iconColor = 'green';
                      panelName = 'Completed This Week';
                    }
                    return (
                      list.metricName.indexOf("Count")!=-1 && (
                        <div className="large-3 columns" key={list.metricName}>
                          <div
                            className="text-center block-item"
                            data-equalizer-watch=""
                          >
                            <svg
                              className={`icon xlarge icon-header ${iconColor}`}
                            >
                              <use xlinkHref={`#${iconName}`} />
                            </svg>
                            <h6 className="border">{panelName}</h6>
                            <h4>{list.metricValue}</h4>
                          </div>
                        </div>
                      )
                    );
                  })}
              </div>
            </div>
            <div className="list-wrapper list-wrapper-all-lists">
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
                <div className="item-list-wrapper list-wrapper-all-lists">
                  <PendingListsComponent
                    taskLists={this.props.pendingTaskLists}
                    acceptInviteToTaskList={this.acceptInviteToTaskList}
                    rejectInviteToTaskList={this.rejectInviteToTaskList}
                  />
                  <ListsComponent
                    taskLists={this.props.taskLists}
                    editForm={this.editTaskList}
                    deleteList={this.deleteList}
                    leaveList={this.leaveList}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    taskLists: state.taskListState.tasklist,
    pendingTaskLists: state.invitationState.pendingTasklists,
    genericLists: state.taskListState.genericLists,
    isFetching: state.taskListState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskListAction: bindActionCreators(TaskListActions, dispatch),
    invitationAction: bindActionCreators(InvitationActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListView);
