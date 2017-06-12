import React from 'react'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFiltersContainer from '../components/task/TaskFiltersContainer'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'
import HeaderTasks from '../components/common/HeaderTasks'
import NotificationsToggle from '../components/tasklist/TaskListNotificationsToggle'

class Home extends React.Component {

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
                    <ListOfTasksContainer taskListId={taskListId} status="COMPLETE"/>
                  </div>
                </div>

            </div>
          </div>
        </div>

    );
  }
}

export default Home
