import React from 'react';

import TaskListInviteUsersContainer from '../components/tasklist/TaskListInviteUsersContainer'

class TaskListInviteUserView extends React.Component {
    render() {
      return (

        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListInviteUsersContainer taskListId={this.props.params.taskListId}/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListInviteUserView;
