import React from 'react'
import AddTaskForm from './AddTaskForm'
import { connect } from 'react-redux'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
//import * as TaskListActions from '../../actions/tasklist-actions'
import TaskListMembersDropdownListContainer from './TaskListMembersDropdownListContainer'
import * as TaskApi from '../../api/task-api'

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
		//this.state.text = ""
  	}

		unmount() {
			ReactDOM.unmountComponentAtNode(this.container);
		}

  	handleTaskDetailsChange(event) {
    	this.setState({value: event.target.value});
  	}

		componentWillUnmount(){
			alert("unmounting")
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
			alert("working")
			// print the form values to the console
			console.log(values)
			this.unmount()
		}

    render() {
    return (
			<div id="addTaskFormWrapper" className="add-form-wrapper">
				<div className="task-item add-form row expanded">
					<AddTaskForm onSubmit={this.submit} taskLists={this.props.taskLists} patients={this.props.patients}/>
				</div>
				// <TaskListMembersDropdownListContainer getSelectedMemberId={this.handleAddMemberToTask}/>
			</div>

    )
    }
}

const mapStateToProps = function(store) {
  return {
    //tasks: store.taskState.tasks
    task: {},
		taskLists: store.taskListState.tasklist,
		patients: store.patientState.allPatients
  }
};

//export default AddTask
export default connect(mapStateToProps)(AddTask);
