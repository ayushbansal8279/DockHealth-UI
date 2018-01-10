import React from 'react'
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { Field, reduxForm, formValueSelector, FieldArray, arrayPush, actions, reset, initialize, destroy, change, touch } from 'redux-form'
import BaseComponent from '../BaseComponent'
import BasicField from '../common/BasicField';
import BasicFieldTaskDescription from '../common/BasicFieldTaskDescription';
import AddSubtaskField from './AddSubtaskField';
import * as TaskListActions from '../../actions/tasklist-actions'
import $ from 'jquery'
import {mobileAnalyticsClient} from '../../api/analytics-api'
import Moment from 'react-moment'

//let AddTaskForm = props => {
class AddTaskForm extends BaseComponent {
  constructor(props, container) {
		super(props)
    this.state = {
      taskListId:"",
      priority: undefined
    }
		this.container = container
		this.handleTaskListSelection = this.handleTaskListSelection.bind(this)

    // const { handleSubmit, taskLists, task} = props
	}



  componentDidMount () {
    super.componentDidMount()
    // this.setState({"taskListId":this.props.taskListId})

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      'PageName': 'AddTask'
    });

  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  componentWillUpdate (nextProps) {
    if(nextProps.task && this.props.currentTask != nextProps.task){
      this.setState({priority:(nextProps.task.priority == "HIGH" ? true : false)})
    }
  }

  handleTaskListSelection(event) {
    this.props.taskListActions.getMembersByTaskListId(event.target.value, 'ALL')
    // $("#filed-in-taskList").val('taskList-'+event.target.value);
    $("#filed-in-taskList").val('taskList-'+event.target.value);
    $("#filed-in-taskList").parent().addClass("has-value");
    $("#add-task-file-in-options").removeClass("is-open");
  }

  componentWillReceiveProps(nextProps){
  }

  initializeSubtaskForm = (index) => {
    var task = this.props.currentSubtasks[index]
    this.props.currentSubtaskAndIndexToState(index, task)

    // Checks if task came from an object (task.patient.firstName) or has been edited (task.patient = full name)
    if(task.patient && task.patient.firstName){
      task.patient = task.patient.firstName + " " + task.patient.lastName
    }
    if(task.priority == "HIGH"){
      task.priority = true
    }else{
      task.priority = false
    }
    if(task.dueDate){
      task.dueDate = formatDateAndTime(task.dueDate);
    }
    if(task.reminderDt){
      task.reminderDt = formatDateAndTime(task.reminderDt);
    }
    this.props.formActions.initialize('addSubtaskForm', task, true)
    // touch(form:String, ...fields:String)
    var patient = this.props.currentSubtasks[index]
  }



  changeTaskPriority = () => {
    var priority = !this.state.priority
    this.setState({priority:priority})
    this.props.formActions.change("addTaskForm", "priority", priority)
  }

  resetSubtaskForm = (patient) => {
    if(patient != undefined){
      var patientName = patient.firstName + " " + patient.lastName
      this.props.formActions.change("addSubtaskForm", "patient", patientName)
      this.props.formActions.change("addSubtaskForm", "patientId", patient.patientId)
    }
    // this.props.formActions.reset('addSubtaskForm')
  }

  updateDueDate = (e) => {
    alert("working")
  }

  formatDate = () => {
    alert("format date");
  }

  render() {
    const renderSubtaskField = ({ fields, meta: { error } }) => (
      <span>
        {fields && fields.map((subtask, index) =>
          <div key={index} onClick={() => this.initializeSubtaskForm(index)} className="column large-12 input-group toggle-add-subtask has-value">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <Field className="input-group-field" type="text" name={`${subtask}.description`} component="input"/>
              <label>Subtask #{index + 1}</label>
            </div>
          </div>
        )}
        {/* <button type="button" onClick={() => fields.push({})}>Add Subtask</button> */}
      </span>
    )
    const renderDescriptionField = ({ input, label, type, meta: { touched, error, warning } }) => (
      <div className={"input-group-wrapper column large-12 " + (touched && error ? 'has-error' : ' ')}>
        {/* <h5>{touched ? "touched" : "untouched"}</h5> */}
        <div className="input-group icon-right icon-left">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className={"input-wrapper form-floating-label " + (input.value && "has-value")}>
            <input {...input} className="input-group-field " type="text"/>
            <label>Task</label>
          </div>
          <span onClick={() => this.changeTaskPriority()} className="input-group-label"><svg className={"icon flag medium " + (this.state.priority ? "" : "no-flag")}><use xlinkHref="#icon-flag"></use></svg></span>
        </div>
        {touched && error &&
          <span className="form-error">
            {error}
          </span>
        }
      </div>
    )

  return (

    <form className="inline-label" onSubmit={this.props.handleSubmit}>
      <div className="main-task-wrapper">
        <div className="column large-12 text-center">
          <h5 className="section-title">Add a Task</h5>
        </div>

        {/* Description */}
        <Field name="description" type="text" label="Description" component={BasicFieldTaskDescription} callback={this.changeTaskPriority} priority={this.state.priority}/>
        {/* <Field name='description' type='text' component={testField} label='Task' xlinkHref="#icon-pencil" isTaskDescription="true"/> */}
        <Field id="taskId" name="taskId" className="input-group-field" component="input" type="hidden"/>

        {/* Comment */}
        {this.props.isEditing != true &&
          <Field name='comment' type='text' component={BasicField} label='Comment' xlinkHref="#icon-pencil" isTaskDescription="true"/>
        }
        {/* <Field id="taskId" name="taskId" className="input-group-field" component="input" type="hidden"/> */}

        {/* ADD PATIENT */}
        <Field onChange={(e) => this.props.isSubtask(false)} id="add-patient" name='patient' type='text' component={BasicField} label='Add Patient' xlinkHref="#icon-patient" extraClassName="add-patient"/>
        <Field id="add-patient-id" name="patientId" className="input-group-field" component="input" type="hidden"/>

        {/* FILE IN */}
        {/* Show only from inbox. Tasks can only be assigned to list from 'inbox' */}
        {this.props.title == "Inbox" ?
          <div className="column large-12 input-group input-dropdown">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-list"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <Field className="input-group-field" id="filed-in-taskList" name="taskList" component="input" type="text" data-toggle="add-task-file-in-options"/>
              <label>File in</label>
            </div>
            <div className="dropdown-pane" id="add-task-file-in-options" data-dropdown="true" data-close-on-click="true">
              <fieldset className="large-12 columns">
                {this.props.taskLists && this.props.taskLists.map(taskList => {
                  return(
                    <div key={taskList.taskListId} >
                      <Field id={"radio" + taskList.taskListId} className="input-group-field" name="taskListId" value={taskList.taskListId.toString()} title={taskList.listName} component="input" type="radio" onClick={this.handleTaskListSelection}/>
                      <label htmlFor={"radio" + taskList.taskListId}>{taskList.listName}</label>
                      <br/>
                    </div>
                  )
                })}
              </fieldset>
            </div>
          </div>
          :
          <div className="column large-12 input-group input-dropdown">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-list"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <Field className="input-group-field" id="filed-in-taskList" name="taskList" component="input" value={this.props.taskList?this.props.taskList.taskListId:0} type="text" data-toggle="add-task-file-in-options" disabled/>
              <Field id="taskListId" name="taskListId" className="input-group-field" value={this.props.taskList?this.props.taskList.taskListId:0} component="input" type="hidden"/>
              <label>File in (filing only allowed in Inbox)</label>
            </div>
          </div>
        }

        {/* Example of error field */}
        {/* <div className="input-group-wrapper has-error column large-12">
          <div className="large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-patient"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <input id="add-patient" className="add-patient input-group-field" type="text"/>
              <label>Add Patient</label>
            </div>
          </div>
          <span className="form-error">
            Please enter a task title.
          </span>
        </div> */}

        {/* ASSIGNED TO */}
        {/* Hide 'assignedTo' if user is adding a task to the 'inbox'. Tasks can only be assigned from lists */}
        {this.props.title != "Inbox" || this.props.taskListSelection ?
          <span>
            <Field id="assign-task-to" name='assignedTo' type='text' component={BasicField} label='Assigned to' xlinkHref="#icon-assign-to" extraClassName="assign-to"/>
            <Field id="assign-task-to-id" name="assignedToId" className="input-group-field" component="input" type="hidden"/>
          </span>
          :
          <span></span>
        }

        <Field id="due-date" name='dueDate' type='text' component={BasicField} label='Due date' xlinkHref="#icon-calendar" extraClassName="duedatepickdate"/>
        <Field id="reminder-date" name='reminderDt' type='text' component={BasicField} label='Reminder date' xlinkHref="#icon-calendar" extraClassName="duedatepickdate"/>

        <FieldArray name="subtasks" component={renderSubtaskField}/>

        {/* {this.props.subtasks.map((subtask, index) => {
          return(<AddSubtaskField subtask={subtask} index={index} setCurrentSubtask={this.setCurrentSubtask}/>)
        })} */}

        {/* SUBTASKS */}
        {/* <div className="column large-12 input-group toggle-add-subtask has-value">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <input className="input-group-field" type="text" value="This is a second subtask."/>
            <label>Subtask #2</label>
          </div>
        </div> */}

        <div className="row expanded">
          {!this.props.currentTask || !this.props.currentTask.parentTaskId ?
            <div onClick={(e) => this.resetSubtaskForm(this.props.currentTask.patient)} className="columns highlight center-content-vertical toggle-add-subtask link">
              <svg className="icon hide"><use xlinkHref="#icon-subtask"></use></svg>+ Add a subtask
            </div> :
            <div className="columns center-content-vertical">
            </div>
          }

          {/* SAVE */}
          <div className="columns shrink align-right">
            <input id="addTaskButton" type="submit" className="button secondary medium" value="Save"/>
          </div>
        </div>
      </div>{/*main-task-wrapper*/}
      {/* {this.props.initialValues.subtasks ? <h1>EDITING</h1> : <h1>Not editing</h1>} */}
    </form>

  )
  }

}

