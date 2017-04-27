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
		TaskApi.addTask({description: this.state.value, createdByUserId: 1, assignedToId: this.state.assignedToId, taskListId:'1'})
		this.setState({value: ''})
		closeAddTask(); //JS function
  	}

  	handleAddMemberToTask(memberId){
  		this.state.assignedToId = memberId
  		// alert("clicked:" + this.state.memberId);
  	}

    render() {
    return (

	<div className="row collapse my-task-add-container">
		<div className="large-8 columns my-task-add-section" >
			<div className="add-task column my-task-add-section-column">
				<form>
					<div className="row">
						<div className="medium-12 columns">
							<div className="slidein-wrapper">
								<div className="slidein">
									<p className="small">Type <span className="highlight">@</span> to assign a task. Type <span className="highlight">#</span> to refer to a patient.</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<div className="add-task-description-wrapper">
								<label>
									<input type="text" placeholder="What is your task?" value={this.state.value} onChange={this.handleTaskDetailsChange}/>
								</label>
								<svg className="icon medium-2 priority"><use xlinkHref="#icon-cross"></use></svg>
							</div>
						</div>
						<TaskListMembersDropdownListContainer getSelectedMemberId={this.handleAddMemberToTask}/>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<div className="slidein-wrapper medium">
								<div className="slidein item-group">
									<div className="float-left">
										<span className="task-details-block">
											<img className="item memberphoto" src="assets/img/memberphoto.png" alt="name of user"/>
											<img className="item memberphoto" src="assets/img/memberphoto2.png" alt="name of user"/>
											<img className="item memberphoto" src="assets/img/memberphoto3.png" alt="name of user"/>
											<svg className="item add icon memberphoto"><use xlinkHref="#icon-add"></use></svg>
										</span>
										<span className="task-details-block" data-toggle="set-date">
											<svg className="item icon medium-2 align-right"><use xlinkHref="#icon-calendar"></use></svg>
										</span>
									</div>
									<div className="float-right">
										<button onClick={this.handleSubmit} className="button primary float-right button-small">Add</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
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