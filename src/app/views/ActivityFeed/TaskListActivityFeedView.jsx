import React, { PureComponent } from 'react';
import TaskListActivityFeedContainer from './TaskListActivityFeedContainer';

class TaskListActivityFeedView extends PureComponent {
  render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <div className="top-bar">
              <div className="top-bar-left">
                <h3>Activity</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="wrapper top-buffer">
          <div className="row expanded collapse">
            <TaskListActivityFeedContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default TaskListActivityFeedView;
