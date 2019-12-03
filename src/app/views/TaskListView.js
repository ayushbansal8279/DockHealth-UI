import Grid from '@material-ui/core/Grid';
import $ from 'jquery';
import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as InvitationActions from '../actions/invitation-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import CubesLoader from '../components/common/CubesLoader';
import GenericHeader from '../components/common/GenericHeader';
import AddListForm from '../components/LEGACY_list/AddListForm';
import ListsComponent from '../components/LEGACY_list/ListsComponent';
import PendingListsComponent from '../components/LEGACY_list/PendingListsComponent';
import AddTaskListButton from '../components/taskList/AddTaskListButton';

const CubesLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

class TaskListView extends PureComponent {
  constructor(props) {
    super(props);
    this.deleteList = this.deleteList.bind(this);
  }

  componentDidMount() {
    const { taskListAction, invitationAction } = this.props;
    taskListAction.loading();
    invitationAction.findPendingTaskListsForUser();
    taskListAction.getGenericListCounts();
    taskListAction.getTaskListForUser();

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'Lists',
    });
  }

  componentDidUpdate() {
    enableFoundationForMultipleComponents('.item-list-wrapper', '.row');
  }

  submit = form => {
    const { taskListAction } = this.props;
    taskListAction.saveTaskList(form);
    $('.add').click();
  };

  addTaskList = () => {
    const { taskListAction } = this.props;
    taskListAction.setTaskListAsCurrentList(null);
    openAddForm();
    scrollToTop();
  };

  editTaskList = taskList => {
    const { taskListAction } = this.props;
    taskListAction.setTaskListAsCurrentList(taskList);
    toggleTaskForm();
    scrollToTop();
  };

  deleteList = taskListId => {
    const { taskListAction } = this.props;
    taskListAction.deleteTaskListById(taskListId);
  };

  leaveList = taskListId => {
    const { taskListAction } = this.props;
    taskListAction.leaveList(taskListId);
  };

  acceptInviteToTaskList = taskList => {
    const { invitationAction } = this.props;
    invitationAction.acceptInviteToTaskList(taskList);
  };

  rejectInviteToTaskList = taskList => {
    const { invitationAction } = this.props;
    invitationAction.rejectInviteToTaskList(taskList);
  };

  refresh = () => {
    const { taskListAction } = this.props;
    taskListAction.loading();
    taskListAction.getTaskListForUser();
  };

  onSelectHUD = link => {
    hashHistory.push(link);
  };

  getGenericProxyListMetricTarget = metricName => {
    switch (metricName) {
      case 'Inbox_Count': {
        return {
          iconName: 'icon-email',
          panelName: 'Inbox',
          listName: 'Inbox',
          filterBy: 'NONE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'AssignedToMe_Count': {
        return {
          iconName: 'icon-list',
          panelName: 'Assigned to me',
          listName: 'assigned_to_me',
          filterBy: 'NONE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'AssignedByMe_Count': {
        return {
          iconName: 'icon-assign-to',
          iconColor: 'blue',
          panelName: 'Assigned by me',
          listName: 'assigned_by_me',
          filterBy: 'NONE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'HighPriority_Count': {
        return {
          iconName: 'icon-flag',
          iconColor: 'orange',
          panelName: 'Flagged',
          listName: 'assigned_to_me',
          filterBy: 'FLAGGED',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'Overdue_Count': {
        return {
          iconName: 'icon-calendar',
          iconColor: 'red',
          panelName: 'Overdue',
          listName: 'assigned_to_me',
          filterBy: 'OVERDUE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'DueToday_Count': {
        return {
          iconName: 'icon-calendar',
          iconColor: 'blue',
          panelName: 'Due Today',
          listName: 'assigned_to_me',
          filterBy: 'DUE_TODAY',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'DueThisWeek_Count': {
        return {
          iconName: 'icon-calendar',
          iconColor: 'green',
          panelName: 'Due This Week',
          listName: 'assigned_to_me',
          filterBy: 'DUE_THIS_WEEK',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'CompletedThisWeek_Count': {
        return {
          iconName: 'icon-checkmark',
          iconColor: 'green',
          panelName: 'Completed This Week',
          listName: 'assigned_to_me',
          filterBy: 'COMPLETED_THIS_WEEK',
          taskStatus: 'COMPLETE',
        };
      }
      default: {
        return {};
      }
    }
  };

  getGenericListMetricData = metricName => {
    const metricProxyTarget = this.getGenericProxyListMetricTarget(metricName);

    return new Proxy(metricProxyTarget, {
      get: (target, name) => target[name] ?? '',
    });
  };

  onGenericListTileClick = ({ listName, taskStatus, filterBy }) => () => {
    this.onSelectHUD(
      listName === 'Inbox'
        ? 'tasks/Inbox'
        : `tasks/filtered/${listName}/${taskStatus}/${filterBy}`,
    );
  };

  renderGenericList = list => {
    const {
      iconName,
      iconColor,
      panelName,
      listName,
      filterBy,
      taskStatus,
    } = this.getGenericListMetricData(list.metricName);

    return (
      list.metricName.includes('Count') && (
        <div
          className="large-3 columns"
          key={list.metricName}
          onClick={this.onGenericListTileClick({
            listName,
            taskStatus,
            filterBy,
          })}
          style={{ cursor: 'pointer' }}
        >
          <div className="text-center block-item" data-equalizer-watch="">
            <svg className={`icon xlarge icon-header ${iconColor}`}>
              <use xlinkHref={`#${iconName}`} />
            </svg>
            <h6 className="border">{panelName}</h6>
            <h4>{list.metricValue}</h4>
          </div>
        </div>
      )
    );
  };

  render() {
    const {
      isFetching,
      pendingTaskLists,
      taskLists,
      genericLists,
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader isFetching={false} title="Lists" />
        <Grid
          container
          alignItems="center"
          justify="flex-end"
          direction="row"
          style={{ height: '88px' }}
        >
          <AddTaskListButton onClick={this.addTaskList} />
        </Grid>
        <AddListForm onSubmit={this.submit} />
        <Grid container direction="row" justify="center">
          <div className="row collapse">
            {genericLists?.map(this.renderGenericList)}
          </div>
          <Grid item md={10} sm={12}>
            <div
              className="list-wrapper list-wrapper-all-lists"
              style={{ width: '100%' }}
            >
              {isFetching ? (
                <CubesLoaderContainer>
                  <CubesLoader size={40} />
                </CubesLoaderContainer>
              ) : (
                <div className="item-list-wrapper list-wrapper-all-lists">
                  <PendingListsComponent
                    taskLists={pendingTaskLists}
                    acceptInviteToTaskList={this.acceptInviteToTaskList}
                    rejectInviteToTaskList={this.rejectInviteToTaskList}
                  />
                  <ListsComponent
                    taskLists={taskLists}
                    editForm={this.editTaskList}
                    deleteList={this.deleteList}
                    leaveList={this.leaveList}
                  />
                </div>
              )}
            </div>
          </Grid>
          {/* </div>
        </div> */}
        </Grid>
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
