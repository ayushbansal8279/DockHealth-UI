import React from 'react'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFilters from '../components/task/TaskFilters'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'

class Home extends React.Component {
    render() {
    return (   
      <div className="row">
        <div className="large-8 columns task-list-container">
          <TaskFilters />
          <ListOfTasksContainer />
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

