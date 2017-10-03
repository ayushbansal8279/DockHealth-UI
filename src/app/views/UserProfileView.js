import React from 'react';
import { Link,hashHistory } from 'react-router';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import UserProfileContainer from '../components/people/UserProfileContainer'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'

class UserProfileView extends BaseComponentWithFoundationUpdate {

    render() {
      return (

        <div className="off-canvas-content" data-off-canvas-content>
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <header className="nav-down">
                <div className="top-bar">
                  {/* <div className="new-task text-center">
                    <span className="number-new-tasks"></span>
                  </div> */}
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
            <UserProfileContainer userProfile={this.props.userProfile}/>
          </div>
        </div>

      );
  }
}

const mapStateToProps = function (store) {
  return {
    userProfile: store.userState.userProfile
  }
}

export default connect(mapStateToProps)(UserProfileView);
