import React from 'react'
import AddTaskForm from './AddTaskForm'
import { connect } from 'react-redux'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
//import * as TaskListActions from '../../actions/tasklist-actions'
import TaskListMembersDropdownListContainer from './TaskListMembersDropdownListContainer'
import * as TaskApi from '../../api/task-api'
import * as PatientApi from '../../api/patient-api'
import {ReactDOM, findDOMNode, getDOMNode} from 'react-dom'
import $ from 'jquery'

class AddTask extends React.Component {
	constructor(props, container) {
		super(props)
		this.container = container
		this.state = {
				value: '',
				assignedToId: ''
		}
  	this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTaskDetailsChange = this.handleTaskDetailsChange.bind(this)
		this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this)
		this.unmount = this.unmount.bind(this)
	}

  	componentDidMount () {
    	console.log("mounted AddTask component")
		// PatientApi.getAllPatients().then(allPatients => {
		// 	enableAutoComplete(allPatients);
    	// }).catch(error => {
      	// 	console.log(error);
    	// });
		//this.state.text = ""
  	}

  	componentWillUpdate (nextProps) {
			if(this.props.patients.length == 0 && nextProps.patients.length > 0){
				enableAutoComplete(nextProps.patients);
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

	handleSubmit () {
	if(this.props.taskListId != "inbox"){
		this.props.addTask({description: this.state.value, assignedToId: this.state.assignedToId, taskListId: this.props.taskListId})
	}else{
		this.props.addTask({description: this.state.value, assignedToId: this.state.assignedToId})
	}
	this.setState({value: ''})
	//closeAddTask(); //JS function
	}

	handleAddMemberToTask(memberId){
		this.state.assignedToId = memberId
		// alert("clicked:" + this.state.memberId);
	}

	submit = (values) => {
		this.props.addTask(values)
		// print the form values to the console
		console.log(values)
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
			<div id="addTaskFormWrapper" className="add-form-wrapper" ref="toggle">
				<div className="task-item add-form row expanded">
					<AddTaskForm onSubmit={this.submit} taskLists={this.props.taskLists} patients={this.props.patients} task={this.props.task}/>
				</div>
				// <TaskListMembersDropdownListContainer getSelectedMemberId={this.handleAddMemberToTask}/>
				<script>
  					{/*enableAutoComplete([]);*/}
				</script>
			</div>

    	)
    }
}

const mapStateToProps = function(store) {
  return {
    //tasks: store.taskState.tasks
		taskLists: store.taskListState.tasklist,
		patients: store.patientState.allPatients,
		initialValues: store.taskState.task
	// user: store.userState.user
  	}
};

//export default AddTask
export default connect(mapStateToProps)(AddTask);
