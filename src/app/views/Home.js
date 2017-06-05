import React from 'react'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFiltersContainer from '../components/task/TaskFiltersContainer'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'
import NotificationsToggle from '../components/tasklist/TaskListNotificationsToggle'

class Home extends React.Component {

  render() {
    var taskListId = this.props.params.taskListId
    return (
      <div className="row">
        <div className="large-8 columns task-list-container">
          <TaskFiltersContainer taskListId={taskListId} />
          <ListOfTasksContainer taskListId={taskListId} status="INCOMPLETE"/>
          <h1>Completed Tasks</h1>
          <ListOfTasksContainer taskListId={taskListId} status="COMPLETE"/>
        </div>
        <div>TaskListId: {taskListId} (Home.js)</div>
        {taskListId > 0 &&
          <div className="large-4 columns sidebar">
            <NotificationsToggle taskListId={taskListId}/>
            <TaskListUsers taskListId={taskListId}/>
            <TaskListPatients taskListId={taskListId}/>
          </div>
        }
      </div>
    );
  }
}

export default Home
