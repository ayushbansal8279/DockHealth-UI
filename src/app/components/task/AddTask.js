import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  formValueSelector, reset, change, arrayPush,
} from 'redux-form';
import { ReactDOM } from 'react-dom';
import $ from 'jquery';
import AddTaskForm from './AddTaskForm';
import AddSubtaskForm from './AddSubtaskForm';
import * as PeopleActions from '../../actions/people-actions';
import * as TaskActions from '../../actions/task-actions';
import AddPatientModal from '../common/AddPatientModal';
import BooleanModal from '../common/BooleanModal';
import BaseComponent from '../BaseComponent';

class AddTask extends BaseComponent {
  constructor(props, container) {
    super(props);
    this.container = container;
    this.state = {
      value: '',
      assignedToId: '',
      subtasks: [],
      currentSubtaskIndex: '',
      currentSubtask: undefined,
      isSubtask: false,
      form: undefined,
    };
    this.handleTaskDetailsChange = this.handleTaskDetailsChange.bind(this);
    this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this);
    this.handleTaskRefiling = this.handleTaskRefiling.bind(this);
    this.unmount = this.unmount.bind(this);
  }

  componentWillUpdate(nextProps) {
    enableAutoCompleteForPatients(nextProps.patients);
    enableAutoCompleteForSubtaskPatients(nextProps.patients);

    enableAutoCompleteForAssignedTo(nextProps.activeListMembers);
    enableAutoCompleteForSubtaskAssignedTo(nextProps.activeListMembers);
  }

  unmount() {
    const node = this.ReactDOM.getDOMNode();
    ReactDOM.unmountComponentAtNode(node);
    $(node).remove();
  }

  handleTaskDetailsChange(event) {
    this.setState({ value: event.target.value });
  }

  addSubtaskToState = (subtask) => {
    this.setState(state => ({ subtasks: state.subtasks.concat(subtask) }));
  };

  setSubtasks = (subtasks) => {
    this.setState({ subtasks });
  };

  clearSubtasks = () => {
    this.setState({ subtasks: [] });
  };

  isSubtask = (boolean) => {
    this.setState({ isSubtask: boolean });
  };

  handleAddMemberToTask(memberId) {
    this.state.assignedToId = memberId;
  }

  submit = (form) => {
    this.setState({ form: undefined });
    // TODO - manually have to get the values since react-form doesn't pick up hidden values
    this.props.formActions.reset('addTaskForm');

    const payload = { ...form };

    if (form.patient !== '') {
      payload.patientId = $('#add-patient-id').val();
    } else {
      payload.patientId = null;
    }
    if ($('#assign-task-to').val() !== '') {
      payload.assignedToId = $('#assign-task-to-id').val();
    } else {
      payload.assignedToId = '';
    }
    if ($('#due-date').val() !== '') {
      const d = unformatDateAndTime($('#due-date').val());
      payload.dueDate = d;
    } else {
      payload.dueDate = '';
    }

    if ($('#reminder-date').val() !== '') {
      const d = new Date($('#reminder-date').val());
      if (!isNaN(d.getTime())) {
        payload.reminderDt = d;
      } else {
        payload.reminderDt = payload.originalReminderDt;
      }
    } else {
      payload.reminderDt = '';
    }

    if (payload.priority === true) {
      payload.priority = 'HIGH';
    } else {
      payload.priority = 'LOW';
    }
    if ($('#filed-in-taskList').val()) {
      if (
        this.props.title === 'Inbox'
        || (this.props.task
          && this.props.task.taskList
          && $('#filed-in-taskList').val() !== this.props.task.taskList.listName)
      ) {
        this.setState({ form: payload });
        this.openRefileConfirmationModal();
        return;
      }
    }
    this.props.taskActions.saveTask(payload);
    toggleTaskForm();
  };

  openRefileConfirmationModal = () => {
    openPopup('#refile-task');
  };

  handleTaskRefiling() {
    this.state.form.refiled = true;
    this.props.taskActions.saveTask(this.state.form);
    toggleTaskForm();
  }

  addSubtaskValues = (subtaskValues, index) => {
    this.setState({ currentSubtaskIndex: '' });
    if (index !== '') {
      this.props.formActions.change('addTaskForm', `subtasks[${index}]`, {
        ...subtaskValues,
        taskId: this.props.currentSubtasks[index].taskId,
      });
    } else {
      this.props.formActions.arrayPush('addTaskForm', 'subtasks', { ...subtaskValues, taskId: '' });
    }
  };

  currentSubtaskAndIndexToState = (index, task) => {
    this.setState({ currentSubtaskIndex: index });
    this.setState({ currentSubtask: task });
  };

  render() {
    return (
      <div>
        <div className="add-form-wrapper" ref="toggle">
          <div className="task-item add-form row expanded">
            <div className="column top-buffer large-12">
              <AddTaskForm
                sectionTitle="Add a Task"
                onSubmit={this.submit}
                taskLists={this.props.taskLists}
                task={this.props.task}
                title={this.props.title}
                taskListId={this.props.taskListId}
                initialValues={`taskListId:${this.props.taskListId}`}
                subtasks={this.state.subtasks}
                addSubtaskToState={this.addSubtaskToState}
                setSubtasks={this.setSubtasks}
                clearSubtasks={this.clearSubtasks}
                currentSubtaskAndIndexToState={this.currentSubtaskAndIndexToState}
                isEditing={this.props.isEditing}
                isSubtask={this.isSubtask}
              />
              <AddSubtaskForm
                onSubmit={this.submitSubtask}
                addSubtaskValues={this.addSubtaskValues}
                currentSubtasks={this.props.currentSubtasks}
                currentSubtaskIndex={this.state.currentSubtaskIndex}
                title={this.props.title}
                currentTask={this.props.task}
                currentSubtask={this.state.currentSubtask}
                isSubtask={this.isSubtask}
              />
              <AddPatientModal isSubtask={this.state.isSubtask} />
              <BooleanModal
                message="Are you sure you want to move this task to another list?"
                confirmBtnTxt="Move"
                uniqueModalId="refile-task"
                handleConfirmation={this.handleTaskRefiling}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('addTaskForm');

const mapStateToProps = store => ({
  taskLists: store.taskListState.tasklist,
  patients: store.patientState.allPatients,
  peoplelist: store.peopleState.peoplelist,
  members: store.taskListState.tasklistmembers,
  task: store.taskState.task,
  currentSubtasks: selector(store, 'subtasks'),
  activeListMembers: store.taskListState.tasklistactivemembers,
});

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(TaskActions, dispatch),
  peopleActions: bindActionCreators(PeopleActions, dispatch),
  formActions: bindActionCreators({ reset, change, arrayPush }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddTask);
