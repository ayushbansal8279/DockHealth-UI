import React from 'react'
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { Field, reduxForm, formValueSelector, FieldArray, arrayPush, actions } from 'redux-form'
import BaseComponent from '../BaseComponent'
import BasicField from '../common/BasicField';
import BasicFieldTaskDescription from '../common/BasicFieldTaskDescription';
import AddSubtaskField from './AddSubtaskField';
import AddSubtaskForm from './AddSubtaskForm';
import * as TaskListActions from '../../actions/tasklist-actions'
import $ from 'jquery'
import {mobileAnalyticsClient} from '../../api/analytics-api'

//let AddTaskForm = props => {
class AddTaskForm extends BaseComponent {
  constructor(props, container) {
		super(props)
    this.state = {
      taskListId:"",
      currentSubtaskIndex:""
      // currentSubtask:"",
      // subtasks:[]
      // subtaskIndex:0,

    }
		this.container = container
		this.handleTaskListSelection = this.handleTaskListSelection.bind(this)

    // const { handleSubmit, taskLists, task} = props
	}

  componentDidMount () {
    super.componentDidMount()
    // this.setState({"taskListId":this.props.taskListId})

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      'PageName': 'AddTaskForm'
    });
  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  componentWillUpdate (nextProps) {

  }

  handleTaskListSelection(event) {
    alert(event.target.value)
    this.props.taskListActions.getMembersByTaskListId(event.target.value, 'ACTIVE')
    $("#filed-in-taskList").val('taskList-'+event.target.value);
    $("#filed-in-taskList").parent().addClass("has-value");
    $("#add-task-file-in-options").removeClass("is-open");
    // $("#filed-in-taskList").attr('aria-expanded','false');
    // $("#add-task-file-in-options").attr('aria-hidden','true');
    // $("#filed-in-taskList").removeClass("hover");
    // $("#filed-in-taskList").foundation('toggle');
    // toggleDropDown("filed-in-taskList");
  }

  componentWillReceiveProps(nextProps){
    // if(nextProps.taskListId != this.props.taskListId){
    //   this.setState({"taskListId":nextProps.taskListId})
    // }
    // if(this.props.currentTask){
    //   if(nextProps.currentTask != this.props.currentTask){
    //     this.props.setSubtasks(nextProps.currentTask.subtasks)
    //     // alert("updated 1")
    //   }
    // }else{
    //   if(nextProps.currentTask.subtasks != this.props.subtasks){
    //     this.props.setSubtasks(this.props.subtasks)
    //     // alert("updated 2")
    //   }
    // }
  }

  addSubtaskValues = (subtaskValues, index) => {
    this.setState({currentSubtaskIndex:""})
    if(index !== ""){
      debugger;
      subtaskValues.taskId = this.props.currentSubtasks[index].taskId
      this.props.formActions.change('addTaskForm', `subtasks[${index}]`, subtaskValues)
      // this.props.formActions.subtasks[index] = subtaskValues
      // this.props.formActions.arrayRemove('addTaskForm', 'subtasks', index)
      // this.props.formActions.arrayInsert('addTaskForm', 'subtasks', index, subtaskValues)
      // var currentSubtasks = this.props.currentSubtasks
      debugger;
    }else{
      debugger;
      subtaskValues.taskId = ""
      this.props.formActions.arrayPush('addTaskForm', 'subtasks', subtaskValues)
    }

  }

  initializeSubtaskForm = (index) => {
    debugger;
    this.setState({currentSubtaskIndex: index})
    var task = this.props.currentSubtasks[index]

    // Checks if task came from an object (task.patient.firstName) or has been edited (task.patient = full name)
    if(task.patient && task.patient.firstName){
      task.patient = task.patient.firstName + " " + task.patient.lastName
    }
    if(task.priority == "HIGH"){
      task.priority = true
    }else{
      task.priority = false
    }
    this.props.formActions.initialize('addSubtaskForm', task, true)
    // $('#add-patient-subtask').val(this.props.currentSubtasks[index].patient.firstName)
    var patient = this.props.currentSubtasks[index]
    debugger;
  }

  resetSubtaskForm = () => {
    this.props.formActions.reset('addSubtaskForm')
  }

  render() {
    const renderSubtaskField = ({ fields, meta: { error } }) => (
      <span>
        {fields.map((subtask, index) =>
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
  return (
    <form className="inline-label" onSubmit={this.props.handleSubmit}>
      <div className="main-task-wrapper">
        <div className="column large-12 text-center">
          <h5 className="section-title">Add a Task</h5>
        </div>

        {/* Task */}
        <Field name='description' type='text' component={BasicField} label='Task' xlinkHref="#icon-pencil" isTaskDescription="true"/>
        <Field id="taskId" name="taskId" className="input-group-field" component="input" type="hidden"/>

        {/* ADD PATIENT */}
        <Field id="add-patient" name='patient' type='text' component={BasicField} label='Add Patient' xlinkHref="#icon-patient" extraClassName="add-patient"/>
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
                {this.props.taskLists.map(taskList => {
                  return(
                    <div key={taskList.taskListId} >
                      <Field id={"radio" + taskList.taskListId} className="input-group-field" name="taskListId" value={taskList.taskListId.toString()} component="input" type="radio" onClick={this.handleTaskListSelection}/>
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
              <Field className="input-group-field" id="filed-in-taskList" name="taskList" component="input" value={this.state.taskListId} type="text" data-toggle="add-task-file-in-options" disabled/>
              <Field id="taskListId" name="taskListId" className="input-group-field" value={this.state.taskListId} component="input" type="hidden"/>
              <label>File in (filing only allowed in Inbox)</label>
            </div>
          </div>
        }

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

        <div className="column top-buffer large-12">
					<div className="row">
						<div className="column">
							<span className="item-title">High Priority {this.props.priority}</span>
							<p className="text-light">Toggle task priority to high or low</p>
						</div>
						<div className="column shrink">
							<div className="switch">
								<Field className="switch-input" id="exampleSwitch" type="checkbox" name="priority" component="input"/>
								<label className="switch-paddle" htmlFor="exampleSwitch">
									<span className="show-for-sr">Download Kittens</span>
								</label>
							</div>
						</div>
					</div>
				</div>


        {/* <p>Priority</p>
        <div className="switch">
          <input className="switch-input" id="exampleSwitch" type="checkbox" name="exampleSwitch"/>
          <label className="switch-paddle" htmlFor="exampleSwitch">
            <span className="show-for-sr">Download Kittens</span>
          </label>
        </div> */}

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
            <div onClick={(e) => this.resetSubtaskForm()} className="columns highlight center-content-vertical toggle-add-subtask link">
              <svg className="icon hide"><use xlinkHref="#icon-subtask"></use></svg>+ Add a subtask
            </div> :
            <div className="columns center-content-vertical">
            </div>
          }

          {/* SAVE */}
          <div className="columns shrink align-right">
            <input type="submit" className="button secondary medium" value="Save"/>
          </div>
        </div>
      </div>{/*main-task-wrapper*/}
      {/* {this.props.initialValues.subtasks ? <h1>EDITING</h1> : <h1>Not editing</h1>} */}
      <AddSubtaskForm
        // initialValues={this.props.currentSubtasks[this.state.currentSubtaskIndex]}
        onSubmit={this.submitSubtask}
        // submitSubtask={this.submitSubtask}
        // addSubtask={this.addSubtask}
        subtaskIndex={this.state.currentSubtaskIndex}
        addSubtaskValues={this.addSubtaskValues}
        currentSubtasks={this.props.currentSubtasks}
        currentSubtaskIndex={this.state.currentSubtaskIndex}
        title={this.props.title}
        currentTask={this.props.currentTask}
      />
    </form>
  )
  }

}

AddTaskForm = reduxForm({
  // a unique name for the form
  form: 'addTaskForm',
  enableReinitialize : true
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
    priority: selector(store, 'priority')
  }
};

const mapDispatchToProps = function(dispatch){
  return{
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    formActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskForm);
