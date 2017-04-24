import React from 'react';

import TaskListInvitePersonContainer from '../components/tasklist/TaskListInvitePersonContainer'

class TaskListInvitePersonView extends React.Component {
    render() {
      return (

        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListInvitePersonContainer taskListId={this.props.params.taskListId}/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListInvitePersonView;
