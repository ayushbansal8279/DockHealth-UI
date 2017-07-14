import React from 'react'
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form'
import BaseComponent from '../BaseComponent'
import BasicField from '../common/BasicField';
import * as TaskListActions from '../../actions/tasklist-actions'
import $ from 'jquery'

//let AddTaskForm = props => {
class AddTaskForm extends BaseComponent {
  constructor(props, container) {
		super(props)
		this.container = container
		this.handleTaskListSelection = this.handleTaskListSelection.bind(this)

    // const { handleSubmit, taskLists, task} = props
	}

  componentDidMount () {
    super.componentDidMount()
  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  handleTaskListSelection(event) {
    alert(event.target.value)
    this.props.taskListActions.getMembersByTaskListId(event.target.value, 'ACTIVE')
    $("#filed-in-taskList").val('foo-'+event.target.value);
    $("#filed-in-taskList").parent().addClass("has-value");
    $("#add-task-file-in-options").removeClass("is-open");
    // $("#filed-in-taskList").attr('aria-expanded','false');
    // $("#add-task-file-in-options").attr('aria-hidden','true');
    // $("#filed-in-taskList").removeClass("hover");
    // $("#filed-in-taskList").foundation('toggle');
    // toggleDropDown("filed-in-taskList");
  }

  render() {
  return (
    <form className="inline-label" onSubmit={this.props.handleSubmit}>
      <div className="main-task-wrapper">
        <div className="column large-12 text-center">
          <h5 className="section-title">{this.props.initialValues ? "Edit a task" : "Add a task"}</h5>
        </div>

        <Field name='description' type='text' component={BasicField} label='Task' xlinkHref="#icon-pencil" value="hello"/>
        <Field id="taskId" name="taskId" className="input-group-field" component="input" type="hidden"/>

        {/* **2** */}
        <Field id="add-patient" name='patient' type='text' component={BasicField} label='Add Patient' xlinkHref="#icon-patient" extraClassName="add-patient"/>
        <Field id="add-patient-id" name="patientId" className="input-group-field" component="input" type="hidden"/>

        {/*<div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-patient"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="add-patient" className="add-patient input-group-field" name="patient" component="input" type="text"/>
            <Field id="add-patient-id" name="patientId" className="input-group-field" component="input" type="hidden"/>
            <label>Add Patient</label>
          </div>
        </div>*/}



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
              <Field className="input-group-field" id="filed-in-taskList" name="taskList" component="input" value={this.props.taskListId} type="text" data-toggle="add-task-file-in-options" disabled/>
              <Field id="taskListId" name="taskListId" className="input-group-field" value={this.props.taskListId} component="input" type="hidden"/>
              <label>File in (filing only allowed in Inbox)</label>
            </div>
          </div>
        }

        {/* Hide 'assignedTo' if user is adding a task to the 'inbox'. Tasks can only be assigned from lists */}
        {this.props.title != "Inbox" || this.props.taskListSelection ?
          <span>
            <Field id="assign-task-to" name='assignedTo' type='text' component={BasicField} label='Assigned to' xlinkHref="#icon-assign-to" extraClassName="assign-to"/>
            <Field id="assign-task-to-id" name="assignedToId" className="input-group-field" component="input" type="hidden"/>
          </span>
          :
          <span></span>
        }

        {/*<div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="assign-task-to" className="assign-to input-group-field" name="assignedTo" component="input" type="text" />
            <Field id="assign-task-to-id" name="assignedToId" className="input-group-field" component="input" type="hidden"/>
            <label>Assigned to</label>
          </div>
        </div>*/}

        <div className="column large-12 input-group toggle-add-subtask">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field className="input-group-field" name="subtasks[]" component="input" type="text" />
            <label>{this.props.initialValues ? "Edit a subtask" : "Add a subtask"}</label>
          </div>
        </div>

        <div className="column large-12 text-right text-center">
          <input type="submit" className="button secondary medium" value="Save"/>
        </div>
      </div>

      <div className="subtask-wrapper">
        <div className="row expanded">
          <div className="column small-4 toggle-add-subtask">
            <svg className="icon"><use xlinkHref="#icon-arrow-left"></use></svg>
          </div>
          <div className="column small-4 text-center">
            <h5 className="section-title">Add a subtask</h5>
          </div>
        </div>

        <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field className="input-group-field" name="subtasks[0][description]" component="input" type="text" />
            <label>Subtask</label>
          </div>
        </div>

        {/*<div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="add-patient-subtask" className="add-patient input-group-field" name="patient" component="input" type="text" />
            <label>Add Patient</label>
          </div>
        </div>*/}

        {/* <div className="column large-12 input-group">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
          <div className="input-wrapper form-floating-label">
            <Field id="assign-subtask-to" className="assign-to input-group-field" name="assignedTo" component="input" type="text" />
            <label>Assigned to</label>
          </div>
        </div> */}

        {this.props.title != "Inbox" ?
          <span>
            <Field id="assign-task-to" name='subtask[assignedTo]' type='text' component={BasicField} label='Assigned to' xlinkHref="#icon-assign-to" extraClassName="assign-to"/>
            <Field id="assign-task-to-id" name="subtasks[0][assignedToId]" className="input-group-field" component="input" type="hidden"/>
          </span>
          :
          <span></span>
        }

        <div className="column large-12 text-right">
          <button type="submit" className="button secondary float-right button-small">Save</button>
        </div>
      </div>

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

		//TODO - handle assigned tasklist
	}
  return {
		initialValues: initialTaskFormValues,
    tasks: store.taskState.tasks,
    taskListSelection: selector(store, 'taskListId')
  }
};

const mapDispatchToProps = function(dispatch){
  return{
    taskListActions: bindActionCreators(TaskListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskForm);
