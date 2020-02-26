import $ from 'jquery';
import Linkify from 'linkifyjs/react';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';

import * as TaskActions from '../../actions/task-actions';
import MemberInitials from '../members/MemberInitials';
import AssignToModal from '../modals/AssignToModal';
import BooleanModal from '../modals/BooleanModal';
import AddComment from './AddComment';

const TASKS_PER_PAGE = 50;

class ListOfTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMoreComments: [],
      viewMoreTasksIndex: TASKS_PER_PAGE,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTaskCommentUpdate = this.handleTaskCommentUpdate.bind(this);
    this.handleMarkComplete = this.handleMarkComplete.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleUpdateTaskDescription = this.handleUpdateTaskDescription.bind(
      this,
    );
    this.handleToggleTaskPriority = this.handleToggleTaskPriority.bind(this);
    this.handleAddMemberToTask = this.handleAddMemberToTask.bind(this);
    this.addPatientToTaskCallback = this.addPatientToTaskCallback.bind(this);
    this.markAsUnread = this.markAsUnread.bind(this);
    this.editTask = this.editTask.bind(this);
    this.confirmCompleteTask = this.confirmCompleteTask.bind(this);
    this.duplicateTask = this.duplicateTask.bind(this);
    this.moveSubTaskUp = this.moveSubTaskUp.bind(this);
    this.moveSubTaskDown = this.moveSubTaskDown.bind(this);
    this.showHistory = this.showHistory.bind(this);
  }

  isLoggedIn(message, isLoggedIn, cognitoUser) {
    if (!isLoggedIn) {
      // this.router.navigate(['/home/login']);
      console.log('not logged in');
    } else {
      // this.userParams.getParameters(new GetParametersCallback(this));
      console.log(`logged in: ${cognitoUser.username}`);
      this.cognitoUser = cognitoUser;
    }
  }

  componentDidMount() {
    $('body').on('dblclick', '[data-editable]', function() {
      $(this).hide();
      const $el = $(this);
      $(this)
        .next()
        .show()
        .val($el.text());
      const save = function save() {
        if ($el.next().val()) {
          $el.show().text($el.next().val());
        } else {
          $el.show();
        }
        $el.next().hide();
      };
      $el
        .next()
        .one('blur', save)
        .focus();
    });

    // edit comment
    $('body').on('dblclick', '[data-editable-comment]', function() {
      $(this).hide();
      const $el = $(this);
      $(this)
        .next()
        .show()
        .val($el.text());
      // var matches = string.match(/\bhttps?:\/\/\S+/gi);
      $(this)
        .parent()
        .next()
        .show();
      const save = function save() {
        $el.show();
        $el.next().hide();
        $el
          .parent()
          .next()
          .hide();
      };
      $el
        .parent()
        .parent()
        .find('.cancel')
        .one('click', save);
      $el
        .parent()
        .parent()
        .find('.saveComment')
        .one('click', save);
    });

    resizeEmailBodySection('.task-item-wrapper');
  }

  componentWillUnmount() {
    closeAddForm();
    if (this.props.tasks) {
      this.props.tasks.map((task, index) => {
        removeRevealComponent(`#edit-assign-to-${task.taskIdentifier}`);
        removeRevealComponent(`#delete-task-${task.taskIdentifier}`);
        removeRevealComponent(`#complete-task-${task.taskIdentifier}`);
        // removeRevealComponent("#refile-task-" + task.taskIdentifier)
        if (task.subtasks) {
          task.subtasks.map((subtask, index) => {
            removeRevealComponent(`#edit-assign-to-${subtask.taskIdentifier}`);
            removeRevealComponent(`#delete-task-${subtask.taskIdentifier}`);
            removeRevealComponent(`#complete-task-${subtask.taskIdentifier}`);
            // removeRevealComponent("#refile-task-" + subtask.taskIdentifier)
          });
        }
      });
    }
  }

  componentWillUpdate(nextProps) {
    // console.log('ListOfTasks componentWillUpdate: '+nextProps)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.taskStatusGroup != 'COMPLETE' && prevProps != this.props) {
      // debugger;
    }
    // console.log("listoftasks didupdate")
    resizeEmailBodySection('.task-item-wrapper');
    // updateCommentsDisplay(".task-item-wrapper")
  }

  // shouldComponentUpdate(nextProps, nextState) {
  // 	if(!this.props.members
  // 		|| (nextProps.members && this.props.members.length != nextProps.members.length)
  // 		|| !this.props.tasks
  // 		|| (nextProps.tasks && this.props.tasks.length != nextProps.tasks.length)){
  // 		return true
  // 	}
  // 	return false
  // }

  editTask(task) {
    console.log('edit working');
    editForm();
  }

  handleSubTaskChange(event) {
    // this.setState({comment: event.target.value, parentTaskIdentifier: event.target.parentTaskIdentifier});
  }

  handleTaskCommentUpdate(taskIdentifier, commentDescription) {
    this.setState({ taskIdentifier, comment: commentDescription });
  }

  handleUpdateTaskDescription(taskIdentifier, userIdentifier, description) {
    // this.setState({description: event.target.value})
    this.props.updateTaskDescription(taskIdentifier, userIdentifier, description);
  }

  handleSubmit() {
    if (this.state.comment != '') {
      this.props.addTaskComment(this.state.taskIdentifier, {
        comment: this.state.comment,
        creator: { userIdentifier: 1 },
      });
      this.setState({ comment: '' });
    }
  }

  handleMarkComplete(task, status) {
    if (task.subtasks.length > 0 && task.status == 'INCOMPLETE') {
      let allSubTasksComplete = true;
      task.subtasks.map(subtask => {
        if (subtask.status == 'INCOMPLETE') {
          // alert('Incomplete Subtask')
          allSubTasksComplete = false;
          $(`#open-complete-task-confirmation-${task.taskIdentifier}`).trigger('click');
        }
      });
      if (allSubTasksComplete) {
        this.props.markComplete(task, status, this.props.taskStatusGroup);
      }
    } else {
      this.props.markComplete(task, status, this.props.taskStatusGroup);
    }
    // this.setState({task: ''})
  }

  confirmCompleteTask(task) {
    this.props.markComplete(task, task.status, this.props.taskStatusGroup);
  }

  handleDeleteTask(task) {
    this.props.deleteTask(task);
  }

  handleToggleTaskPriority(task, userIdentifier, priority) {
    this.props.toggleTaskPriority(task, userIdentifier, priority);
  }

  handleAddMemberToTask(memberId, member, taskIdentifier) {
    this.props.assignOrReassignTask(taskIdentifier, '1', memberId, member);
  }

  addPatientToTaskCallback(patientIdentifier, taskIdentifier) {
    this.props.addPatientToTask(patientIdentifier, taskIdentifier);
  }

  markAsUnread(task, flagUnread) {
    this.props.markAsUnread(task, flagUnread);
  }

  showHistory(task) {
    // set current task and get audit
    this.props.taskAction.storeAsCurrentTask(task.taskIdentifier);
    // .then((resp) => {
    this.props.taskAction.getTaskHistory(task);
    // })
    closeDropdown(`#task-edit-${task.taskIdentifier}`);
  }

  deleteTask = task => {
    console.log(task.taskIdentifier);
  };

  duplicateTask = task => {
    this.props.taskAction.duplicateTask(task);
    console.log(task.taskIdentifier);
  };

  moveSubTaskUp = task => {
    this.props.taskAction.sortSubTask(task, 'up');
    console.log(task.taskIdentifier);
  };

  moveSubTaskDown = task => {
    this.props.taskAction.sortSubTask(task, 'down');
    console.log(task.taskIdentifier);
  };

  assignOrReassignTask = (task, assignedToUserIdentifier, member) => {
    this.props.taskAction.assignOrReassignTask(task, assignedToUserIdentifier, member);
  };

  handleToggleForEditTask = task => {
    // var formDisplayed = $('.add-form-wrapper').css("display");
    const formDisplayed = $('.add').hasClass('close');
    // if(formDisplayed != "none"){
    if (formDisplayed) {
      closeAddForm();
    }
    // puts task to state to populate data for form

    this.props.taskAction.taskToState(task); // ensure dispatch is not called multiple times in the same call
    this.props.setTaskEditingStatus(true);

    // open form to edit
    $('.add').toggleClass('close');
    $('body').toggleClass('disable-header-scroll');
    const href = $(this).attr('id');
    if ($(this).hasClass('add-other')) {
      $('.add-other use').attr('href', function(index, attr) {
        return attr == '#icon-add' ? `#${href}` : '#icon-add';
      });
    }
    $('.add-form-wrapper').slideToggle(300);
    //	$('.list-filter .controls, .list-wrapper').toggle();
    $('.list-filter .controls').toggle();

    // $('.add').click();
    console.log(task);
    if (task && task.description && task.description != '') {
      // scroll to top
      scrollToTop();
    }
  };

  autofillForm = task => {};

  updateDescription = (task, event) => {
    if (task.description != event.target.value) {
      this.props.updateTaskDescription(task, event.target.value);
    }
  };

  resetSubtaskForm = patient => {
    if (patient != undefined) {
      const patientName = `${patient.firstName} ${patient.lastName}`;
      this.props.formActions.change('addSubtaskForm', 'patient', patientName);
      this.props.formActions.change(
        'addSubtaskForm',
        'patientIdentifier',
        patient.patientIdentifier,
      );
    }
    // this.props.formActions.reset('addSubtaskForm')
  };

  deleteComment = (task, comment) => {
    this.props.taskAction.deleteComment(task, comment);
  };

  updateComment = (task, comment) => {
    comment.comment = $(`#comment-${comment.commentIdentifier}`).val();
    this.props.taskAction.updateComment(task, comment);
  };

  handleViewMoreComments = taskIdentifier => {
    const taskIds = this.state.viewMoreComments;
    taskIds.push(taskIdentifier);
    this.setState({ viewMoreComments: taskIds });
  };

  handleViewMoreTasks = () => {
    console.log('show more tasks');
    this.setState({
      viewMoreTasksIndex: this.state.viewMoreTasksIndex + TASKS_PER_PAGE,
    });
  };

  openAssignmentModal = taskIdentifier => {
    openPopup(`#edit-assign-to-${taskIdentifier}`);
  };

  openCompleteConfirmationModal = taskIdentifier => {
    openPopup(`#complete-task-${taskIdentifier}`);
  };

  openDeleteConfirmationModal = taskIdentifier => {
    openPopup(`#delete-task-${taskIdentifier}`);
  };

  openTaskContextMenu = taskIdentifier => {
    openDropdown(`#task-edit-${taskIdentifier}`);
  };

  renderCommentSection(task, comment, index) {
    return (
      <div
        className="row expanded collapse comment-wrapper"
        key={`comment${comment.commentIdentifier}_${index}`}
      >
        <div className="columns shrink">
          {/* <img className="memberphoto small float-left" src="assets/img/memberphoto.png" alt="name of user"/> */}
          <MemberInitials member={comment.creator} extraClass="xsmall" />
          {/* <span className="member-initials circle xsmall">{comment.creator.firstName.substr(0,1)} {comment.creator.lastName.substr(0,1)}</span> */}
        </div>

        <div className="columns">
          <div className="row align-justify collapse">
            <div className="column">
              <div className="row expanded">
                {comment.creator.userIdentifier === this.props.userProfile.userIdentifier ? (
                  <span
                    className="comment comment-details"
                    data-editable-comment
                  >
                    <pre>
                      <Linkify
                        options={{
                          target: '_blank',
                          className: 'decorated-link',
                        }}
                      >
                        {comment.comment}
                      </Linkify>
                    </pre>
                  </span>
                ) : (
                  <span className="comment comment-details">
                    <pre>
                      <Linkify
                        options={{
                          target: '_blank',
                          className: 'decorated-link',
                        }}
                      >
                        {comment.comment}
                      </Linkify>
                    </pre>
                  </span>
                )}
                <textarea
                  rows="5"
                  className="comment add-comment"
                  id={`comment-${comment.commentIdentifier}`}
                  type="text"
                />
              </div>
              <span className="comment-edit row collapse expanded align-justify">
                <div className="column comment-edit-left">
                  <svg
                    onClick={() => this.deleteComment(task, comment)}
                    className="icon medium"
                  >
                    <use xlinkHref="#icon-delete" />
                  </svg>
                </div>
                <div className="column comment-edit-right">
                  <span className="cancel pointer">Cancel</span>
                  <div
                    onClick={e => this.updateComment(task, comment)}
                    className="button x-small secondary saveComment"
                  >
                    Save
                  </div>
                </div>
              </span>
            </div>
            <div className="column shrink">
              <span className="time comment-time">
                <Moment fromNow>{comment.dateCreated}</Moment>
              </span>
            </div>
          </div>
        </div>

        {/* <div className="row expanded collapse comment-wrapper">
					<div className="columns shrink text-light">
						Load 2 earlier comments
					</div>
				</div> */}
      </div>
    );
  }

  render() {
    if (AWS.config.credentials) {
      // console.log("user name: "+AWS.config.credentials.params.IdentityId);
    }
    const members = this.props.members;

    return (
      <span>
        {this.props.taskStatusGroup != 'COMPLETE' &&
          this.props.listName == 'Inbox' &&
          this.props.tasks &&
          this.props.tasks.length == 0 && (
            <div className="inbox-message">
              <span>Your inbox is empty.</span>
              <br />
              <br />
              <span>
                Inbox is a place you can forward emails that you want to keep
                track of or turn into a task here on Dock.
              </span>
              <br />
              <br />
              <span>
                From your WORK email inbox forward an email to:{' '}
                <a href="mailto:task@dockhealth.email">
                  task@dockhealth.email
                </a>
              </span>
              <br />
              <br />
              <span>We'll drop it into your inbox here on Dock.</span>
              <br />
            </div>
          )}
        {this.props.tasks &&
          this.props.tasks.map((task, index) => {
            const listTasks = () => {
              {
                /* sets listTasks as const and returns below for legibility */
              }
              return (
                <div
                  key={`task${task.taskIdentifier}`}
                  id={`task${task.taskIdentifier}`}
                  className={`task-item has-subtasks ${task.refiled &&
                    'refiled'}`}
                >
                  {generateTask(task, index, 'maintask')}
                </div>
              );
            };

            {
              /* COMPONENTS START */
            }
            // let dueDateComponent = ""
            // if(task.dueDate){
            // 	let dueDate = new Date(task.dueDate)
            // 	dueDateComponent = <Moment format="MMM DD">{dueDate}</Moment>
            // }
            const createdDateTime = new Date(task.createdDateTime);
            // let assignmentUpdatedDateTime = new Date(task.assignmentUpdatedDateTime)

            {
              /* COMPONENTS END */
            }

            {
              /* GENERATE TASK START */
            }
            const generateTask = (task, index, type) => (
              <span key={`task${task.taskIdentifier}`}>
                {/* MAIN TASK START */}
                <div
                  className={`row expanded ${
                    type == 'subtask' ? 'subtask-item' : 'main-task-item'
                  }`}
                  value={task}
                >
                  <div className="columns shrink">
                    <div
                      className={`pointer mark-complete ${task.status ==
                        'COMPLETE' && 'complete'}`}
                      onClick={e => this.handleMarkComplete(task, task.status)}
                    >
                      {task.status == 'COMPLETE' && (
                        <svg className="small icon">
                          <use xlinkHref="#icon-checkmark" />
                        </svg>
                      )}
                    </div>
                    {/* Triggers confirmation modal to pop up if task has subtasks */}
                    {/* <span id="complete-task" data-open={"complete-task-"+task.taskIdentifier} className="hide">Complete</span> */}
                    <span
                      id={`open-complete-task-confirmation-${task.taskIdentifier}`}
                      onClick={e =>
                        this.openCompleteConfirmationModal(task.taskIdentifier)
                      }
                      className="hide"
                    >
                      Complete
                    </span>
                  </div>
                  {type == 'subtask' && (
                    <div className="columns shrink">
                      <span className="subtask-number">{`${index + 1}.`}</span>
                    </div>
                  )}
                  {/* <div className="columns shrink" data-open={"edit-assign-to-"+task.taskIdentifier}> */}
                  {task.status == 'INCOMPLETE' ? (
                    <div
                      className="columns shrink"
                      onClick={e => this.openAssignmentModal(task.taskIdentifier)}
                    >
                      {task.assignedTo ? (
                        <MemberInitials member={task.assignedTo} />
                      ) : (
                        <span className="medium member-photo member-unassigned circle">
                          ?
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="columns shrink">
                      {task.assignedTo ? (
                        <MemberInitials member={task.assignedTo} />
                      ) : (
                        <span className="medium member-photo member-unassigned circle">
                          ?
                        </span>
                      )}
                    </div>
                  )}

                  <div className="columns shrink align-right">
                    <span
                      title={
                        task.priority == 'HIGH' ? 'High Priority' : 'Priority'
                      }
                    >
                      <svg
                        className={`pointer icon medium taskPriorityClass ${
                          task.priority == 'HIGH' ? 'flag' : 'no-flag'
                        }`}
                        onClick={e =>
                          this.handleToggleTaskPriority(task, 1, task.priority)
                        }
                      >
                        <use xlinkHref="#icon-flag" />
                      </svg>
                    </span>
                  </div>
                  <div className="columns">
                    {/* {type == 'subtask' && <span className="subtask-number">1.</span>} */}
                    <span
                      data-editable
                      className={`task-title ${task.status == 'COMPLETE' &&
                        'complete'}`}
                    >
                      {task.read ? task.description : <b>{task.description}</b>}
                    </span>
                    <input
                      onBlur={e => this.updateDescription(task, e)}
                      className="task-title"
                      type="text"
                    />
                    {/* <span onClick={(e) => this.handleToggleForEditTask(task)} className="edit-task-popup" data-open="add-form-popup"> */}
                    <span
                      onClick={e => this.handleToggleForEditTask(task)}
                      className="edit-task"
                    >
                      {type != 'subtask' && (
                        <span className="task-patient text-em">
                          {task.patient ? (
                            <Link to={`/patient/${task.patient.patientIdentifier}`}>
                              {`${task.patient.firstName} ${
                                task.patient.lastName
                              }
                              }, ${task.patient.mrn}`}
                            </Link>
                          ) : (
                            String.fromCharCode('8212')
                          )}
                        </span>
                      )}
                      <span className="subtask-count text-light">
                        {task.subtasks && `${task.subtasks.length} subtasks`}{' '}
                        {task.patient
                          ? ` | ${task.patient.firstName} ${
                              task.patient.lastName
                            }, ${task.patient.mrn}`
                          : ''}{' '}
                        {task.dueDate && (
                          <span
                            className={
                              new Date(task.dueDate) < new Date()
                                ? 'overdue'
                                : ''
                            }
                          >
                            {' '}
                            |{' '}
                            <svg className="icon small">
                              <use xlinkHref="#icon-calendar" />
                            </svg>
                            &nbsp;
                            {formatDateAndTime(task.dueDate)}
                          </span>
                        )}{' '}
                      </span>

                      {task.assignedBy && (
                        <span className="task-details text-light">
                          {`Assigned by ${
                            task.assignedBy.userName
                          } ${String.fromCharCode('8226')} `}
                          {
                            <Moment fromNow>
                              {moment(task.assignmentUpdatedDateTime).format()}
                            </Moment>
                          }
                        </span>
                      )}
                      {task.dueDate && (
                        <div
                          className={`center-content-vertical task-details ${
                            new Date(task.dueDate) < new Date() ? 'overdue' : ''
                          }`}
                        >
                          <svg className="icon small">
                            <use xlinkHref="#icon-calendar" />
                          </svg>
                          <span className="">
                            {formatDateAndTime(task.dueDate)}
                          </span>
                        </div>
                      )}
                      {task.status == 'COMPLETE' && task.completedBy && (
                        <span className="task-details text-light">
                          {`Completed by ${task.completedBy.userName}`}
                        </span>
                      )}
                      {/* <span className="task-details text-light">{task.assignedBy ? 'Assigned by ' + task.assignedBy.userName + " " + String.fromCharCode("8226") + " " + <Moment fromNow>{createdDateTime}</Moment> : 'unassigned'}</span> */}
                    </span>
                    <div className="comments-container">
                      {task.status == 'INCOMPLETE' && (
                        <AddComment
                          task={task}
                          userProfile={this.props.userProfile}
                        />
                      )}
                      {/* {commentNodes} */}
                      {task.comments ? (
                        task.comments.map((comment, index) => {
                          if (
                            this.state.viewMoreComments.indexOf(task.taskIdentifier) ==
                            -1
                          ) {
                            if (index == 3) {
                              return (
                                <div
                                  className="more-comments"
                                  key={`comment_more_${
                                    comment.commentIdentifier
                                  }_${index}`}
                                >
                                  <a
                                    onClick={e =>
                                      this.handleViewMoreComments(task.taskIdentifier)
                                    }
                                  >
                                    View More Comments
                                  </a>
                                </div>
                              );
                            }
                            if (index > 3) {
                              return (
                                <span
                                  key={`comment_more_${
                                    comment.commentIdentifier
                                  }_${index}`}
                                />
                              );
                            }
                          }
                          return this.renderCommentSection(
                            task,
                            comment,
                            index,
                          );
                        })
                      ) : (
                        <div className="row expanded collapse comment-wrapper">
                          <div className="columns shrink">
                            {/* <img className="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"/> */}
                            {/* <img className="member-photo circle xsmall" src={userProfilePic} alt={user.firstName + user.lastName}/> */}
                          </div>
                        </div>
                      )}
                    </div>
                    {task.type == 'EMAIL' && (
                      <div className="row collapse email-wrapper">
                        <div className="columns shrink">
                          <svg className="icon">
                            <use xlinkHref="#icon-email" />
                          </svg>
                        </div>
                        <div className="columns">
                          <div className="email-container">
                            <pre className="emailMessage">
                              <Linkify
                                options={{
                                  target: '_blank',
                                  className: 'decorated-link',
                                }}
                              >
                                {task.sourceMessage}
                              </Linkify>
                            </pre>
                            <span className="expand-content circle xsmall emailExpandButton">
                              <svg className="icon">
                                <use xlinkHref="#icon-slim" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="columns shrink more-options-wrapper">
                    {/* <svg className="icon ellipses medium" data-toggle={"task-edit-" + task.taskIdentifier}><use xlinkHref="#icon-ellipses"></use></svg> */}
                    <svg
                      className="icon ellipses medium"
                      data-toggle={`task-edit-${task.taskIdentifier}`}
                      onClick={e => this.openTaskContextMenu(task.taskIdentifier)}
                    >
                      <use xlinkHref="#icon-ellipses" />
                    </svg>
                    <div
                      className="small dropdown-pane"
                      id={`task-edit-${task.taskIdentifier}`}
                      data-dropdown
                      data-close-on-click="true"
                    >
                      <ul className="no-bullet">
                        {task.status == 'INCOMPLETE' && (
                          <li onClick={e => this.markAsUnread(task, task.read)}>
                            {task.read ? 'Mark as unread' : 'Mark as read'}
                          </li>
                        )}
                        {/* <li onClick={(e) => this.handleToggleForEditTask(task)} className="edit-task-popup" data-open="add-form-popup">Edit task</li> */}
                        {task.status == 'INCOMPLETE' && (
                          <li
                            onClick={e => this.handleToggleForEditTask(task)}
                            className="edit-task"
                          >
                            Edit task
                          </li>
                        )}
                        {task.status == 'INCOMPLETE' && type != 'subtask' && (
                          <li
                            onClick={e => {
                              this.handleToggleForEditTask(task);
                              this.resetSubtaskForm(task.patient);
                            }}
                            className="add show-add-subtask link"
                          >
                            Add subtask
                          </li>
                        )}
                        {/* <li data-open={"delete-task-"+task.taskIdentifier}>Delete task</li> */}
                        {task.status == 'INCOMPLETE' &&
                          task.creator.userIdentifier ==
                            this.props.userProfile.userIdentifier && (
                            <li
                              onClick={e =>
                                this.openDeleteConfirmationModal(task.taskIdentifier)
                              }
                            >
                              Delete task
                            </li>
                          )}
                        {task.status == 'INCOMPLETE' && type != 'subtask' && (
                          <li onClick={() => this.duplicateTask(task)}>
                            Duplicate task
                          </li>
                        )}
                        {type == 'subtask' && index > 0 && (
                          <li onClick={() => this.moveSubTaskUp(task)}>
                            Move Up
                          </li>
                        )}
                        {type == 'subtask' &&
                          index < this.props.tasks.length && (
                            <li onClick={() => this.moveSubTaskDown(task)}>
                              Move Down
                            </li>
                          )}
                        {(this.props.listName == 'Inbox' ||
                          this.props.members) && (
                          <li onClick={e => this.showHistory(task)}>
                            Show History
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* MAIN TASK END */}
                {task.subtasks &&
                  task.subtasks.map((subtask, index) => {
                    return (
                      <span key={`subtask${subtask.taskIdentifier}`}>
                        {generateTask(subtask, index, 'subtask')}
                        <BooleanModal
                          message="Are you sure you want to delete this task?"
                          confirmBtnTxt="Delete"
                          uniqueModalId={`delete-task-${subtask.taskIdentifier}`}
                          handleConfirmationArgs={subtask}
                          handleConfirmation={this.handleDeleteTask}
                        />
                        {subtask.taskList && (
                          <div>
                            <AssignToModal
                              members={members}
                              taskListIdentifier={subtask.taskList.taskListIdentifier}
                              task={subtask}
                              assignOrReassignTask={this.assignOrReassignTask}
                            />
                          </div>
                        )}
                      </span>
                    );
                  })}
              </span>
            );
            {
              /* GENERATE TASK END */
            }

            if (index >= this.state.viewMoreTasksIndex) {
              if (index == this.state.viewMoreTasksIndex) {
                return (
                  <div
                    key={`listTask${task.taskIdentifier}_${index}`}
                    className="more-tasks"
                  >
                    <a onClick={e => this.handleViewMoreTasks()}>
                      View More Tasks
                    </a>
                  </div>
                );
              }
              if (index >= this.state.viewMoreTasksIndex) {
                return '';
              }
            }
            return (
              <span
                key={`listTask${task.taskIdentifier}_${index}`}
                id={`listTask${task.taskIdentifier}`}
              >
                {listTasks()}
                <div className="task-popups">
                  <BooleanModal
                    message="Are you sure you want to delete this task?"
                    confirmBtnTxt="Delete"
                    uniqueModalId={`delete-task-${task.taskIdentifier}`}
                    handleConfirmationArgs={task}
                    handleConfirmation={this.handleDeleteTask}
                  />
                  <BooleanModal
                    message="You are about to complete a task with open subtasks. Completing the task will also complete the subtasks. Would you like to proceed?"
                    confirmBtnTxt="Yes"
                    uniqueModalId={`complete-task-${task.taskIdentifier}`}
                    handleConfirmationArgs={task}
                    handleConfirmation={this.confirmCompleteTask}
                  />
                  {task.status == 'INCOMPLETE' && task.taskList && (
                    <div>
                      <AssignToModal
                        members={members}
                        taskListIdentifier={task.taskList.taskListIdentifier}
                        task={task}
                        assignOrReassignTask={this.assignOrReassignTask}
                      />
                    </div>
                  )}
                </div>
              </span>
            );
          })}
      </span>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    user: store.userState.user,
    userProfilePic: store.userState.userProfilePic,
    userProfile: store.userState.userProfile,
    task: store.taskState.task,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    taskAction: bindActionCreators(TaskActions, dispatch),
    formActions: bindActionCreators({ change }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListOfTasks);