function validate(values){
  const errors = {};
  if(!values.description){
    errors.description = 'Please enter a task description';
  }
  return errors;
}

AddTaskForm = reduxForm({
  // a unique name for the form
  form: 'addTaskForm',
  enableReinitialize : true,
  validate
})(AddTaskForm)

const selector = formValueSelector('addTaskForm')

const mapStateToProps = function(store) {





	var initialTaskFormValues = {}
  if(store.taskListState.currentList){
    initialTaskFormValues.taskList = store.taskListState.currentList.listName
    initialTaskFormValues.taskListId = store.taskListState.currentList.taskListId
  }
  // console.log("current list")
  // console.log(store.taskListState.currentList)
	if(store.taskState.task){
		var editTask = store.taskState.task;
      initialTaskFormValues.description = editTask.description;
  		initialTaskFormValues.taskId = editTask.taskId;
		if(editTask.patient){
			initialTaskFormValues.patient = editTask.patient.firstName+" "+editTask.patient.lastName;
			initialTaskFormValues.patientId = editTask.patient.patientId;
		}
    if(editTask.dueDate){
      initialTaskFormValues.dueDate = formatDateAndTime(editTask.dueDate);
    }
    if(editTask.reminderDt){
      initialTaskFormValues.reminderDt = formatDateAndTime(editTask.reminderDt);
    }
		if(editTask.assignedTo){
			initialTaskFormValues.assignedTo = editTask.assignedTo.firstName+" "+editTask.assignedTo.lastName;
			initialTaskFormValues.assignedToId = editTask.assignedTo.userId;
		}
    if(editTask.taskList){
      initialTaskFormValues.taskList = editTask.taskList.listName;
    }
    if(editTask.subtasks){
      initialTaskFormValues.subtasks = editTask.subtasks;
    }
    if(editTask.priority){
      if(editTask.priority == "HIGH"){
        initialTaskFormValues.priority = true;
      }else{
        initialTaskFormValues.priority = false;
      }
    }

		//TODO - handle assigned tasklist
	}
  return {
		initialValues: initialTaskFormValues,
    tasks: store.taskState.tasks,
    taskListSelection: selector(store, 'taskListId'),
    currentTask: store.taskState.task,
    currentSubtasks: selector(store, 'subtasks'),
    priority: selector(store, 'priority'),
    taskList: store.taskListState.currentList
  }
};

const mapDispatchToProps = function(dispatch){
  return{
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    formActions: bindActionCreators({reset, initialize, destroy, change, touch}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskForm);
