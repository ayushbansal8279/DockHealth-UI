import React from 'react'
import AddTask from '../task/AddTask'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as PatientActions from '../../actions/patient-actions'
import ListMembers from './ListMembers'
import MemberInitials from './MemberInitials'
import {ReactDOM, findDOMNode} from 'react-dom'
import $ from 'jquery'
import BaseComponent from '../BaseComponent'
import axios from 'axios';

class SortFilterTasks extends BaseComponent {
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
    enableFoundationComponent("#nonlist-sort-dropdown")
  }

  componentWillUpdate(nextProps){

  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
    enableFoundationComponent("#nonlist-sort-dropdown")
  }

  componentWillReceiveProps(nextProps){

  }

  componentWillUnmount(){
    
  }

  sortListTasks = (sortBy) => {
    this.setState({sortBy: sortBy})
    this.setState({filterBy: "NONE"})
    this.props.getListTasks(sortBy, this.state.filterBy)
    closeDropdown("#nonlist-sort-dropdown")
  }

  filterListTasks = (filterBy) => {
    this.setState({filterBy: filterBy})
    this.setState({sortBy: "CREATED_DT"})
    this.props.getListTasks(this.state.sortBy, filterBy)
    closeDropdown("#nonlist-sort-dropdown")
  }

  toggleListNotifications = () => {
    this.props.taskListActions.toggleListNotifications(this.props.taskListId, !this.props.taskList.notifications)
  }
  
  addDashes = (f) =>
  {
    if(f != undefined && f!=""){
      f = f.replace('\+1', '');
      var formattedNumber = f.slice(0,3)+"-"+f.slice(3,6)+"-"+f.slice(6,15);
      return formattedNumber
    }
  }

  toggleSlimView = () => {
    $(this).toggleClass('active');
    $('.task-item-wrapper').toggleClass('slim');
    $('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
  }

  render() {
    return (
        <div id="sortFilterHeader">

          <div className={"wrapper list-filter row collapse align-middle align-right "}>
            <div className="columns controls">
              <button className="dropdown button primary small" data-toggle="nonlist-sort-dropdown">Sort / Filter</button>
              <div className="dropdown-pane button-dropdown" id="nonlist-sort-dropdown" data-dropdown data-close-on-click="true" data-auto-focus="true">
                <div className="sortFilterCategory"><span>Sort by :</span></div>
                <ul className="no-bullet">
                  {/* <li>Due date</li> */}
                  <li className={this.state.sortBy == "CREATED_DT"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('CREATED_DT')}>Creation date</li>
                  <li className={this.state.sortBy == "DUE_DT"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('DUE_DT')}>Due date</li>
                  {this.props.title != "Patient Tasks" && <li className={this.state.sortBy == "PATIENT"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('PATIENT')}>Patient</li>}
                  <li className={this.state.sortBy == "ASSIGNED_BY"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('ASSIGNED_BY')}>Assigned by</li>
                  {this.props.title != "Person Tasks" && <li className={this.state.sortBy == "ASSIGNED_TO"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('ASSIGNED_TO')}>Assigned to</li>}
                  <li className={this.state.sortBy == "PRIORITY"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('PRIORITY')}>Priority</li>
                  <li className={this.state.sortBy == "TASK_DESCRIPTION"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.sortListTasks('TASK_DESCRIPTION')}>Alphabetical</li>
                </ul>  
                <div className="sortFilterCategory"><span>Filter by :</span></div>
                <ul className="no-bullet"> 
                  {/* <li>Due date</li> */}
                  <li className={this.state.filterBy == "NONE"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('NONE')}>None</li>
                  {this.props.title != "Person Tasks" && <li className={this.state.filterBy == "ASSIGNED_TO_ME"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('ASSIGNED_TO_ME')}>Assigned to me</li>}
                  <li className={this.state.filterBy == "CREATED_BY_ME"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('CREATED_BY_ME')}>Created by me</li>
                  <li className={this.state.filterBy == "OVERDUE"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('OVERDUE')}>Overdue</li>
                  <li className={this.state.filterBy == "DUE_TODAY"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('DUE_TODAY')}>Due Today</li>
                  <li className={this.state.filterBy == "DUE_THIS_WEEK"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('DUE_THIS_WEEK')}>Due This Week</li>
                  <li className={this.state.filterBy == "DUE_NEXT_WEEK"?"sortFilterItem active":"sortFilterItem"} onClick={(e) => this.filterListTasks('DUE_NEXT_WEEK')}>Due Next Week</li>
                  {/* <li>Tag</li> */}
                </ul>
              </div>
            </div>

            <div className="columns shrink icon-group controls">
              <span title="Refresh data" onClick={(e) => this.props.refresh()}><svg className="icon refresh"><use xlinkHref="#icon-activity"></use></svg></span>
              <span title="Slim view toggle" onClick={(e) => this.toggleSlimView()}><svg className="icon toggle-slim"><use xlinkHref="#icon-slim"></use></svg></span>
            </div>

          </div>

        </div>
      );
    }
}

const mapStateToProps = function (store) {
  // console.log('tasklist is: ' + store.taskListState.tasklistone.listName)
  return {
    taskLists: store.taskListState.tasklist,
    patients: store.patientState.allPatients,
    currentUser: store.userState.user,
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch),
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SortFilterTasks)
