import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import * as PatientActions from '../../actions/patient-actions';
import BaseComponent from '../BaseComponent';
import MemberInitials from './MemberInitials';

class HeaderTasks extends BaseComponent {
  state = {
    value: '',
    hideForm: true,
    title: '',
    sortBy: 'CREATED_DT',
    filterBy: '',
  }

  componentDidMount() {
    const {
      patientActions, taskActions, taskListId, taskListActions,
    } = this.props;

    patientActions.getAllPatients();
    taskActions.loading();
    if (taskListId) {
      taskListActions.getTaskListById(taskListId);
      if (taskListId) {
        taskListActions.getMembersByTaskListId(taskListId, 'ALL');
      }
      taskListActions.getActiveMembersByTaskListId(taskListId);
      taskListActions.storeAsCurrentList(taskListId);
    }
  }

  componentWillUpdate(nextProps) {
    const {
      taskLists, taskListId, currentList, taskListActions,
    } = this.props;

    if (taskLists
      && taskLists.length > 0
      && nextProps.taskListId
      && currentList
      && (nextProps.taskListId != currentList.taskListId)) {
      if (taskListId) {
        taskListActions.getActiveMembersByTaskListId(taskListId);
      }
      taskListActions.storeAsCurrentList(nextProps.taskListId);
      this.setState({ title: nextProps.currentList.listName, sortBy: 'CREATED_DT' });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { taskLists, currentList, taskListActions } = this.props;

    if (taskLists && taskLists.length > 0
        && currentList
        && nextProps.taskListId != currentList.taskListId) {
      taskListActions.storeAsCurrentList(nextProps.taskListId);
      this.setState({ title: nextProps.currentList.listName, sortBy: 'CREATED_DT' });
    }
  }

  handleAddTask = () => {
    this.props.taskActions.taskToState(null);
  }

  sortListTasks = (sortBy) => {
    this.setState({ sortBy, filterBy: 'NONE' });
    this.getListTasks(sortBy, this.state.filterBy);
  }

  filterListTasks = (filterBy) => {
    this.setState({ filterBy, sortBy: 'CREATED_DT' });
    this.getListTasks(this.state.sortBy, filterBy);
  }

  getListTasks = (sortBy, filterBy) => {
    const { taskActions, taskListId, title } = this.props;

    taskActions.loading();
    if (taskListId) {
      taskActions.getListTasks(taskListId, sortBy, filterBy, 'INCOMPLETE');
      taskActions.getListTasks(taskListId, sortBy, filterBy, 'COMPLETE');
    } else if (title == 'Inbox') {
      taskActions.getInboxTasks('COMPLETE', sortBy, filterBy);
      taskActions.getInboxTasks('INCOMPLETE', sortBy, filterBy);
    } else if (title == 'Assigned by me') {
      taskActions.getTasksAssignedByMe(undefined, sortBy, filterBy, 'COMPLETE');
      taskActions.getTasksAssignedByMe(undefined, sortBy, filterBy, 'INCOMPLETE');
    } else if (title == 'Assigned to me') {
      taskActions.getTasksAssignedToMe(undefined, sortBy, filterBy, 'COMPLETE');
      taskActions.getTasksAssignedToMe(undefined, sortBy, filterBy, 'INCOMPLETE');
    }
  }

  renderMembers = () => {
    const { taskListId, members } = this.props; // eslint-disable-line react/no-this-in-sfc

    if (!taskListId) { return null; }

    return (
      <ul className="menu member-photo-list">
        <li>
          <span className="add-member circle small">+</span>
        </li>
        {
          members && members.map(member => (
            <li key={`member${member.userId}`}>
              <span data-open={`member-profile-${member.userId}`}>
                <MemberInitials data-open={`member-profile-${member.userId}`} member={member} extraClass="small" />
              </span>
            </li>))
        }
      </ul>
    );
  }

  render() {
    console.log('props', this.props);
    const { title, taskCount } = this.props;

    return (
      <header className="nav-down" id="taskListHeader">
        <div className="top-bar">
          <div className="top-bar-left">
            <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar" />
            <h3>{title}</h3>
            <span>{`${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}`}</span>
          </div>
          <div className="top-bar-right">
            {this.renderMembers()}
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = store => ({
  taskList: store.taskListState.currentList, // tasklistone is set at the reducer
  taskLists: store.taskListState.tasklist,
  patients: store.patientState.allPatients,
  currentList: store.taskListState.currentList,
  currentUser: store.userState.user,
  members: store.taskListState.tasklistmembers,
  activeListMembers: store.taskListState.tasklistactivemembers,
});

const mapDispatchToProps = dispatch => ({
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTasks);
