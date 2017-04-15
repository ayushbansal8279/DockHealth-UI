import React from 'react';

import TaskListContainer from '../components/tasklist/TaskListContainer'


class TaskListView extends React.Component {
    render() {
      return (
        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListContainer/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListView;
