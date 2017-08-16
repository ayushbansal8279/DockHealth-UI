import React from 'react';

import TaskListUpdateUserRoleContainer from '../components/tasklist/TaskListUpdateUserRoleContainer'

class TaskListUpdateUserRoleView extends React.Component {
    render() {
      return (

        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListUpdateUserRoleContainer taskListId={this.props.params.taskListId}/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListUpdateUserRoleView;
