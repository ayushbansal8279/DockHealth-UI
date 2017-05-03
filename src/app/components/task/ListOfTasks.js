import React from 'react'
import PropTypes from 'prop-types';
import Moment from 'react-moment'
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

  	handleMarkComplete(taskId, userId, status){
  		this.props.markComplete(taskId, userId, status)
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


    render() {
		if(AWS.config.credentials){
			console.log("user name: "+AWS.config.credentials.params.IdentityId);
		}
		//userApi.isAuthenticated(this)
		
    return (
    <div>
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
			let commentNodes = "";
			if(task.comments){
				commentNodes = task.comments.map(function(comment) {
					return (
						<div className="comment" key={comment.commentId}>
							<img className="memberphoto small float-left" src="assets/img/memberphoto.png" alt="name of user"/>
							<span className="comment-text">{comment.comment} - by {comment.creator.firstName} {comment.creator.lastName}</span>
						</div>
					)
				})
			}	
			let taskPriorityClass = "icon medium-2 priority"
			if(task.priority!=null && task.priority!="LOW"){
				taskPriorityClass = taskPriorityClass + " high"
			}
        return (
		<div className="task-item tag" key={task.taskId+task.description} value={task}>
		<button onClick={(e) => this.handleMarkComplete(task.taskId, 1, task.status)} className="button primary float-right button-small">Mark{task.status == "COMPLETE" ? " Incomplete" : " Complete"}</button>
		<button onClick={(e) => this.handleToggleTaskPriority(task.taskId, 1, task.priority)} className="button primary float-right button-small">Toggle Priority</button>
		<div className="task-item-inner-wrapper" data-toggle="">
			<div className="mark-complete-wrapper">
				<button className="mark-complete">
					<div className="mark-complete-completed">
					</div>
				</button>
			</div>
			<div className="task-title-wrapper clearfix">
				<div className="task-title-left float-left">
					{task.read ? task.description : <b>{task.description}</b>}
				</div>
				<div className="task-title-right float-right">
					{/*<img className="memberphoto active" src="assets/img/memberphoto.png" alt="name of user"/>*/}
					{assignees}
					<svg onClick={(e) => this.handleToggleTaskPriority(task.taskId, 1, task.priority)} className={taskPriorityClass}><use xlinkHref="#icon-cross"></use></svg>
				</div>
			</div>
			<div className="task-details-wrapper">
				<span className="task-details-block">Created by {task.creator.firstName} {task.creator.lastName}</span>
		        <span className="task-details-block"><Moment fromNow>{createdDateTime}</Moment></span>
		        <span className="task-details-block {task.status}">{task.status}</span>
			</div>
			<div className="task-details-wrapper">
				<span className="task-details-block">Assigned to {task.assignedTo ? task.assignedTo.firstName + ' ' + task.assignedTo.lastName + ' by ' + task.assignedBy.firstName + ' ' + task.assignedBy.lastName : 'nobody yet'}</span>
			</div>

		</div>

		<div className="edit-task" id="edit-task-1" data-toggler=".expanded">
			<div className="edit-task-inner my-task-edit-section">
				<div className="row">
					<TaskListMembersContainer getSelectedMemberId={this.handleAddMemberToTask} taskId={task.taskId}/>
				</div>
				<div className="row">
					<div className="medium-12 columns">
						<label>
							<svg className="icon"><use xlinkHref="#icon-comment"></use></svg>Task Description
							<textarea placeholder="None" type='text' defaultValue={task.description} placeholder={task.description} onBlur={(e) => this.handleUpdateTaskDescription(task.taskId, 1, e.target.value)}></textarea>
						</label>
					</div>
				</div>
				<div className="row">
					<div className="medium-12 columns">
						<div className="task-comments">
							{commentNodes}
						</div>
						<label>
							<svg className="icon"><use xlinkHref="#icon-comment"></use></svg>Comment
							<textarea placeholder="None" type='text' value={this.state.comment} onBlur={(e) => this.handleTaskCommentUpdate(task.taskId, e.target.value)}></textarea>
						</label>
					</div>
				</div>
				<div className="row">
					<div className="medium-12 columns button-group">
						<button onClick={this.handleSubmit} className="button primary float-right button-small">Save</button>
						<button className="button secondary button-small float-right">Cancel</button>	
						<button onClick={(e) => this.handleDeleteTask(task.taskId, 1)}  className="button secondary float-left button-small">Delete</button>
					</div>
				</div>
				
			</div>
			</div>

		</div>
        );

      })}

	</div>
    );
}

  componentDidMount () {
    //alert('componentDidMount');
    enableTaskListComponents();
  }

  componentDidUpdate () {
    //alert('componentDidUpdate');
    enableTaskListComponents();
  }

}

export default TaskList
