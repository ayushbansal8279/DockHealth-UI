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
import axios from 'axios';

class HeaderTasks extends BaseComponent {
  constructor(props){
    super(props)
    this.state = {
      value: '',
      hideForm: true,
      title: '',
      sortBy: 'CREATED_DT',
      filterBy: ''
    }
  }

  componentDidMount () {
    this.props.patientActions.getAllPatients()
    this.props.taskActions.loading()
    if(this.props.taskListId){
      this.props.taskListActions.getTaskListById(this.props.taskListId)
      if(this.props.taskListId){
        this.props.taskListActions.getMembersByTaskListId(this.props.taskListId, 'ALL')
      }
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
      if(this.props.taskListId){
        this.props.taskListActions.getActiveMembersByTaskListId(this.props.taskListId)
      }
      this.props.taskListActions.storeAsCurrentList(nextProps.taskListId)
      this.setState({title:nextProps.currentList.listName, sortBy: 'CREATED_DT'})
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
      this.setState({title:nextProps.currentList.listName, sortBy: 'CREATED_DT'})
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

  sortListTasks = (sortBy) => {
    this.setState({sortBy: sortBy})
    this.setState({filterBy: "NONE"})
    this.getListTasks(sortBy, this.state.filterBy)
    closeDropdown("#sort-dropdown")
  }

  filterListTasks = (filterBy) => {
    this.setState({filterBy: filterBy})
    this.setState({sortBy: "CREATED_DT"})
    this.getListTasks(this.state.sortBy, filterBy)
    closeDropdown("#sort-dropdown")
  }

  getListTasks = (sortBy, filterBy) => {
    this.props.taskActions.loading()
    if(this.props.taskListId){
      this.props.taskActions.getListTasks(this.props.taskListId, sortBy, filterBy, "INCOMPLETE")
      this.props.taskActions.getListTasks(this.props.taskListId, sortBy, filterBy, "COMPLETE")
      // this.props.taskActions.getListTasks(this.props.taskListId, sortBy)
    }else if(this.props.title == "Inbox") {
      this.props.taskActions.getInboxTasks("COMPLETE", sortBy, filterBy)
      this.props.taskActions.getInboxTasks("INCOMPLETE", sortBy, filterBy)
      // this.props.taskActions.getInboxTasks(sortBy)
    }else if(this.props.title == "Assigned by me"){
      this.props.taskActions.getTasksAssignedByMe(undefined, sortBy, filterBy, "COMPLETE")
      this.props.taskActions.getTasksAssignedByMe(undefined, sortBy, filterBy, "INCOMPLETE")
      // this.props.taskActions.getTasksAssignedByMe(undefined, sortBy)
    }else if(this.props.title == "Assigned to me"){
      this.props.taskActions.getTasksAssignedToMe(undefined, sortBy, filterBy, "COMPLETE")
      this.props.taskActions.getTasksAssignedToMe(undefined, sortBy, filterBy, "INCOMPLETE")
      // this.props.taskActions.getTasksAssignedToMe(undefined, sortBy)
    }
  }

  downloadPDF = () => {
    if(this.props.taskListId){
      axios({
        url: process.env.HEYDOC_SERVICES_BASE_URL+'list/downloadPDFForTasksInList?taskListId='+this.props.taskListId,
        method: 'GET',
        responseType: 'blob', // important
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'DOCK_ActionGrid.pdf');
        document.body.appendChild(link);
        link.click();
        return "success";
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
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
									<button className="dropdown button primary small" data-toggle="sort-dropdown">Sort / Filter</button>
									<div className="dropdown-pane button-dropdown" id="sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
                    <div className="sortFilterCategory"><span>Sort by :</span></div>
										<ul className="no-bullet">
											{/* <li>Due date</li> */}
											<li className={this.state.sortBy == "CREATED_DT"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('CREATED_DT')}>Creation date</li>
                      <li className={this.state.sortBy == "DUE_DT"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('DUE_DT')}>Due date</li>
											<li className={this.state.sortBy == "PATIENT"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('PATIENT')}>Patient</li>
											{this.props.title != "Inbox" && this.props.title != "Assigned by me" && <li className={this.state.sortBy == "ASSIGNED_BY"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('ASSIGNED_BY')}>Assigned by</li>}
											{this.props.title != "Inbox" && this.props.title != "Assigned to me" && <li className={this.state.sortBy == "ASSIGNED_TO"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('ASSIGNED_TO')}>Assigned to</li>}
											<li className={this.state.sortBy == "PRIORITY"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('PRIORITY')}>Priority</li>
                      <li className={this.state.sortBy == "TASK_DESCRIPTION"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('TASK_DESCRIPTION')}>Alphabetical</li>
                    </ul>  
										<div className="sortFilterCategory"><span>Filter by :</span></div>
                    <ul className="no-bullet"> 
											{/* <li>Due date</li> */}
											<li className={this.state.filterBy == "NONE"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('NONE')}>None</li>
											<li className={this.state.filterBy == "ASSIGNED_TO_ME"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('ASSIGNED_TO_ME')}>Assigned to me</li>
                      <li className={this.state.filterBy == "CREATED_BY_ME"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('CREATED_BY_ME')}>Created by me</li>
											<li className={this.state.filterBy == "OVERDUE"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('OVERDUE')}>Overdue</li>
                      <li className={this.state.filterBy == "DUE_TODAY"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('DUE_TODAY')}>Due Today</li>
                      <li className={this.state.filterBy == "DUE_THIS_WEEK"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('DUE_THIS_WEEK')}>Due This Week</li>
											<li className={this.state.filterBy == "DUE_NEXT_WEEK"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('DUE_NEXT_WEEK')}>Due Next Week</li>
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
                  {/* <span title="Print" onClick={(e) => this.downloadPDF()}><svg className="icon toggle-print"><use xlinkHref="#icon-print"></use></svg></span> */}
								</div>

                {(this.props.title == "Inbox" || this.props.taskListId) &&
  								<div className="columns shrink" onClick={(e) => this.handleAddTask()}>
  									<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
  								</div>
                }
						</div>

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
        </header>
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
