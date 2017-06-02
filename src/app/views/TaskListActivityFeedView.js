import React from 'react';

import TaskListActivityFeedContainer from '../components/tasklist/TaskListActivityFeedContainer'

class TaskListActivityFeedView extends React.Component {
    render() {
      return (

        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListActivityFeedContainer/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListActivityFeedView;
