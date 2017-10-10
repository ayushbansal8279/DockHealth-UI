import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import AddTaskForm from './AddTaskForm'
import AddSubtaskForm from './AddSubtaskForm';
import { formValueSelector, actions, reset, change, arrayPush } from 'redux-form'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
import * as PeopleActions from '../../actions/people-actions';
import * as TaskActions from '../../actions/task-actions';
import {ReactDOM, findDOMNode, getDOMNode} from 'react-dom'
import $ from 'jquery'
import BaseComponent from '../BaseComponent'

class AddTask extends BaseComponent {
	constructor(props, container) {
		super(props)
		this.container = container
		this.state = {
				value: '',
				assignedToId: '',
				subtasks:[],
	      currentSubtaskIndex:"",
				currentSubtask: undefined
		}
  		//this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTaskDetailsChange = this.handleTaskDetailsChange.bind(this)
		this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this)
		this.unmount = this.unmount.bind(this)
	}

	componentDidMount () {
  	console.log("mounted AddTask component")
		this.props.peopleActions.findAllUsersByOrganizationId();
	}

	componentWillUpdate (nextProps) {
	console.log('AddTask componentWillUpdate: '+nextProps)
	//if(this.props.patients && this.props.patients.length == 0 && nextProps.patients.length > 0){
		enableAutoCompleteForPatients(nextProps.patients);
		enableAutoCompleteForSubtaskPatients(nextProps.patients);
	//}
	// if(this.props.members && this.props.members.length == 0 && nextProps.members.length > 0){
		enableAutoCompleteForAssignedTo(nextProps.activeListMembers);
		enableAutoCompleteForSubtaskAssignedTo(nextProps.activeListMembers);
	// }
	}

	unmount() {
		var node = this.ReactDOM.getDOMNode();
		ReactDOM.unmountComponentAtNode(node);
		$(node).remove();
	}

  	handleTaskDetailsChange(event) {
    	this.setState({value: event.target.value});
  	}

	componentWillUnmount(){
		// alert("unmounting")
	}

	addSubtaskToState = (subtask) => {
		this.setState({subtasks:this.state.subtasks.concat(subtask)})
	}

	setSubtasks = (subtasks) => {
		this.setState({subtasks:subtasks})
		// alert(subtasks)
	}

	clearSubtasks = () => {
		this.setState({subtasks:[]})
		// alert(subtasks)
	}

/*
	handleSubmit () {
		if(this.props.taskListId != "inbox"){
			this.props.addTask({description: this.state.value, assignedToId: this.state.assignedToId, taskListId: this.props.taskListId, taskListId: this.props.taskListId})
		}else{
			this.props.addTask({description: this.state.value, assignedToId: this.state.assignedToId})
		}
		this.setState({value: ''})
		//closeAddTask(); //JS function
	}
*/
	handleAddMemberToTask(memberId){
		this.state.assignedToId = memberId
		// alert("clicked:" + this.state.memberId);
	}

	submit = (form) => {
		debugger
		//TODO - manually have to get the values since react-form doesn't pick up hidden values
		this.props.formActions.reset('addTaskForm')
		// console.log(this.state.subtasks)
		// form.subtasks = this.state.subtasks
		console.log(form)

		form.patientId = $("#add-patient-id").val();
		form.assignedToId = $("#assign-task-to-id").val();
		if(form.priority == true){
			form.priority = "HIGH"
		}else{
			form.priority = "LOW"
		}
		// form.taskListId = $("#taskListId").val();
		this.props.taskActions.saveTask(form);

		// print the form values to the console
		console.log(form)
		toggleTaskForm()
	}

	addSubtaskValues = (subtaskValues, index) => {
		this.setState({currentSubtaskIndex:""})
		if(index !== ""){
			subtaskValues.taskId = this.props.currentSubtasks[index].taskId
			this.props.formActions.change('addTaskForm', `subtasks[${index}]`, subtaskValues)
			// this.props.formActions.subtasks[index] = subtaskValues
			// this.props.formActions.arrayRemove('addTaskForm', 'subtasks', index)
			// this.props.formActions.arrayInsert('addTaskForm', 'subtasks', index, subtaskValues)
			// var currentSubtasks = this.props.currentSubtasks
		}else{
			subtaskValues.taskId = ""
			this.props.formActions.arrayPush('addTaskForm', 'subtasks', subtaskValues)
		}
	}

	currentSubtaskAndIndexToState = (index, task) => {
		this.setState({currentSubtaskIndex: index})
		this.setState({currentSubtask: task})
	}


    render() {
    	return (
				<div className="add-form-wrapper" ref="toggle">
					<div className="task-item add-form row expanded">
						<div className="column top-buffer large-12">
						<AddTaskForm
							onSubmit={this.submit}
							taskLists={this.props.taskLists}
							task={this.props.task}
							title={this.props.title}
							taskListId={this.props.taskListId}
							initialValues={"taskListId:"+this.props.taskListId}
							subtasks={this.state.subtasks}
							addSubtaskToState={this.addSubtaskToState}
							setSubtasks={this.setSubtasks}
							clearSubtasks={this.clearSubtasks}
							currentSubtaskAndIndexToState={this.currentSubtaskAndIndexToState}
							isEditing={this.props.isEditing}
						/>
						<AddSubtaskForm
							// initialValues={this.props.currentSubtasks[this.state.currentSubtaskIndex]}
							onSubmit={this.submitSubtask}
							// submitSubtask={this.submitSubtask}
							// addSubtask={this.addSubtask}
							addSubtaskValues={this.addSubtaskValues}
							currentSubtasks={this.props.currentSubtasks}
							currentSubtaskIndex={this.state.currentSubtaskIndex}
							title={this.props.title}
							currentTask={this.props.task}
							currentSubtask={this.state.currentSubtask}
						/>
						</div>
					</div>
					{/* <TaskListMembersDropdownListContainer getSelectedMemberId={this.handleAddMemberToTask}/> */}
				</div>

    	)
    }
}

const selector = formValueSelector('addTaskForm')

const mapStateToProps = function(store) {
  return {
		taskLists: store.taskListState.tasklist,
		patients: store.patientState.allPatients,
		peoplelist: store.peopleState.peoplelist,
		members: store.taskListState.tasklistmembers,
		task: store.taskState.task,
		currentSubtasks: selector(store, 'subtasks')
		// user: store.userState.user
  	}
};

function mapDispatchToProps(dispatch) {
  return {
	  taskActions: bindActionCreators(TaskActions, dispatch),
	  peopleActions: bindActionCreators(PeopleActions, dispatch),
		formActions: bindActionCreators({reset, change, arrayPush}, dispatch)
  }
}

//export default AddTask
export default connect(mapStateToProps, mapDispatchToProps)(AddTask);
