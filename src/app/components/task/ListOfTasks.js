import React from 'react'
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import * as userApi from '../../api/user-api'
import * as TaskApi from '../../api/task-api'

class TaskList extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
      		value: ''
    	};
    	this.handleSubmit = this.handleSubmit.bind(this)
		this.handleTaskCommentChange = this.handleTaskCommentChange.bind(this)
		this.markComplete = this.markComplete.bind(this)
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

  	handleTaskCommentChange(event) {
    	this.setState({comment: event.target.value});
  	}

  	handleSubmit () {
		TaskApi.addComment({description: this.state.comment, createdByUserId: 1})
		this.setState({comment: ''})
  	}

  	markComplete(taskId, userId){
  		alert("clicked");
  		TaskApi.markComplete(taskId, userId)
  	}

    render() {
		if(AWS.config.credentials){
			console.log("user name: "+AWS.config.credentials.params.IdentityId);
		}
		userApi.isAuthenticated(this)
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
		<div className="task-item tag" key={task.taskId+task.description}>
		<div className="task-item-inner-wrapper" data-toggle="">
			<div className="mark-complete-wrapper">
				<div onClick={() => this.markComplete(task.taskId, 1)} className="mark-complete">
					<div className="mark-complete-completed">
					</div>
				</div>
			</div>
			<div className="task-title-wrapper clearfix">
				<div className="task-title-left float-left">
					{task.description} 
				</div>
				<div className="task-title-right float-right">
					{/*<img className="memberphoto active" src="assets/img/memberphoto.png" alt="name of user"/>*/}
					{assignees}
					<svg className={taskPriorityClass}><use xlinkHref="#icon-cross"></use></svg>
				</div>
			</div>
			<div className="task-details-wrapper">
				<span className="task-details-block">Assigned by {task.creator.firstName} {task.creator.lastName}</span>
		        <span className="task-details-block"><Moment fromNow>{createdDateTime}</Moment></span>
		        <span className="task-details-block {task.status}">{task.status}</span>
		        <span className="calendar">
		            <span className="task-details-block"><svg className="icon"><use xlinkHref="#icon-calendar"></use></svg> {dueDateComponent} </span>
		            <span className="task-details-block"><svg className="icon"><use xlinkHref="#icon-bell"></use></svg> {reminderDateComponent} </span>
		        </span>
			</div>
			</div>

			<div className="edit-task" id="edit-task-1" data-toggler=".expanded">
			<div className="edit-task-inner my-task-edit-section">
				<div className="row">
					<div className="medium-12 columns">
						<div className="task-comments">
							{commentNodes}
						</div>
						<label>
							<svg className="icon"><use xlinkHref="#icon-comment"></use></svg>Comment
							<textarea placeholder="None" value={this.state.comment} onChange={this.handleTaskCommentChange}></textarea>
						</label>
					</div>
				</div>
				<div className="row show">
					<div className="medium-6 columns">
						<label>Due date
							<input type="date" placeholder="Feb 6"/>
						</label>
					</div>
					<div className="medium-6 columns">
						<label>Reminder
							<input type="date" placeholder="Feb 5"/>
						</label>
					</div>
				</div>  
				<div className="row">
					<div className="medium-12 columns button-group">
						<button onClick={this.handleSubmit} className="button primary float-right button-small">Save</button>
						<button className="button secondary button-small float-right">Cancel</button>	
						<button onClick={this.props.deleteTask.bind(null, task.taskId)} className="button secondary float-left button-small">Delete</button>
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
