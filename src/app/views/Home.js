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
import BaseComponent from '../components/BaseComponent'

class Home extends BaseComponent {
  componentDidMount(){BaseComponent
    if(!this.props.params.taskListId || this.props.params.taskListId == "inbox"){
      this.props.actions.getInboxTasks()
    }else if(this.props.params.taskListId == "assignedByMe"){
      this.props.actions.getTasksAssignedByMe()
    }else if(this.props.params.taskListId == "assignedToMe"){
      this.props.actions.getTasksAssignedToMe()
    }else{
      this.props.actions.getListTasks(this.props.params.taskListId)
    }
  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  componentWillUpdate(nextProps){
    if(nextProps.params.taskListId != this.props.params.taskListId){
      console.log("different param")
      //task actions -- send the tasklist id and load data
      if(nextProps.params.taskListId == "inbox"){
        this.props.actions.getInboxTasks()
      }else if(nextProps.params.taskListId == "assignedByMe"){
        this.props.actions.getTasksAssignedByMe()
      }else if(nextProps.params.taskListId == "assignedToMe"){
        this.props.actions.getTasksAssignedToMe()
      }else{
        this.props.actions.getListTasks(nextProps.params.taskListId)
      }
    }

  }

  render() {
    var taskListId = this.props.params.taskListId
    return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <HeaderTasks title="Inbox"/>

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
    actions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(Home);
