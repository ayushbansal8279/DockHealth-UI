import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFiltersContainer from '../components/task/TaskFiltersContainer'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'
import HeaderTasks from '../components/common/HeaderTasks'
import NotificationsToggle from '../components/tasklist/TaskListNotificationsToggle'
import * as TaskActions from '../actions/task-actions'
import * as TaskListActions from '../actions/tasklist-actions'
import BaseComponent from '../components/BaseComponent'
import $ from 'jquery'
import {mobileAnalyticsClient} from '../api/analytics-api'
import SearchInput, {createFilter} from 'react-search-input'
// import {mousetrap} from 'react-mousetrap'

class Home extends BaseComponent {

  constructor(props){
    super(props)
    this.state = {
      title: '',
      searchTerm: ''
    }
    this.changeTitle = this.changeTitle.bind(this)
  }



  changeTitle(newTitle){
    // alert("working")
    this.setState({title: newTitle})
  }

  clearSearch = () => {
    this.setState({searchTerm: ''})
    $(".search-field").toggleClass("expand-search");
    $(".search-field").focus();
    $(this).find('use').attr('href', function (index, attr) {
      return $(".search-field").hasClass("expand-search") ? '#icon-search' : '#icon-close';
    });
  }

  searchUpdated = (term) => {
    this.setState({searchTerm: term.target.value})
  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  componentWillMount(){
    // console.log("home willMount")
  }

  componentDidMount(){
    // Mousetrap.bind(['ctrl+t'], toggleTaskForm);
    var listName = this.props.routeParams.listName
    if(!listName || listName == "Inbox"){
      this.props.actions.getInboxTasks("COMPLETE")
      this.props.actions.getInboxTasks("INCOMPLETE")
    }else if(listName == "Assigned by me"){
      this.props.actions.getTasksAssignedByMe(undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedByMe(undefined, undefined, "INCOMPLETE")
    }else if(listName == "Assigned to me"){
      this.props.actions.getTasksAssignedToMe(undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedToMe(undefined, undefined, "INCOMPLETE")
    }else{
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, "INCOMPLETE")
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, "COMPLETE")
      this.props.taskListActions.getMembersByTaskListId(this.props.routeParams.taskListId, "ACTIVE")
    }

    // PUT ME SOMEWHERE ELSE
    // show/hide completed tasks
    $('.toggle-completed').click(function() {
      $(this).toggleClass('inverse');
      $('.completed-task-wrapper').slideToggle();
      var $el = $(this);
      $el.text($el.text() == "Show completed tasks" ? "Hide completed tasks": "Show completed tasks");
    });

    // toggle slim view
    $('.toggle-slim').click(function() {
        if($(this).hasClass('active')) {//true means slim mode off
          mobileAnalyticsClient.recordEvent('SLIM_MODE', {
                  'Value': 'OFF'
          });
        }
        else{//false means slim mode on
          mobileAnalyticsClient.recordEvent('SLIM_MODE', {
                  'Value': 'ON'
          });
        }
        $(this).toggleClass('active');
        $('.task-item-wrapper').toggleClass('slim');
        $('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
    });
  }

  componentWillUpdate(nextProps){
    // console.log(this.props.routeParams.listName)
    if(nextProps.routeParams.listName != this.props.routeParams.listName){
      var listName = nextProps.routeParams.listName
      if(!listName || listName == "Inbox"){
        this.props.actions.getInboxTasks("COMPLETE")
        this.props.actions.getInboxTasks("INCOMPLETE")
      }else if(listName == "Assigned by me"){
        this.props.actions.getTasksAssignedByMe(undefined, undefined, "COMPLETE")
        this.props.actions.getTasksAssignedByMe(undefined, undefined, "INCOMPLETE")
      }else if(listName == "Assigned to me"){
        this.props.actions.getTasksAssignedToMe(undefined, undefined, "COMPLETE")
        this.props.actions.getTasksAssignedToMe(undefined, undefined, "INCOMPLETE")
      }else if(listName != null){
        this.props.actions.getListTasks(nextProps.routeParams.taskListId, undefined, "INCOMPLETE")
        this.props.actions.getListTasks(nextProps.routeParams.taskListId, undefined, "COMPLETE")
        this.props.taskListActions.getMembersByTaskListId(nextProps.routeParams.taskListId, "ACTIVE")
      }
    }
  }

  render() {
    var taskListId = this.props.params.taskListId
    const KEYS_TO_FILTERS = ['description', 'comments.comment', 'subtasks.description', 'subtasks.comments.comment']

    // Creates filter with LIST, SEARCH TERM, KEYS TO FILTER
    const filteredTasks = this.props.tasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    const filteredCompletedTasks = this.props.completedTasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <HeaderTasks title={this.props.routeParams.listName} taskListId={this.props.routeParams.taskListId} searchUpdated={this.searchUpdated} clearSearch={this.clearSearch} searchTerm={this.state.searchTerm}/>
              <div className="list-wrapper">
                <div className="sk-circle hide">
        					<div className="sk-circle1 sk-child"></div>
        					<div className="sk-circle2 sk-child"></div>
        					<div className="sk-circle3 sk-child"></div>
        					<div className="sk-circle4 sk-child"></div>
        					<div className="sk-circle5 sk-child"></div>
        					<div className="sk-circle6 sk-child"></div>
        					<div className="sk-circle7 sk-child"></div>
        					<div className="sk-circle8 sk-child"></div>
        					<div className="sk-circle9 sk-child"></div>
        					<div className="sk-circle10 sk-child"></div>
        					<div className="sk-circle11 sk-child"></div>
        					<div className="sk-circle12 sk-child"></div>
        				</div>
                <div className="task-item-wrapper">
                  <ListOfTasksContainer taskListId={taskListId} status="INCOMPLETE" members={this.props.members} filteredTasks={filteredTasks} />
                  <div className="show-completed text-center">
                    <a className="toggle-completed button primary small">Show completed tasks</a>
                  </div>
                  <div className="completed-task-wrapper">
                    <ListOfTasksContainer taskListId={taskListId} status="COMPLETE" members={this.props.members} filteredTasks={filteredCompletedTasks} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

const mapStateToProps = function (store) {
  return{
    members: store.taskListState.tasklistmembers,
    tasks: store.taskState.tasks,
    completedTasks: store.taskState.completedTasks
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(TaskActions, dispatch),
    taskListActions: bindActionCreators(TaskListActions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home);
