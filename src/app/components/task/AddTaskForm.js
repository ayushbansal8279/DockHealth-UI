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

//let AddTaskForm = props => {
class AddTaskForm extends BaseComponent {
  constructor(props, container) {
		super(props)
    this.state = {
      taskListId:"",
      currentSubtaskId:"",
      currentSubtask:""
      // subtaskIndex:0,

    }
		this.container = container
		this.handleTaskListSelection = this.handleTaskListSelection.bind(this)

    // const { handleSubmit, taskLists, task} = props
	}

  componentDidMount () {
    super.componentDidMount()
    this.setState({"taskListId":this.props.taskListId})
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

  componentWillReceiveProps(nextProps){
    if(nextProps.taskListId != this.props.taskListId){
      this.setState({"taskListId":nextProps.taskListId})
    }
  }

  // submitSubtask = (addSubtaskForm) => {
  //   debugger;
  //   var key
  //   var curSubtaskId = this.state.currentSubtaskId
  //   console.log(this.props.subtasks)
  //   console.log(this.state.currentSubtaskId == null)
  //   console.log(this.state.currentSubtaskId !== "")
  //   if(this.state.currentSubtaskId !== ""){
  //     key = this.state.currentSubtaskId
  //   }else{
  //     var key = this.state.subtaskIndex
  //   }
  //   var val = addSubtaskForm
  //   var obj = this.props.subtasks
  //   this.props.subtasks[key] = val
  //   obj[key] = val
  //   this.setState(obj)
  //   this.setState({subtaskIndex:this.props.subtasks.length})
  //   this.setState({currentSubtaskId:""})
  //   // this.setState({subtasks: this.props.subtasks.concat(
  //   //   [addSubtaskForm]
  //   // )})
  //   console.log(this.state.subtasks)
  // }

  submitSubtask = (subtask) => {
    debugger;
    this.props.addSubtaskToState(subtask)
    // this.setState({subtasks: this.props.subtasks.concat(
    //   [addSubtaskForm]
    // )})
    // console.log(this.state.subtasks)
  }

  setCurrentSubtask = (index) => {
    this.setState({currentSubtaskId:index})
    // console.log(this.props.subtasks)
    console.log(this.props.currentTask.subtasks)
    if(this.props.currentTask){
      this.setState({currentSubtask:this.props.currentTask.subtasks[index]})
    }else(
      this.setState({currentSubtask:this.props.subtasks[index]})
    )
  }

  addSubtask = (subtask) => {
    this.props.formActions.arrayPush('addTaskForm', 'subtasks', subtask)
  }


  render() {
    const renderSubtaskField = ({ fields, meta: { error } }) => (
      <span>
        {fields.map((subtask, index) =>
          <div key={index} onClick={(e) => this.setCurrentSubtask(index)}  className="column large-12 input-group toggle-add-subtask has-value">
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
        <Field name='description' type='text' component={BasicFieldTaskDescription} label='Task' xlinkHref="#icon-pencil" isTaskDescription="true"/>
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
          <div className="columns highlight center-content-vertical toggle-add-subtask link">
            <svg className="icon hide"><use xlinkHref="#icon-subtask"></use></svg>+ Add a subtask
          </div>

          {/* SAVE */}
          <div className="columns shrink align-right">
            <input type="submit" className="button secondary medium" value="Save"/>
          </div>
        </div>
      </div>{/*main-task-wrapper*/}
      {/* {this.props.initialValues.subtasks ? <h1>EDITING</h1> : <h1>Not editing</h1>} */}
      <AddSubtaskForm
        initialValues={this.props.currentTask}
        onSubmit={this.submitSubtask}
        submitSubtask={this.submitSubtask}
        addSubtask={this.addSubtask}
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

		//TODO - handle assigned tasklist
	}
  return {
		initialValues: initialTaskFormValues,
    tasks: store.taskState.tasks,
    taskListSelection: selector(store, 'taskListId'),
    currentTask: store.taskState.task
  }
};

const mapDispatchToProps = function(dispatch){
  return{
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    formActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskForm);
