import React from 'react'
import { connect } from 'react-redux'
import { actions } from 'redux-form'
import {bindActionCreators} from 'redux';
import AddTaskForm from './AddTaskForm'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
import TaskListMembersDropdownListContainer from './TaskListMembersDropdownListContainer'
// import * as PatientApi from '../../api/patient-api'
import * as PeopleActions from '../../actions/people-actions';
import * as TaskActions from '../../actions/task-actions';
import {ReactDOM, findDOMNode, getDOMNode} from 'react-dom'
import $ from 'jquery'

class AddTask extends React.Component {
	constructor(props, container) {
		super(props)
		this.container = container
		this.state = {
				value: '',
				assignedToId: '',
				subtasks:[]
		}
  		//this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTaskDetailsChange = this.handleTaskDetailsChange.bind(this)
		this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this)
		this.unmount = this.unmount.bind(this)
	}

  	componentDidMount () {
    	console.log("mounted AddTask component")
			this.props.peopleActions.findAllUsersByOrganizationId();
		// PatientApi.getAllPatients().then(allPatients => {
		// 	enableAutoComplete(allPatients);
    	// }).catch(error => {
      	// 	console.log(error);
    	// });
		//this.state.text = ""
  	}

  	componentWillUpdate (nextProps) {
			if(this.props.patients && this.props.patients.length == 0 && nextProps.patients.length > 0){
				enableAutoCompleteForPatients(nextProps.patients);
				enableAutoCompleteForSubtaskPatients(nextProps.patients);
			}
			if(this.props.members && this.props.members.length == 0 && nextProps.members.length > 0){
				enableAutoCompleteForAssignedTo(nextProps.members);
			}
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
		debugger;
		//TODO - manually have to get the values since react-form doesn't pick up hidden values
		this.props.formActions.reset('addTaskForm')
		// form["subtasks"] = this.state.subtasks
		console.log(form)
		// console.log(this.state.subtasks)

		form.patientId = $("#add-patient-id").val();
		form.assignedToId = $("#assign-task-to-id").val();
		// form.taskListId = $("#taskListId").val();
		this.props.taskActions.saveTask(form);

		// print the form values to the console
		console.log(form)
		$('.add').toggleClass('close');
		$('body').toggleClass('disable-header-scroll');
		if($(this).hasClass('add-list')) {
			$('.add-list use').attr('href', function(index, attr) {
				return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
			});
		}
		$('.add-form-wrapper').slideToggle(300);
		$('.list-filter .controls, .list-wrapper').toggle();

	}

    render() {
    	return (
			<div className="add-form-wrapper" ref="toggle">
				<div className="task-item add-form row expanded">
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
					/>
				</div>
				{/* <TaskListMembersDropdownListContainer getSelectedMemberId={this.handleAddMemberToTask}/> */}

			</div>

    	)
    }
}

const mapStateToProps = function(store) {
  return {
		taskLists: store.taskListState.tasklist,
		patients: store.patientState.allPatients,
		peoplelist: store.peopleState.peoplelist,
		members: store.taskListState.tasklistmembers,
		task: store.taskState.task
		// user: store.userState.user
  	}
};

function mapDispatchToProps(dispatch) {
  return {
	  taskActions: bindActionCreators(TaskActions, dispatch),
	  peopleActions: bindActionCreators(PeopleActions, dispatch),
		formActions: bindActionCreators(actions, dispatch)
  }
}

//export default AddTask
export default connect(mapStateToProps, mapDispatchToProps)(AddTask);
