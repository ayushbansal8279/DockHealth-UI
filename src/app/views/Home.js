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

class Home extends BaseComponent {

  constructor(props){
    super(props)
    this.state = {
      title: ''
    }
    this.changeTitle = this.changeTitle.bind(this)
  }



  changeTitle(newTitle){
    // alert("working")
    this.setState({title: newTitle})
  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  componentWillMount(){
    this.props.actions.getListTasks(this.props.routeParams.taskListId)
    // console.log("home willMount")
  }

  componentDidMount(){BaseComponent

    var listName = this.props.routeParams.listName
    if(!listName || listName == "Inbox"){
      this.props.actions.getInboxTasks()

    }else if(listName == "Assigned by me"){
      this.props.actions.getTasksAssignedByMe()
    }else if(listName == "Assigned to me"){
      this.props.actions.getTasksAssignedToMe()
    }else{
      this.props.actions.getListTasks(this.props.routeParams.taskListId)
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
      $(this).toggleClass('active');
      $('.task-item-wrapper').toggleClass('slim');
      $('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
    });
  }

  componentWillUpdate(nextProps){
    var listName = this.props.routeParams.listName
    if(!listName || listName == "Inbox"){
      this.props.actions.getInboxTasks()
    }else if(listName == "Assigned by me"){
      this.props.actions.getTasksAssignedByMe()
    }else if(listName == "Assigned to me"){
      this.props.actions.getTasksAssignedToMe()
    }else{
      this.props.actions.getListTasks(this.props.routeParams.taskListId)
      this.props.taskListActions.getMembersByTaskListId(this.props.routeParams.taskListId, "ACTIVE")
    }
  }

  render() {
    var taskListId = this.props.params.taskListId
    return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <HeaderTasks title={this.props.routeParams.listName} taskListId={this.props.routeParams.taskListId}/>
              <div className="list-wrapper">
                <div className="task-item-wrapper">
                  <div className="new-task text-center"><span className="number-new-tasks">1 new task</span></div>
                  <ListOfTasksContainer taskListId={taskListId} status="INCOMPLETE"/>
                  <div className="show-completed text-center">
                    <a className="toggle-completed button primary small">Show completed tasks</a>
                  </div>
                  <div className="completed-task-wrapper">
                    <ListOfTasksContainer taskListId={taskListId} status="COMPLETE"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(TaskActions, dispatch),
    taskListActions: bindActionCreators(TaskListActions, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(Home);
