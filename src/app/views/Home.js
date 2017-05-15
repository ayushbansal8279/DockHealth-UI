import React from 'react'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFiltersContainer from '../components/task/TaskFiltersContainer'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'

class Home extends React.Component {
    render() {
    return (
      <div className="row">
        <div className="large-8 columns task-list-container">
          <TaskFiltersContainer />
          <ListOfTasksContainer taskListId='1' status="INCOMPLETE"/>
          <h1>Completed Tasks</h1>
          <ListOfTasksContainer taskListId='1' status="COMPLETE"/>
        </div>
        <div className="large-4 columns sidebar">
          <TaskListUsers />
          <TaskListPatients />
        </div>
      </div>
    );
  }
}

export default Home
