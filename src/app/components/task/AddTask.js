import React from 'react'
import { connect } from 'react-redux'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
//import * as TaskListActions from '../../actions/tasklist-actions'
import TaskListMembersDropdownListContainer from './TaskListMembersDropdownListContainer'
import * as TaskApi from '../../api/task-api'

class AddTask extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
				value: '',
				assignedToId: ''
		};
    	this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTaskDetailsChange = this.handleTaskDetailsChange.bind(this)
		this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this)
	}

  	componentDidMount () {
    	console.log("mounted AddTask component")
		//this.state.text = ""
  	}

  	handleTaskDetailsChange(event) {
    	this.setState({value: event.target.value});
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

    render() {
    return (
			<div className="add-form-wrapper">
				<div className="task-item add-form row expanded">
					<form className="inline-label">
						<div className="main-task-wrapper">
							<div className="column large-12 text-center">
								<h5 className="section-title">Add a task</h5>
							</div>

							<div className="column large-12 input-group">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input className="input-group-field" type="text" value={this.state.value} onChange={this.handleTaskDetailsChange}/>
									<label>Task</label>
								</div>
							</div>

							<div className="column large-12 input-group">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input id="add-patient" className="add-patient input-group-field" type="text"/>
									<label>Add Patient</label>
								</div>
							</div>

							<div className="column large-12 input-group input-dropdown">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input className="input-group-field" type="text" data-toggle="add-task-file-in-options"/>
									<label>File in</label>
								</div>

								<div className="dropdown-pane" id="add-task-file-in-options" data-dropdown="true" data-close-on-click="true">
									<fieldset className="large-12 columns">
										<input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">Inbox</label><br/>
										<input id="checkbox2" type="checkbox"/><label htmlFor="checkbox2">Boston Clinic (Mike Docktor)</label><br/>
										<input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">Waltham Clinic (Mike Docktor)</label>
									</fieldset>
								</div>
							</div>

							<div className="column large-12 input-group">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input id="assign-task-to" className="assign-to input-group-field" type="text"/>
									<label>Assigned to</label>
								</div>
							</div>

							<div className="column large-12 input-group has-value">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input className="pickdate input-group-field" type="text" value=""/>
									<label>Due date</label>
								</div>
							</div>

							<div className="column large-12 input-group toggle-add-subtask">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-subtask"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input className="input-group-field" type="text"/>
									<label>Add a subtask</label>
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
									<input className="input-group-field" type="text"/>
									<label>Subtask</label>
								</div>
							</div>

							<div className="column large-12 input-group">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input id="add-patient-subtask" className="add-patient input-group-field" type="text"/>
									<label>Add Patient</label>
								</div>
							</div>

							<div className="column large-12 input-group">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input id="assign-subtask-to" className="assign-to input-group-field" type="text"/>
									<label>Assigned to</label>
								</div>
							</div>

							<div className="column large-12 input-group">
								<span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg></span>
								<div className="input-wrapper form-floating-label">
									<input className="pickdate input-group-field" type="text"/>
									<label>Due date</label>
								</div>
							</div>

							<div className="column large-12 text-right">
								<button onClick={this.handleSubmit} className="button secondary float-right button-small">Save</button>
							</div>
						</div>

					</form>
				</div>
				<TaskListMembersDropdownListContainer getSelectedMemberId={this.handleAddMemberToTask}/>
			</div>

    )
    }
}

const mapStateToProps = function(store) {
  return {
    //tasks: store.taskState.tasks
    task: {}
  }
};

//export default AddTask
export default connect(mapStateToProps)(AddTask);
