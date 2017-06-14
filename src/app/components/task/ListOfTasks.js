import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import Moment from 'react-moment'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
import TaskListMembersDropdownListContainer from './TaskListMembersDropdownListContainer'
import TaskListMembersContainer from './TaskListMembersContainer'
import * as userApi from '../../api/user-api'

class TaskList extends React.Component {
		constructor(props) {
	  	super(props)
	  	this.state = {
	    		value: '',
	    		status: props.initialStatus
	  	};
	  	this.handleSubmit = this.handleSubmit.bind(this)
			this.handleTaskCommentUpdate = this.handleTaskCommentUpdate.bind(this)
			this.handleMarkComplete = this.handleMarkComplete.bind(this)
			this.handleDeleteTask = this.handleDeleteTask.bind(this)
			this.handleUpdateTaskDescription = this.handleUpdateTaskDescription.bind(this)
			this.handleToggleTaskPriority = this.handleToggleTaskPriority.bind(this)
			this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this)
			this.addPatientToTaskCallback = this.addPatientToTaskCallback.bind(this)
			this.markAsUnread = this.markAsUnread.bind(this)
		}

    isLoggedIn(message, isLoggedIn, cognitoUser) {
        if (!isLoggedIn) {
            //this.router.navigate(['/home/login']);
			console.log('not logged in')
        } else {
            //this.userParams.getParameters(new GetParametersCallback(this));
			console.log('logged in: '+cognitoUser.username)
			this.cognitoUser = cognitoUser
        }
    }

  	handleSubTaskChange(event) {
    	// this.setState({comment: event.target.value, parentTaskId: event.target.parentTaskId});
  	}

  	handleTaskCommentUpdate(taskId, commentDescription) {
			this.setState({taskId: taskId, comment: commentDescription})
  	}

  	handleUpdateTaskDescription(taskId, userId, description){
  		// this.setState({description: event.target.value})
  		this.props.updateTaskDescription(taskId, userId, description)
  	}

  	handleSubmit () {
		if(this.state.comment != ""){
			this.props.addTaskComment(this.state.taskId, {comment: this.state.comment, creator:{userId: 1}})
			this.setState({comment: ''})
		}
  	}

  	handleMarkComplete(task, status){
  		this.props.markComplete(task, status, this.props.listName)
  		// this.setState({task: ''})
  	}

  	handleDeleteTask(taskId, userId){
  		this.props.deleteTask(taskId, userId)
  	}

  	handleToggleTaskPriority(taskId, userId, priority){
  		this.props.toggleTaskPriority(taskId, userId, priority)
  	}

  	handleAddMemberToTask(memberId, member, taskId){
  		this.props.assignOrReassignTask(taskId, '1', memberId, member)
  	}

		addPatientToTaskCallback(patientId, taskId){
			this.props.addPatientToTask(patientId, taskId)
		}

		markAsUnread(task, flagUnread){
			this.props.markAsUnread(task, flagUnread)
		}


    render() {
		if(AWS.config.credentials){
			console.log("user name: "+AWS.config.credentials.params.IdentityId);
		}

		//userApi.isAuthenticated(this)

    return (
		<span>
		{this.props.tasks.map(task => {

		console.log({task})
			let dueDateComponent = ""
			if(task.dueDate){
				let dueDate = new Date(task.dueDate)
				dueDateComponent = <Moment format="MMM DD">{dueDate}</Moment>
			}
			let reminderDateComponent = ""
			if(task.reminderDt){
				let reminderDate = new Date(task.reminderDt);
				reminderDateComponent = <Moment format="MMM DD">{reminderDate}</Moment>
			}
			let createdDateTime = new Date(task.createdDateTime)
			let assignees = "";
			if(task.assignees){
				assignees = task.assignees.map(function(assignee) {
					let assigneeInitials = assignee.firstName.substr(0,1)+assignee.lastName.substr(0,1)
					return <span className="memberphoto active" key={assignee.userId}>{assigneeInitials}</span>
				})
			}
			let subtaskNodes = "";
			if(task.subtasks){
				let index = 1
				subtaskNodes = task.subtasks.map(function(subtask){
					return(
						<div className="subtask-item row expanded">
							<div className="columns shrink">
								<div className="mark-complete complete"><svg className="small icon"><use xlinkHref="#icon-checkmark"></use></svg></div>
							</div>
							<div className="columns shrink">
								<span classNameName="member-initials circle xsmall">{subtask.creator.firstName.substr(0,1)} {subtask.creator.lastName.substr(0,1)}</span>
							</div>
							<div className="columns shrink align-right">
								<svg className="icon medium no-flag"><use xlinkHref="#icon-flag"></use></svg>
							</div>
							<div className="columns">
								<span className="task-title complete"><span className="subtask-number">{index}</span>Schedule a call with patients primary physician.</span>
								<span className="task-details text-light">Assigned by Megan Smith &#8226; 1:22 PM</span>
								<div className="comments-container">
									<div className="row expanded collapse comment-wrapper">
										<div className="columns shrink">
											<span className="member-initials circle xsmall">MD</span>
										</div>
										<div className="columns">
											<span className="comment">Ok, Ill make sure</span>
										</div>
										<div className="columns shrink align-right">
											<span className="time comment-time">1m ago</span>
										</div>
									</div>
									<div className="row expanded collapse comment-wrapper">
										<div className="columns shrink">
											<span className="member-initials circle xsmall">SL</span>
										</div>
										<div className="columns">
											<span className="comment">Yes, its covered. Noted her MR.</span>
										</div>
										<div className="columns shrink align-right">
											<span className="time comment-time">10m ago</span>
										</div>
									</div>
								</div>
							</div>
							<div className="columns shrink align-right">
								<svg className="icon medium text-light ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
							</div>
						</div>
					)
				})
			}
			let commentNodes = "";
			if(task.comments){
					commentNodes = task.comments.map(function(comment) {
					return (
						<div className="comments-container">
							<div className="row expanded collapse comment-wrapper" key={comment.commentId}>
								<div className="columns shrink">
									{/*<img className="memberphoto small float-left" src="assets/img/memberphoto.png" alt="name of user"/>*/}
									<span className="member-initials circle xsmall">{comment.creator.firstName.substr(0,1)} {comment.creator.lastName.substr(0,1)}</span>
								</div>
								<div className="columns">
									<span className="comment">{comment.comment}</span>
								</div>
								<div className="columns shrink align-right">
									<span className="time comment-time">1m ago</span>
								</div>
							</div>
							{/*<div className="row expanded collapse comment-wrapper">
								<div className="columns shrink text-light">
									Load 2 earlier comments
								</div>
							</div>*/}
						</div>
					)
				})
			}else{
				return (
					<div class="row expanded collapse comment-wrapper">
						<div class="columns shrink">
							<img class="member-photo circle xsmall" src={userProfilePic} alt={user.firstName + user.lastName}/>
						</div>
						<div class="columns">
							<span class="comment text-light">Add a comment...</span>
						</div>
					</div>
				)
			}
			let taskPriorityClass = "icon medium priority"
			if(task.priority!=null && task.priority!="LOW"){
				taskPriorityClass = taskPriorityClass + " high"
			}
      return (
				<div class="task-item has-subtasks">
				<div className="task-item row expanded" key={task.taskId+task.description} value={task}>
					<div className="columns shrink">
						<div className={"mark-complete " + (task.status == "COMPLETE" && "complete")} onClick={(e) => this.handleMarkComplete(task, task.status)}>
							{task.status == "COMPLETE" &&
							<svg className="small icon"><use xlinkHref="#icon-checkmark"></use></svg>
							}
						</div>
					</div>
					<div className="columns shrink">
						{task.assignedTo ?
							<span className="member-initials circle medium">{task.assignedTo.firstName.substr(0,1)} {task.assignedTo.lastName.substr(0,1)}</span> :
							<img className="member-photo circle" src="assets/img/user2.png" alt="name of user"/>
						}
					</div>
					<div className="columns shrink align-right">
						<svg className={"icon medium taskPriorityClass " + (task.priority == 'HIGH' ? 'flag' : 'no-flag')} onClick={(e) => this.handleToggleTaskPriority(task.taskId, 1, task.priority)}><use xlinkHref="#icon-flag"></use></svg>
					</div>
					<div className="columns">
						<span className={"task-title " + (task.status == 'COMPLETE' && 'complete')}>{task.read ? task.taskId + " " + task.description : <b>{task.description}</b>}</span>
						<span className="task-patient text-em">{task.patient ? task.patient.firstName + ' ' + task.patient.lastName + ', ' + task.patient.mrn : 'none'}</span>
						<span className="task-details text-light">{task.assignedBy ? 'Assigned by ' + task.assignedBy.userName + " " + String.fromCharCode("8226") + " " + <Moment fromNow>(createdDateTime)</Moment> : 'unassigned'}</span>
						{commentNodes}
					</div>
					<div className="columns shrink align-right more-options-wrapper">
						<span className="more-task-options icon-group">
							<span onClick={(e) => this.markAsUnread(task, task.read)}><svg className="icon"><use xlinkHref={task.read ? "#icon-envelope-open" : "#icon-envelope-close"}></use></svg></span>
							<svg className="icon edit-task"><use xlinkHref="#icon-pencil"></use></svg>
							<svg className="icon edit-task"><use xlinkHref="#icon-subtask"></use></svg>
							<svg className="icon delete-task" data-open={"delete-task-" + task.taskId}><use xlinkHref="#icon-delete"></use></svg>
						</span>
						<svg className="icon medium ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
					</div>
					<div className="reveal text-center" id={"delete-task-" + task.taskId} data-reveal>
						<h5 className="margin-bottom">Are you sure you want to delete this task?</h5>
						<div className="button-wrapper">
						<a className="button medium confirm">Delete</a>
						<a className="button medium cancel">Cancel</a>
						</div>
							<button className="close-button" data-close aria-label="Close modal" type="button">
								<span aria-hidden="true">&times;</span>
							</button>
					</div>
					{subtaskNodes}
				</div>
				</div>

        );
      })}

	</span>
    );
}

  componentDidMount () {
    //alert('componentDidMount');
    enableTaskListComponents();
		// console.log("listoftasks didmount")
  }

  componentDidUpdate () {
    //alert('componentDidUpdate');
    enableTaskListComponents();
		// console.log("listoftasks didupdate")
  }

}

const mapStateToProps = function (store) {
	return {
		user: store.userState.user,
		userProfilePic:store.userState.userProfilePic
	}
}

export default connect(mapStateToProps)(TaskList)
