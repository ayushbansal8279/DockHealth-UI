import React from 'react';

import TaskListOneContainer from '../components/tasklist/TaskListOneContainer'

//TaskListUpdateView is calling TaskListOneContainer as it needs to first get the individual task list
class TaskListUpdateView extends React.Component {
    render() {
      return (

        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListOneContainer taskListId={this.props.params.taskListId}/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListUpdateView;
