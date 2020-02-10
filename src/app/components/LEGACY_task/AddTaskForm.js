import $ from 'jquery';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  change,
  destroy,
  Field,
  FieldArray,
  formValueSelector,
  initialize,
  reduxForm,
  reset,
  touch,
} from 'redux-form';

import * as TaskListActions from '../../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import BasicField from '../common/BasicField';
import BasicFieldTaskDescription from '../common/BasicFieldTaskDescription';
import DatePickerInput from '../common/DatePickerInput';
import SelectInput from '../common/SelectInput';

class AddTaskForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      priorityFlag: undefined,
      listName: '',
    };
    this.handleTaskListSelection = this.handleTaskListSelection.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      priorityFlag: nextProps.task.priority === 'HIGH',
    };
  }

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'AddTask',
    });
  }

  componentDidUpdate() {
    renderFoundationComponentsJquery();

    if (
      this.props.currentTask &&
      this.props.currentTask.taskList &&
      this.props.currentTask.taskList.listName !== ''
    ) {
      $('#filed-in-taskList')
        .parent()
        .addClass('has-value');
    }
  }

  initializeSubtaskForm = index => {
    const task = this.props.currentSubtasks[index];
    this.props.currentSubtaskAndIndexToState(index, task);

    // Checks if task came from an object (task.patient.firstName)
    // or has been edited (task.patient = full name)
    if (task.patient && task.patient.firstName) {
      task.patient = `${task.patient.firstName} ${task.patient.lastName}`;
    }
    if (task.priority === 'HIGH') {
      task.priorityFlag = true;
    } else {
      task.priorityFlag = false;
    }
    if (task.dueDate) {
      task.dueDate = formatDateAndTime(task.dueDate);
      task.originalDueDate = task.dueDate;
    }
    if (task.reminderDt) {
      task.reminderDt = formatDateAndTime(task.reminderDt);
      task.originalReminderDt = task.reminderDt;
    }
    this.props.formActions.initialize('addSubtaskForm', task, true);
  };

  changeTaskPriority = () => {
    this.setState(
      state => ({ priorityFlag: !state.priorityFlag }),
      () => {
        this.props.formActions.change(
          'addTaskForm',
          'priorityFlag',
          this.state.priorityFlag,
        );
      },
    );
  };

  resetSubtaskForm = currTask => {
    if (currTask && currTask.patient) {
      const patientName = `${currTask.patient.firstName} ${currTask.patient.lastName}`;
      this.props.formActions.change('addSubtaskForm', 'patient', patientName);
      this.props.formActions.change(
        'addSubtaskForm',
        'patientIdentifier',
        currTask.patient.patientIdentifier,
      );
    }
  };

  handleTaskListSelection(event, taskList) {
    this.props.taskListActions.getMembersByTaskListId(
      event.target.value,
      'ALL',
    );
    this.setState({ listName: taskList.listName });
    $('#filed-in-taskList').val(taskList.listName);
    $('#filed-in-taskList')
      .parent()
      .addClass('has-value');
    $('#add-task-file-in-options').removeClass('is-open');
  }

  cancelEditTask = event => {
    toggleTaskForm();
    event.preventDefault();
  };

  renderSubtask = (subtask, index) => (
    <div
      key={`${subtask.id}_${index}`}
      // eslint-disable-next-line react/no-this-in-sfc
      onClick={() => this.initializeSubtaskForm(index)}
      className="column large-12 input-group toggle-add-subtask has-value"
    >
      <span className="input-group-label">
        <svg className="icon">
          <use xlinkHref="#icon-subtask" />
        </svg>
      </span>
      <div className="input-wrapper form-floating-label">
        <Field
          className="input-group-field"
          type="text"
          name={`${subtask}.description`}
          component="input"
        />
        <label>{`Subtask # ${index + 1}`}</label>
      </div>
    </div>
  );

  render() {
    const renderSubtaskField = ({ fields }) => (
      // eslint-disable-next-line react/no-this-in-sfc
      <div>{(fields || []).map(this.renderSubtask)}</div>
    );

    return (
      <form
        className="inline-label"
        onSubmit={this.props.handleSubmit}
        autoComplete="off"
      >
        <div className="main-task-wrapper">
          <div className="column large-12 text-center">
            <h5 className="section-title">
              {this.props.task &&
              this.props.task.description &&
              this.props.task.description !== ''
                ? 'Edit a Task'
                : 'Add a Task'}
            </h5>
          </div>

          {/* Description */}
          <Field
            name="description"
            type="text"
            label="Description"
            component={BasicFieldTaskDescription}
            callback={this.changeTaskPriority}
            priority={this.state.priorityFlag}
            autoComplete="off"
          />
          <Field
            id="taskIdentifier"
            name="taskIdentifier"
            className="input-group-field"
            component="input"
            type="hidden"
          />

          {/* Comment */}
          {this.props.task &&
          this.props.task.description &&
          this.props.task.description !== '' ? (
            ''
          ) : (
            <Field
              name="comment"
              type="text"
              component={BasicField}
              label="Comment"
              xlinkHref="#icon-pencil"
              isTaskDescription="true"
            />
          )}

          {/* ADD PATIENT */}
          {(!this.props.currentTask ||
            !this.props.currentTask.parentTaskIdentifier) && (
            <Field
              onChange={() => this.props.isSubtask(false)}
              id="add-patient"
              name="patient"
              type="text"
              component={BasicField}
              label="Add Patient"
              xlinkHref="#icon-patient"
              extraClassName="add-patient"
            />
          )}
          {(!this.props.currentTask ||
            !this.props.currentTask.parentTaskIdentifier) && (
            <Field
              id="add-patient-id"
              name="patientIdentifier"
              className="input-group-field"
              component="input"
              type="hidden"
            />
          )}

          {/* FILE IN */}
          {/* Show only from inbox. Tasks can only be assigned to list from 'inbox' */}
          <div className="column large-12 input-group input-dropdown">
            <span className="input-group-label">
              <svg className="icon">
                <use xlinkHref="#icon-list" />
              </svg>
            </span>
            <div
              className={
                this.props.title !== 'Inbox'
                  ? 'input-wrapper form-floating-label has-value'
                  : 'input-wrapper form-floating-label'
              }
            >
              <Field
                className="input-group-field"
                id="filed-in-taskList"
                name="taskList"
                component="input"
                type="text"
                data-toggle="add-task-file-in-options"
                autoComplete="off"
              />
              <label>File in</label>
            </div>
            <div
              className="dropdown-pane"
              id="add-task-file-in-options"
              data-dropdown="true"
              data-close-on-click="true"
            >
              {this.props.title !== 'Inbox' &&
                this.props.currentTask &&
                this.props.currentTask.taskList &&
                this.props.currentTask.taskList.listName !== '' && (
                  <span className="margin-bottom warning-label">
                    Please note, by moving a task to a new list some details of
                    the task may be lost. Task assignments and comments will
                    transfer only if users are members of both lists.
                  </span>
                )}
              <fieldset className="large-12 columns">
                {this.props.taskLists &&
                  this.props.taskLists.length > 0 &&
                  this.props.taskLists.map(taskList => (
                    <div key={taskList.taskListIdentifier}>
                      <Field
                        id={`radio${taskList.taskListIdentifier}`}
                        className="input-group-field"
                        name="taskListIdentifier"
                        value={taskList.taskListIdentifier.toString()}
                        title={taskList.listName}
                        component="input"
                        type="radio"
                        onClick={e => this.handleTaskListSelection(e, taskList)}
                      />
                      <label htmlFor={`radio${taskList.taskListIdentifier}`}>
                        {taskList.listName}
                      </label>
                      <br />
                    </div>
                  ))}
              </fieldset>
            </div>
          </div>

          {/* ASSIGNED TO */}
          {/* Hide 'assignedTo' if user is adding a task to the 'inbox'. Tasks can only be assigned from lists */}
          {this.props.title !== 'Inbox' || this.props.taskListSelection ? (
            <span>
              <Field
                id="assign-task-to"
                name="assignedTo"
                type="text"
                component={BasicField}
                label="Assigned to"
                xlinkHref="#icon-assign-to"
                extraClassName="assign-to"
              />
              <Field
                id="assign-task-to-id"
                name="assignedToIdentifier"
                className="input-group-field"
                component="input"
                type="hidden"
              />
            </span>
          ) : (
            <span />
          )}
          <Field
            // Is this old workflowStatus stuff
            id="task-status"
            name="taskStatus"
            component={SelectInput}
            options={[
              // { value: 'INCOMPLETE', label: 'INCOMPLETE' },
              // { value: 'COMPLETE', label: 'COMPLETE' },
              // Inserted No Status Status
              { value: 'NO_STATUS', label: 'No Status' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'PAUSED', label: 'Paused' },
              { value: 'WAITING', label: 'Waiting' },
            ]}
            label="Status"
            xlinkHref="#icon-assign-to"
          />

          <Field
            id="due-date"
            name="dueDate"
            type="text"
            component={DatePickerInput}
            label="Due date"
            xlinkHref="#icon-calendar"
            dateFormat="iii MMM do YYYY @ H:mm a"
          />

          <Field
            id="reminder-date"
            name="reminderDate"
            type="text"
            component={DatePickerInput}
            label="Reminder"
            xlinkHref="#icon-calendar"
            dateFormat="iii MMM do YYYY @ H:mm a"
          />

          <FieldArray name="subtasks" component={renderSubtaskField} />

          <div className="row expanded">
            {!this.props.currentTask || !this.props.currentTask.parentTaskIdentifier ? (
              <div
                onClick={() => this.resetSubtaskForm(this.props.currentTask)}
                className="columns highlight center-content-vertical toggle-add-subtask link"
              >
                <svg className="icon hide">
                  <use xlinkHref="#icon-subtask" />
                </svg>
                + Add a subtask
              </div>
            ) : (
              <div className="columns center-content-vertical" />
            )}

            {/* SAVE */}
            <div className="columns shrink align-right">
              <input
                id="addTaskButton"
                type="submit"
                className="button secondary medium"
                value="Save"
              />
            </div>
            <div className="columns shrink align-right">
              <button
                id="cancelTaskButton"
                type="button"
                className="button medium"
                onClick={e => this.cancelEditTask(e)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.description) {
    errors.description = 'Please enter a task description';
  }
  return errors;
}

const AddTaskFormWrapper = reduxForm({
  form: 'addTaskForm',
  enableReinitialize: true,
  validate,
})(AddTaskForm);

const selector = formValueSelector('addTaskForm');

const mapStateToProps = store => {
  const initialTaskFormValues = {};
  if (store.taskListState.currentList) {
    initialTaskFormValues.taskList = store.taskListState.currentList.listName;
    initialTaskFormValues.taskListIdentifier =
      store.taskListState.currentList.taskListIdentifier;
  }
  if (store.taskState.task) {
    const editTask = store.taskState.task;
    initialTaskFormValues.description = editTask.description;
    initialTaskFormValues.taskIdentifier = editTask.taskIdentifier;
    if (editTask.patient) {
      initialTaskFormValues.patient = `${editTask.patient.firstName} ${editTask.patient.lastName}`;
      initialTaskFormValues.patientIdentifier = editTask.patient.patientIdentifier;
    }
    if (editTask.dueDate) {
      initialTaskFormValues.dueDate = new Date(editTask.dueDate);
      initialTaskFormValues.originalDueDate = editTask.dueDate;
    }
    if (editTask.reminderDt) {
      initialTaskFormValues.reminderDate = new Date(editTask.reminderDt);
      initialTaskFormValues.originalReminderDate = editTask.reminderDt;
    }
    if (editTask.assignedTo) {
      initialTaskFormValues.assignedTo = `${editTask.assignedTo.firstName} ${editTask.assignedTo.lastName}`;
      initialTaskFormValues.assignedToIdentifier = editTask.assignedTo.userIdentifier;
    }
    if (editTask.taskList) {
      initialTaskFormValues.taskList = editTask.taskList.listName;
    }
    if (editTask.subtasks) {
      initialTaskFormValues.subtasks = editTask.subtasks;
    }
    if (editTask.status) {
      initialTaskFormValues.status = editTask.status;
    }
    if (editTask.taskStatus) {
      initialTaskFormValues.taskStatus = editTask.taskStatus;
    }
    if (editTask.priority) {
      if (editTask.priority === 'HIGH') {
        initialTaskFormValues.priorityFlag = true;
      } else {
        initialTaskFormValues.priorityFlag = false;
      }
    }
  }
  return {
    initialValues: initialTaskFormValues,
    taskListSelection: selector(store, 'taskListIdentifier'),
    currentTask: store.taskState.task,
    currentSubtasks: selector(store, 'subtasks'),
    priorityFlag: selector(store, 'priorityFlag'),
    taskList: store.taskListState.currentList,
  };
};

const mapDispatchToProps = dispatch => ({
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  formActions: bindActionCreators(
    {
      reset,
      initialize,
      destroy,
      change,
      touch,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddTaskFormWrapper);
