import React, { PureComponent } from 'react';

import { mobileAnalyticsClient } from '../api/analytics-api';
import TaskListActivityFeedContainer from '../components/LEGACY_list/TaskListActivityFeedContainer';

class TaskListActivityFeedView extends PureComponent {
  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'ActivityFeed',
    });
  }

  render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <div className="top-bar">
              <div className="top-bar-left">
                <button
                  className="menu-icon hide-for-medium"
                  type="button"
                  data-toggle="sidebar"
                />
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
