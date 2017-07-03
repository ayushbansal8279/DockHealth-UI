import React from 'react'
import TaskListActivityFeedContainer from '../components/list/TaskListActivityFeedContainer'
import {mobileAnalyticsClient} from '../api/analytics-api'

class TaskListActivityFeedView extends React.Component {

    componentDidMount(){
			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
							'PageName': 'ActivityFeed'
			});
    }

    render() {
      return (
        <div className="off-canvas-content" data-off-canvas-content>
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>Activity</h3>
                </div>

              </div>
            </div>
          </div>
          <div className="wrapper top-buffer">
            <div className="row expanded collapse">
              <TaskListActivityFeedContainer/>
            </div>
          </div>
        </div>
      );
  }
}

export default TaskListActivityFeedView;
