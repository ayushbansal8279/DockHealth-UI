import React from 'react';

import TaskListMembersViewContainer from '../components/tasklist/TaskListMembersViewContainer'

class TaskListMembersView extends React.Component {
    render() {
      return (

        <div className="content-block">
          <div className="row">
            <div className="large-8 columns task-list-container">
              <TaskListMembersViewContainer taskListId={this.props.params.taskListId}/>
            </div>
            <div className="large-4 columns sidebar">
            </div>
          </div>
        </div>

      );
  }
}

export default TaskListMembersView;
