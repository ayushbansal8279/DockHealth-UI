import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskView from '../../views/TaskView';
import MemberInitials from '../members/MemberInitials';

class TaskListSearchContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.closeAuditHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    enableFoundationAccordionComponent('.wrapper');

    resizeEmailBodySection('.task-item-wrapper');
  }

  // componentWillUpdate(nextProps) {
  //   const { taskActions } = this.props;
  //   taskActions.loading();
  //   taskActions.storeAsCurrentTask(null);
  // }

  pullCompletedTasks = () => {
    if (!this.props.showingCompletedTasks) {
      this.props.getCompletedTasks();
    } else {
      this.props.taskActions.hideCompletedTasks();
    }
  };

  handleClick = (e, taskListId) => {
    e.preventDefault();
    // toggleDropDown('activityList' + taskListId)
    // not working
    // $("#activityList").foundation('toggle', $(e.target));
    console.log('The accordion link was clicked.');
  };

  setTaskEditingStatus = isEditing => {
    // alert("working")
    this.setState({ editing: isEditing });
  };

  closeAuditHistory = () => {
    this.props.taskActions.storeAsCurrentTask(null);
    // .then((resp) => {
    this.props.taskActions.clearCurrentTaskHistory();
    // })
  };

  renderAuditHistory() {
    return this.props.currentTaskHistory.map(audit => {
      return (
        <div
          className="task-item row expanded condense align-middle"
          key={`audit${audit.auditId}`}
        >
          <div className="columns shrink">
            {/* <MemberInitials /> */}
            {/* <img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/> */}
            <MemberInitials member={audit.user} />
          </div>
          <div className="columns">
            <span className="task-title">
              {audit.user != null ? audit.user.userName : ''}
            </span>
          </div>
          <div className="columns">
            <span className="task-title">{audit.taskHistoryDetails}</span>
          </div>
          <div className="columns text-right">
            <span className="item-details">
              <Moment format="MM/DD/YYYY">{audit.createdDateTime}</Moment>
            </span>
            <span className="item-details">
              <Moment format="hh:mm a">{audit.createdDateTime}</Moment>
            </span>
          </div>
        </div>
      );
    });
  }

  // Lists Activity for a TaskList
  renderList(taskListId, listName, taskStatus, tasks, members) {
    // return(
    //   <div className="list-wrapper list-wrapper-task-search">
    //     <div className="task-item-wrapper">
    //       <ListOfTasksContainer
    //         taskListId={taskListId} status={taskStatus}
    //         members={members}
    //         filteredTasks={tasks}
    //         setTaskEditingStatus={this.setTaskEditingStatus}
    //         listName=""
    //       />
    //     </div>
    //   </div>
    // );

    const {
      userId,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      taskActions: {
        markComplete,
        storeAsCurrentTask,
        markAsUnread,
        toggleTaskPriority,
        addTaskComment,
      },
      tasklists,
    } = this.props;

    const title = listName;

    const taskViewProps = {
      userId,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userId, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.handleFilterChange,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title,
      showToolbar: false,
    };

    return <TaskView {...taskViewProps} />;
  }

  // Lists TaskLists
  renderTaskListName(taskStatus, searchedTasks) {
    const groupedTasks = this.groupBy(
      searchedTasks,
      task => task.taskList.listName,
    );
    if (!this.props.isFetching && (!groupedTasks || groupedTasks.size == 0)) {
      return (
        <li>
          <p className="light-gray" style={{ fontWeight: 'bold' }}>
            No matching tasks
          </p>
        </li>
      );
    }
    return Array.from(groupedTasks.keys()).map(listName => {
      const tasks = groupedTasks.get(listName);
      let taskListId = 0;
      if (tasks) {
        taskListId = tasks[0].taskList.taskListId;
      }
      return (
        <li className="accordion-item" key={`taskList_${listName}`}>
          {/* <span className={this.props.currentTaskHistory?"accordion-title task-search-list-name":"accordion-title task-search-list-name large-8 large-offset-2"}>
              <b>{listName}</b>
            </span>   */}
          <div>
            {tasks && tasks.length > 0 ? (
              this.renderList(taskListId, listName, taskStatus, tasks, null)
            ) : (
              <p className="light-gray">No matching tasks</p>
            )}
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="tasks-container-new">
        {/* <div className="large-12 columns left-column"> */}
        <div className="row expanded collapse">
          <ul
            className="columns large-12 accordion task-search-results-container"
            data-accordion
            data-allow-all-closed="true"
          >
            {this.props.searchPerformed &&
              this.props.tasks &&
              this.renderTaskListName('INCOMPLETE', this.props.tasks)}
          </ul>
          {/* <div className="columns large-12">
              {this.props.searchPerformed && 
                <div className="show-completed text-center">
                  <a className="toggle-completed button primary small" onClick={(e) => this.pullCompletedTasks()}>Show completed tasks</a>
                </div>
              }
            </div> */}
          {this.props.showingCompletedTasks &&
            this.props.completedTasks &&
            this.props.completedTasks.length > 0 && (
              <ul
                className="columns large-12 accordion task-search-results-container"
                data-accordion
                data-allow-all-closed="true"
              >
                {this.props.searchPerformed &&
                  this.props.completedTasks &&
                  this.renderTaskListName(
                    'COMPLETE',
                    this.props.completedTasks,
                  )}
              </ul>
            )}
          {this.props.showingCompletedTasks &&
            this.props.completedTasks &&
            this.props.completedTasks.length == 0 && (
              <span>No completed tasks</span>
            )}
        </div>
        {/* </div> */}
      </div>
    );
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    // taskSearchResults: state.taskState.taskSearchResults
    tasklists: state.taskListState.tasklist,
    tasks: state.taskState.tasks,
    completedTasks: state.taskState.completedTasks,
    isFetching: state.taskState.isFetching,
    isCompletedTasksFetching: state.taskState.isCompletedTasksFetching,
    showingCompletedTasks: state.taskState.showingCompletedTasks,
    user: state.userState.user,
    userId: state.userState.userProfile.userId,
    selectedTaskId: state.taskState.selectedTaskId,
    selectedTask: state.taskState.selectedTask,
    currentTaskHistory: state.taskState.currentTaskHistory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearchContainer);
