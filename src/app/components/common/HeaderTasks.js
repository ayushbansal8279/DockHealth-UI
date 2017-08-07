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
    if(this.props.taskListId){
      this.props.taskListActions.getTaskListById(this.props.taskListId)
      this.props.taskListActions.getMembersByTaskListId(this.props.taskListId, 'ACTIVE')
    }
    this.props.taskListActions.storeAsCurrentList(this.props.taskListId)
  }

  componentWillUpdate(nextProps){
    if(this.props.taskLists.length > 0 && nextProps.taskListId != this.props.currentList.taskListId){
      this.props.taskListActions.storeAsCurrentList(nextProps.taskListId)
      this.setState({title:nextProps.currentList.listName})
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.taskLists.length > 0 && nextProps.taskListId != this.props.currentList.taskListId){
      this.props.taskListActions.storeAsCurrentList(nextProps.taskListId)
      this.setState({title:nextProps.currentList.listName})
    }
  }

	handleAddTask = () => {
		this.props.taskActions.taskToState(null)
	};

  getListTasks = (sortBy) => {
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



    render() {
    return (
      <div>
        <header className="nav-down">

						<div className="top-bar">
              <div className="new-task text-center">
                <span className="number-new-tasks"></span>
              </div>
							<div className="top-bar-left">
								<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
								<h3>{this.props.title}</h3>

								{/* <h3>{this.state.title ? this.state.title : this.props.taskList.listName}</h3> <span className="number-of-tasks hide">23 Tasks</span> */}
							</div>
              {this.props.taskListId &&
  							<div className="top-bar-right">
  								<ul className="menu member-photo-list" data-open="list-members">
                    <li><span className="add-member circle small">+</span></li>
                    {this.props.members.map(member => {
                        return <li key={"member"+member.userId}><span className="member-initials circle small">{member.initials}</span></li>
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
							<div className="wrapper list-filter row collapse align-middle align-right">
								<div className="columns shrink controls">
									<button className="dropdown button primary small" data-toggle="sort-dropdown">Sort</button>
									<div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
										<ul className="no-bullet">
											{/* <li>Due date</li> */}
											<li onClick={(e) => this.getListTasks('CREATED_DT')} className="active">Creation date</li>
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
											<button className="button search">
												<svg onClick={this.props.clearSearch} className="icon"><use xlinkHref="#icon-search"></use></svg>
											</button>
										</div>
									</div>
								</div>

								<div className="columns shrink icon-group controls">
                  <span onClick={(e) => this.props.refresh()}><svg className="icon refresh"><use xlinkHref="#icon-activity"></use></svg></span>
                  {this.props.taskListId &&
  									<span onClick={(e) => this.toggleListNotifications()}><svg className="icon"><use xlinkHref={this.props.taskList.notifications ? "#icon-bell" : "#icon-bell-off"}></use></svg></span>
                  }
									{/* <svg className="icon"><use xlinkHref="#icon-print"></use></svg> */}
									<svg className="icon toggle-slim"><use xlinkHref="#icon-slim"></use></svg>
								</div>

								<div className="columns shrink" onClick={(e) => this.handleAddTask()}>
									<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
								</div>

						</div>
        </header>

        <AddTask taskListId={this.props.taskListId} addTask={this.props.taskActions.addTask} taskLists={this.props.taskList} patients={this.props.patients} title={this.props.title} members={this.props.members}/>
        <ListMembers taskListId={this.props.taskListId} members={this.props.members} title={this.props.title}/>
      </div>
      );
    }
}

const mapStateToProps = function (store) {
  // console.log('tasklist is: ' + store.taskListState.tasklistone.listName)
  return {
    taskList: store.taskListState.tasklistone, // tasklistone is set at the reducer
    taskLists: store.taskListState.tasklist,
    patients: store.patientState.allPatients,
    currentList: store.taskListState.currentList,
    currentUser: store.userState.user,
    members: store.taskListState.tasklistmembers
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
