import React from 'react';
import { Link,hashHistory } from 'react-router';

import UserProfileContainer from '../components/people/UserProfileContainer'


class UserProfileView extends React.Component {
    render() {
      return (

        <div className="off-canvas-content" data-off-canvas-content>
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <header class="nav-down">
                <div className="top-bar">
                  <div className="new-task text-center">
                    <span className="number-new-tasks"></span>
                  </div>
                  <div className="top-bar-left">
                    <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                    <h3>My Profile</h3>
                  </div>
                  <div className="top-bar-right">
                    <Link to="/logout" className="button small primary">Logout</Link>
                  </div>
                </div>
              </header>
            </div>
          </div>
          <div className="list-wrapper">
            <UserProfileContainer/>
          </div>
        </div>

      );
  }
}

export default UserProfileView;
