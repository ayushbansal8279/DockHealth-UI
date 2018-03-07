import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Moment from 'react-moment'
import BaseComponent from '../BaseComponent'
import PatientDropdownListContainer from '../patient/PatientDropdownListContainer'
import AddComment from './AddComment'
import * as TaskActions from '../../actions/task-actions'
import * as userApi from '../../api/user-api'
import { findDOMNode } from 'react-dom'
import $ from 'jquery'
import AssignToModal from '../common/AssignToModal'
import ConfirmDelete from '../common/ConfirmDelete'
import BooleanModal from '../common/BooleanModal'
import MemberInitials from '../common/MemberInitials'
import {change} from 'redux-form'

class ListOfTasks extends BaseComponent {
		constructor(props) {
	  	super(props)
	  	this.state = {
	    		value: '',
	    		status: props.initialStatus,
					currentComment: {}
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
			this.editTask = this.editTask.bind(this)
			this.confirmCompleteTask = this.confirmCompleteTask.bind(this)
			this.duplicateTask = this.duplicateTask.bind(this)
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

		componentDidMount () {
			super.componentDidMount()
			// console.log("listoftasks didmount")
			// edit data
			console.log("ListOfTasks.js")

			$('body').on('click', '[data-editable]', function () {
				$(this).hide();
				var $el = $(this);
				$(this).next().show().val($el.text());
				var save = function save() {
					if ($el.next().val()) {
						$el.show().text($el.next().val());
					} else {
						$el.show();
					}
					$el.next().hide();
				};
				$el.next().one('blur', save).focus();
			});

			// edit comment
			$('body').on('click', '[data-editable-comment]', function () {
				$(this).hide();
				var $el = $(this);
				$(this).next().show().val($el.text());
				$(this).parent().next().show();
				var save = function save() {
					$el.show();
					$el.next().hide();
					$el.parent().next().hide();
				};
				$el.parent().parent().find('.cancel').one('click', save);
				$el.parent().parent().find('.saveComment').one('click', save);
			});

		}

		componentWillUnmount(){
			closeAddForm()
		}

		componentDidUpdate (prevProps, prevState) {
			if(prevProps.listName != "COMPLETE" && prevProps != this.props){
				// debugger;
			}
			super.componentDidUpdate()
			// console.log("listoftasks didupdate")
		}

		editTask(task){
			console.log("edit working")
			editForm()
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
			if(task.subtasks.length > 0 && task.status == 'INCOMPLETE'){
				task.subtasks.map(subtask => {
					if(subtask.status == 'INCOMPLETE'){
						// alert('Incomplete Subtask')
						$("#complete-task").trigger('click');
					}
				})
			}else{
				this.props.taskAction.taskToState(task)
				this.props.markComplete(task, status, this.props.listName)
			}
  		// this.setState({task: ''})
  	}

		confirmCompleteTask(task){
			var boo = this.props
			this.props.taskAction.taskToState(task)
			this.props.markComplete(task, task.status, this.props.listName)
		}

  	handleDeleteTask(task){
  		this.props.deleteTask(task)
  	}

  	handleToggleTaskPriority(task, userId, priority){
  		this.props.toggleTaskPriority(task, userId, priority)
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

		deleteTask = (task) => {
			console.log(task.taskId)
		}

		duplicateTask = (task) => {
			this.props.taskAction.duplicateTask(task);
			console.log(task.taskId)
		}

		assignOrReassignTask = (task, assignedToUserId, member) => {
			this.props.taskAction.assignOrReassignTask(task, assignedToUserId, member)
		}

		handleToggle = (task) => {
			// puts task to state to populate data for form
			this.props.taskAction.taskToState(task)
			this.props.setTaskEditingStatus(true)
			// $('.add').click();
			console.log(task)
		};

		autofillForm = (task) => {

		}

		updateDescription = (task, event) => {
			if(task.description != event.target.value){
				this.props.updateTaskDescription(task, event.target.value)
			}
		}

		resetSubtaskForm = (patient) => {
			if(patient != undefined){
				var patientName = patient.firstName + " " + patient.lastName
				this.props.formActions.change("addSubtaskForm", "patient", patientName)
				this.props.formActions.change("addSubtaskForm", "patientId", patient.patientId)
			}
			// this.props.formActions.reset('addSubtaskForm')
		}

		deleteComment = (task, comment) => {
			this.props.taskAction.deleteComment(task, comment);
		}

		updateComment = (task, comment) => {
			comment.comment = $('#comment-'+comment.commentId).val();
			this.props.taskAction.updateComment(task, comment);
		}


    render() {
			if(AWS.config.credentials){
				console.log("user name: "+AWS.config.credentials.params.IdentityId);
			}
			const members = this.props.members
		//userApi.isAuthenticated(this)

    return (
		<span>
		{this.props.tasks && this.props.tasks.map((task, index) => {
			const listTasks = () => { 			{/*sets listTasks as const and returns below for legibility*/}
				return(
					<div key={"task"+task.taskId} id={'task'+task.taskId} className={"task-item has-subtasks " + (task.refiled && 'refiled')}>
						{generateTask(task, index, "maintask")}
					</div>
				)
			}

			{/* COMPONENTS START */}
			// let dueDateComponent = ""
			// if(task.dueDate){
			// 	let dueDate = new Date(task.dueDate)
			// 	dueDateComponent = <Moment format="MMM DD">{dueDate}</Moment>
			// }
			let createdDateTime = new Date(task.createdDateTime)
			// let assignmentUpdatedDateTime = new Date(task.assignmentUpdatedDateTime)

			{/* COMPONENTS END */}

			{/* GENERATE TASK START */}
			const generateTask = (task, index, type) => (
			  <span key={"task"+task.taskId}>
			    {/* MAIN TASK START */}
			    <div className={"row expanded " + (type == 'subtask' ? 'subtask-item' : 'main-task-item')} value={task}>
			      <div className="columns shrink">
			        <div className={"pointer mark-complete " + (task.status == "COMPLETE" && "complete")} onClick={(e) => this.handleMarkComplete(task, task.status)}>
			          {task.status == "COMPLETE" &&
			          <svg className="small icon"><use xlinkHref="#icon-checkmark"></use></svg>
			          }
			        </div>
							{/* Triggers confirmation modal to pop up if task has subtasks */}
							<span id="complete-task" data-open={"complete-task-"+task.taskId} className="hide">Complete</span>
			      </div>
						{type == 'subtask' &&
							<div className="columns shrink">
								<span className="subtask-number">{index + 1 + '.'}</span>
							</div>
						}
			      <div className="columns shrink" data-open={"edit-assign-to-"+task.taskId}>
							{task.assignedTo ?
			         	<MemberInitials member={task.assignedTo}/> :
								<span className="medium member-photo member-unassigned circle">?</span>
							}
			      </div>

			      <div className="columns shrink align-right">
							<span data-tooltip title={task.priority == 'HIGH' ? 'High Priority' : 'Priority'} >
				        <svg className={"pointer icon medium taskPriorityClass " + (task.priority == 'HIGH' ? 'flag' : 'no-flag')} onClick={(e) => this.handleToggleTaskPriority(task, 1, task.priority)}><use xlinkHref="#icon-flag"></use></svg>
							</span>
			      </div>
			      <div className="columns">
							{/* {type == 'subtask' && <span className="subtask-number">1.</span>} */}
			        <span data-editable className={"task-title " + (task.status == 'COMPLETE' && 'complete')}>{task.read ? task.description : <b>{task.description}</b>}</span>
							<input onBlur={(e) => this.updateDescription(task, e)} className="task-title" type="text"/>
							<span onClick={(e) => this.handleToggle(task)} className="edit-task">
				        <span className="task-patient text-em">{task.patient ? task.patient.firstName + ' ' + task.patient.lastName + ', ' + task.patient.mrn : String.fromCharCode("8212")}</span>
								<span className="subtask-count text-light">{task.subtasks && task.subtasks.length + " subtasks"} {task.patient ? ' | ' + task.patient.firstName + ' ' + task.patient.lastName + ', ' + task.patient.mrn : ""}</span>
								{task.assignedBy &&
					        <span className="task-details text-light">{'Assigned by ' + task.assignedBy.userName + ' ' + String.fromCharCode("8226") + ' '  }{<Moment fromNow>{moment(task.assignmentUpdatedDateTime).format()}</Moment>}</span>
								}
								{task.dueDate &&
									<div className={"center-content-vertical task-details " + ((new Date(task.dueDate) < new Date()) ? "overdue" : "")}>
										<svg className="icon small"><use xlinkHref="#icon-calendar"></use></svg><span className="">{formatDateAndTime(task.dueDate)}</span>
									</div>
								}
								{task.status == 'COMPLETE' && task.completedBy &&
									<span className="task-details text-light">{"Completed by " + task.completedBy.userName}</span>
								}
				        {/* <span className="task-details text-light">{task.assignedBy ? 'Assigned by ' + task.assignedBy.userName + " " + String.fromCharCode("8226") + " " + <Moment fromNow>{createdDateTime}</Moment> : 'unassigned'}</span> */}
							</span>
							<div className="comments-container">
								<AddComment task={task} userProfile={this.props.userProfile}/>
								{/* {commentNodes} */}
								{task.comments ?
									task.comments.map(comment => {
										return(
											<div className="row expanded collapse comment-wrapper" key={"comment"+comment.commentId}>
						            <div className="columns shrink">
						              {/*<img className="memberphoto small float-left" src="assets/img/memberphoto.png" alt="name of user"/>*/}
													<MemberInitials member={comment.creator} extraClass="xsmall"/>
						              {/* <span className="member-initials circle xsmall">{comment.creator.firstName.substr(0,1)} {comment.creator.lastName.substr(0,1)}</span> */}
						            </div>

												<div className="columns">
													<div className="row align-justify collapse">
														<div className="column">
															<div className="row expanded">
																{comment.creator.userId === this.props.userProfile.userId ?
																	<span className="comment" data-editable-comment>{comment.comment}</span> :
																	<span className="comment">{comment.comment}</span>
																}
																<input className="comment" id={'comment-'+comment.commentId} type="text"/>
															</div>
															<span className="comment-edit row collapse expanded align-justify">
																<div className="column comment-edit-left">
																	<svg onClick={() => this.deleteComment(task, comment)} className="icon medium"><use xlinkHref="#icon-delete"></use></svg>
																</div>
																<div className="column comment-edit-right">
																	<span className="cancel pointer">
																		Cancel
																	</span>
																	<div onClick={(e) => this.updateComment(task, comment)} className="button x-small secondary saveComment">
																		Save
																	</div>
																</div>
															</span>
														</div>
														<div className="column shrink">
															<span className="time comment-time"><Moment fromNow>{comment.dateCreated}</Moment></span>
														</div>
													</div>
												</div>



						          {/*<div className="row expanded collapse comment-wrapper">
						            <div className="columns shrink text-light">
						              Load 2 earlier comments
						            </div>
						          </div>*/}
											</div>
										)
									}) :
									<div className="row expanded collapse comment-wrapper">
										<div className="columns shrink">
											{/*<img className="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"/>*/}
											{/*<img className="member-photo circle xsmall" src={userProfilePic} alt={user.firstName + user.lastName}/>*/}
										</div>
									</div>
								}

							</div>
			        {task.type == "EMAIL" &&
							<div className="row collapse email-wrapper">
								<div className="columns shrink">
									<svg className="icon"><use xlinkHref="#icon-email"></use></svg>
								</div>
								<div className="columns">
									<div className="email-container">
										<pre className="emailMessage">{task.sourceMessage}</pre>
										<span className="expand-content circle xsmall emailExpandButton"><svg className="icon"><use xlinkHref="#icon-slim"></use></svg></span>
									</div>
								</div>
							</div>
							}
			      </div>

							<div className="columns shrink more-options-wrapper">
								<svg className="icon ellipses medium" data-toggle={"task-edit-" + task.taskId}><use xlinkHref="#icon-ellipses"></use></svg>
								<div className="small dropdown-pane" id={"task-edit-" + task.taskId} data-dropdown data-close-on-click="true">
									<ul className="no-bullet">
										<li onClick={(e) => this.markAsUnread(task, task.read)}>{task.read ? "Mark as unread" : "Mark as read"}</li>
										<li onClick={(e) => this.handleToggle(task)} className="edit-task">Edit task</li>
										{type != "subtask" &&
											<li onClick={(e) => {this.handleToggle(task); this.resetSubtaskForm(task.patient);}} className="add show-add-subtask link">Add subtask</li>
										}
										{task.creator.userId == this.props.userProfile.userId &&
											<li data-open={"delete-task-"+task.taskId}>Delete task</li>
										}
										{type != "subtask" &&
											<li onClick={() => this.duplicateTask(task)}>Duplicate task</li>
										}
									</ul>
								</div>
							</div>

			    </div>
			    {/* MAIN TASK END */}
			    {task.subtasks &&
			      task.subtasks.map((subtask, index) => {
			        return (
			          <span key={"subtask"+subtask.taskId}>
			          {generateTask(subtask, index, "subtask")}
								<BooleanModal message="Are you sure you want to delete this task?" confirmBtnTxt="Delete" uniqueModalId={"delete-task-"+subtask.taskId} handleConfirmationArgs={subtask} handleConfirmation={this.handleDeleteTask}/>
								{subtask.taskList &&
									<AssignToModal members={members} taskListId={subtask.taskList.taskListId} task={subtask} assignOrReassignTask={this.assignOrReassignTask}/>
								}
			          </span>
			        )
			      })
			    }

			  </span>
			);
			{/* GENERATE TASK END */}



			return(
				<span key={"listTask"+task.taskId}>
					{listTasks()}
					<BooleanModal
						message="Are you sure you want to delete this task?"
						confirmBtnTxt="Delete"
						uniqueModalId={"delete-task-"+task.taskId}
						handleConfirmationArgs={task}
						handleConfirmation={this.handleDeleteTask}
					/>
					<BooleanModal message="You are about to complete a task with open subtasks. Completing the task will also complete the subtasks. Would you like to proceed?" confirmBtnTxt="Yes" uniqueModalId={"complete-task-"+task.taskId} handleConfirmationArgs={task} handleConfirmation={this.confirmCompleteTask}/>
					{task.taskList &&
						<AssignToModal members={members} taskListId={task.taskList.taskListId} task={task} assignOrReassignTask={this.assignOrReassignTask}/>
					}
				</span>
			)

    })}


		</span>
    );
}





}

const mapStateToProps = function (store) {
	return {
		user: store.userState.user,
		userProfilePic:store.userState.userProfilePic,
		userProfile: store.userState.userProfile,
		task: store.taskState.task
	}
}

const mapDispatchToProps = function (dispatch) {
  return {
	  taskAction: bindActionCreators(TaskActions, dispatch),
		formActions: bindActionCreators({change}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListOfTasks)
