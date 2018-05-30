import React from 'react'
import AddTask from '../task/AddTask'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as PatientActions from '../../actions/patient-actions'
import ListMembers from '../common/ListMembers'
import MemberInitials from '../common/MemberInitials'
import {ReactDOM, findDOMNode} from 'react-dom'
import $ from 'jquery'
import BaseComponent from '../BaseComponent'

class HeaderTasks extends BaseComponent {
  constructor(props){
    super(props)
    this.state = {
      value: '',
      hideForm: true,
      title: ''
    }
  }

  componentDidMount () {
    this.props.patientActions.getAllPatients()
    this.props.taskActions.loading()
    if(this.props.taskListId){
      this.props.taskListActions.getTaskListById(this.props.taskListId)
      this.props.taskListActions.getMembersByTaskListId(this.props.taskListId, 'ALL')
      this.props.taskListActions.getActiveMembersByTaskListId(this.props.taskListId)
      this.props.taskListActions.storeAsCurrentList(this.props.taskListId)
    }
  }

  componentWillUpdate(nextProps){
    if(this.props.taskLists 
      && this.props.taskLists.length > 0 
      && nextProps.taskListId 
      && this.props.currentList
      && nextProps.taskListId != this.props.currentList.taskListId){
      this.props.taskListActions.getActiveMembersByTaskListId(this.props.taskListId)
      this.props.taskListActions.storeAsCurrentList(nextProps.taskListId)
      this.setState({title:nextProps.currentList.listName})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
    if(this.props.members){
      this.props.members.map((member, index) => {
        removeRevealComponent("#member-profile-" + member.userId)
      })
    }
    enableFoundationComponent("#taskListHeader")
    enableFoundationComponent(".member-photo-list")
    console.log("HeaderTasks didupdate")
  }

  componentWillReceiveProps(nextProps){
    if(this.props.taskLists && this.props.taskLists.length > 0
        && this.props.currentList
        && nextProps.taskListId != this.props.currentList.taskListId){
      this.props.taskListActions.storeAsCurrentList(nextProps.taskListId)
      this.setState({title:nextProps.currentList.listName})
    }
  }

  componentWillUnmount(){
    closeAddForm()
    removeRevealComponent("#list-members-"+this.props.taskListId)
    if(this.props.members){
      this.props.members.map((member, index) => {
        removeRevealComponent("#member-profile-" + member.userId)
      })
    }
  }

	handleAddTask = () => {
    this.props.taskActions.taskToState(null)

    openAddForm();
	};

  getListTasks = (sortBy) => {
    this.props.taskActions.loading()
    if(this.props.taskListId){
      this.props.taskActions.getListTasks(this.props.taskListId, sortBy, "INCOMPLETE")
      this.props.taskActions.getListTasks(this.props.taskListId, sortBy, "COMPLETE")
      // this.props.taskActions.getListTasks(this.props.taskListId, sortBy)
    }else if(this.props.title == "Inbox") {
      this.props.taskActions.getInboxTasks("COMPLETE", sortBy)
      this.props.taskActions.getInboxTasks("INCOMPLETE", sortBy)
      // this.props.taskActions.getInboxTasks(sortBy)
    }else if(this.props.title == "Assigned by me"){
      this.props.taskActions.getTasksAssignedByMe(undefined, sortBy, "COMPLETE")
      this.props.taskActions.getTasksAssignedByMe(undefined, sortBy, "INCOMPLETE")
      // this.props.taskActions.getTasksAssignedByMe(undefined, sortBy)
    }else if(this.props.title == "Assigned to me"){
      this.props.taskActions.getTasksAssignedToMe(undefined, sortBy, "COMPLETE")
      this.props.taskActions.getTasksAssignedToMe(undefined, sortBy, "INCOMPLETE")
      // this.props.taskActions.getTasksAssignedToMe(undefined, sortBy)
    }
  }

  toggleListNotifications = () => {
    this.props.taskListActions.toggleListNotifications(this.props.taskListId, !this.props.taskList.notifications)
  }

  openListMembers = () => {
    openPopup("#list-members-"+this.props.taskListId)
  }
  
  addDashes = (f) =>
  {
    if(f != undefined && f!=""){
      f = f.replace('\+1', '');
      var formattedNumber = f.slice(0,3)+"-"+f.slice(3,6)+"-"+f.slice(6,15);
      return formattedNumber
    }
  }



    render() {
    return (
      <div>
        <header className="nav-down" id="taskListHeader">
						<div className="top-bar">
              {/* <div className="new-task text-center">
                <span className="number-new-tasks"></span>
              </div> */}
							<div className="top-bar-left">
								<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
								<h3>{this.props.title}</h3>
								{/* <h3>{this.state.title ? this.state.title : this.props.taskList.listName}</h3> <span className="number-of-tasks hide">23 Tasks</span> */}
							</div>
              {this.props.taskListId &&
  							<div className="top-bar-right">
  								<ul className="menu member-photo-list">
                    {/* <li><span className="add-member circle small" data-open={"list-members-"+this.props.taskListId}>+</span></li> */}
                    <li><span className="add-member circle small" onClick={(e) => this.openListMembers()}>+</span></li>
                    {this.props.members && this.props.members.map(member => {
                        return(
                          <li key={"member"+member.userId}>
                            <span data-open={"member-profile-" + member.userId}><MemberInitials data-open={"member-profile-" + member.userId} member={member} extraClass="small"/></span>

                            {/* Modal */}
                            <div className="reveal" id={"member-profile-" + member.userId} data-reveal="">
                              <div className="item row expanded" key={member.email}>
                                <div className="columns shrink pending">
                                {/* <img className="member-photo circle" src="assets/img/user3.png" alt="name of user"/> */}
                                 {/* <span className="member-initials circle">{person.initials}</span> */}
                                 <MemberInitials member={member}/>
                                </div>
                                <div className="columns">
                                  <span className="item-title">{member.firstName + " " + member.lastName}</span>
                                  <span className="item-details">{member.titleList}</span>
                                  <span className="item-details">{member.specialtyList}</span>
                                  <span className="top-buffer-xsmall item-details">{member.email}</span>
                                  <span className="item-details">C: {this.addDashes(member.accountPhoneNumber)} | W: {this.addDashes(member.workPhoneNumber)}</span>
                                </div>
                                </div>
                              <button className="close-button" data-close="" aria-label="Close modal" type="button">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                          </li>
                        )
                      })
                    }
                    {/* <li><span className="more-members circle small">+4</span></li>
  									<li><span className="add-member circle small">+</span></li>
  									<li><span className="more-members circle small">+4</span></li>
  									<li><img className="member-photo circle small" src="assets/img/user1.png" alt="name of user"/></li>
  									<li><img className="member-photo circle small" src="assets/img/user2.png" alt="name of user"/></li>
  									<li><span className="member-initials circle small">SL</span></li>
  									<li><img className="member-photo circle small" src="assets/img/user3.png" alt="name of user"/></li> */}
  			          </ul>
								</div>
              }
							</div>

              {/*<TaskFiltersContainer taskListId={taskListId} />*/}
							<div className={"wrapper list-filter row collapse align-middle align-right "}>
								<div className="columns shrink controls">
									<button className="dropdown button primary small" data-toggle="sort-dropdown">Sort</button>
									<div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
										<ul className="no-bullet">
											{/* <li>Due date</li> */}
											<li onClick={(e) => this.getListTasks('CREATED_DT')} className="active">Creation date</li>
                      <li onClick={(e) => this.getListTasks('DUE_DT')}>Due date</li>
											<li onClick={(e) => this.getListTasks('PATIENT')}>Patient</li>
											{this.props.title != "Inbox" && this.props.title != "Assigned by me" && <li onClick={(e) => this.getListTasks('ASSIGNED_BY')}>Assigned by</li>}
											{this.props.title != "Inbox" && this.props.title != "Assigned to me" && <li onClick={(e) => this.getListTasks('ASSIGNED_TO')}>Assigned to</li>}
											<li onClick={(e) => this.getListTasks('PRIORITY')}>Priority</li>
											{/* <li>Tag</li> */}
										</ul>
									</div>
								</div>

								<div className="columns controls">
									<div className="input-group searchbar">
										<input className="input-field search-field" type="search" placeholder="Search tasks" onChange={this.props.searchUpdated} value={this.props.searchTerm}/>
										<div className="input-group-button">
											<button className="button">
												<svg onClick={this.props.clearSearch} className="icon"><use xlinkHref="#icon-search"></use></svg>
											</button>
										</div>
									</div>
								</div>

								<div className="columns shrink icon-group controls">
                  <span title="Refresh data" onClick={(e) => this.props.refresh()}><svg className="icon refresh"><use xlinkHref="#icon-activity"></use></svg></span>
                  {this.props.taskListId &&
  									<span title="List alerts toggle" onClick={(e) => this.toggleListNotifications()}><svg className="icon"><use xlinkHref={this.props.taskList && this.props.taskList.notifications ? "#icon-bell" : "#icon-bell-off"}></use></svg></span>
                  }
									<span title="Slim view toggle"><svg className="icon toggle-slim"><use xlinkHref="#icon-slim"></use></svg></span>
								</div>

                {(this.props.title == "Inbox" || this.props.taskListId) &&
  								<div className="columns shrink" onClick={(e) => this.handleAddTask()}>
  									<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
  								</div>
                }
						</div>
        </header>

        <AddTask
          taskListId={this.props.taskListId}
          addTask={this.props.taskActions.addTask}
          taskLists={this.props.taskList}
          patients={this.props.patients}
          title={this.props.title}
          members={this.props.members}
          activeListMembers={this.props.activeListMembers}
        />
        <ListMembers members={this.props.members}/>
      </div>
      );
    }
}

const mapStateToProps = function (store) {
  // console.log('tasklist is: ' + store.taskListState.tasklistone.listName)
  return {
    taskList: store.taskListState.currentList, // tasklistone is set at the reducer
    taskLists: store.taskListState.tasklist,
    patients: store.patientState.allPatients,
    currentList: store.taskListState.currentList,
    currentUser: store.userState.user,
    members: store.taskListState.tasklistmembers,
    activeListMembers: store.taskListState.tasklistactivemembers
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch),
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTasks)
