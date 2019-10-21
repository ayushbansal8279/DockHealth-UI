import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';

import * as TaskListActions from '../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import * as userApi from '../api/user-api';
import Drawer from '../components/drawer/Drawer';

class TemplateCore extends PureComponent {
  state = {
    user: false,
  };

  componentWillMount() {
    userApi.isAuthenticated(this);
  }

  componentDidMount() {
    this.props.taskListActions.getTaskListForUser();
  }

  getBrowserInfo() {
    const ua = navigator.userAgent;
    let tem;
    let M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
      ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: tem[1] || '' };
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR|Edge\/(\d+)/);
      if (tem != null) {
        return { name: 'Opera', version: tem[1] };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return {
      name: M[0],
      version: M[1],
    };
  }

  isLoggedIn(message, isLoggedIn, cognitoUser) {
    if (!isLoggedIn) {
      console.log('not logged in');
      hashHistory.push('login');
    } else {
      if (!this.props.user) {
        this.state.user = cognitoUser;
        // TODO - fix this hack
        userApi.updateStoreWithCurrentUser(cognitoUser);
      } else {
        this.state.user = this.props.user;
      }
      console.log(`logged in: ${cognitoUser.username}`);
      const browser = this.getBrowserInfo();
      mobileAnalyticsClient.recordEvent('BROWSER_INFO', {
        Name: browser.name,
        Version: browser.version,
      });

      // check if user exists
      userApi
        .getUserByEmail(cognitoUser.username, cognitoUser)
        .then(data => {
          // disable no invitation check
          if (!data.organizationId || data.organizationId == '') {
            hashHistory.push('/unEnrolledUser');
          } else if (data.personalOrganization && data.presentHippaAlert) {
            hashHistory.push('/selfEnrolledUser');
          }
          // userId, pictureType
          if (data.profileThumbnailPictureHash) {
            userApi.getUserProfilePic(data.userId, 'PROFILE').then(datapic => {
              // console.log (datapic);
            });
          }

          // console.log(data);
        })
        .catch(error => {
          console.log(error);
          hashHistory.push('login');
        });
    }
  }
  // )

  render() {
    const NavLink = ({ to, children, className }) => (
      <li>
        <Link activeClassName="active" className={className} to={to}>
          {children}
        </Link>
      </li>
    );
    return (
      <div>
        <div className="new-task text-center">
          <span className="number-new-tasks">Hello</span>
        </div>
        <div
          className="small dropdown-pane"
          id="profile-dropdown"
          data-v-offset="0"
          data-h-offset="0"
          data-dropdown
          data-hover="true"
          data-hover-pane="true"
        >
          <ul className="menu vertical">
            <NavLink to="/userprofile">View and edit profile</NavLink>
            <li>
              <a href="https://dock.health/privacy">Privacy Policy</a>
            </li>
            {/* <li><a href="terms2.html">Terms and conditions</a></li> */}
            <NavLink to="/logout">Logout</NavLink>
          </ul>
        </div>
        <Drawer>{this.props.children}</Drawer>
        {/* <Notification /> */}
      </div>
    );
  }
}

TemplateCore.propTypes = {
  children: PropTypes.object.isRequired,
};

const mapStateToProps = function(store) {
  return {
    user: store.userState.user,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateCore);
