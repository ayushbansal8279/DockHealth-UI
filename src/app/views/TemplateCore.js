import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import * as TaskListActions from '../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import * as userApi from '../api/user-api';
import Drawer from '../components/drawer/Drawer';

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let tem;
  let M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];
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

  tem = ua.match(/version\/(\d+)/i);
  if (tem != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1],
  };
};

const NavLink = ({ to, children, className }) => (
  <li>
    <Link activeClassName="active" className={className} to={to}>
      {children}
    </Link>
  </li>
);

class TemplateCore extends PureComponent {
  state = {
    locationPathname: null,
  };

  static getDerivedStateFromProps(
    { location: previousLocation },
    { locationPathname: previousLocationPathname },
  ) {
    const locationPathname = previousLocation?.pathname?.replace(/^\//, '');

    if (locationPathname && locationPathname !== previousLocationPathname) {
      return {
        locationPathname,
      };
    }

    return {};
  }

  componentDidMount() {
    const { taskListActions } = this.props;

    taskListActions.getTaskListForUser();
    userApi.isAuthenticated(this);
  }

  isLoggedIn(message, isLoggedIn, cognitoUser) {
    const { user } = this.props;
    if (!isLoggedIn) {
      hashHistory.push('login');
    } else {
      if (!user) {
        userApi.updateStoreWithCurrentUser(cognitoUser);
      }

      const browser = getBrowserInfo();
      mobileAnalyticsClient.recordEvent('BROWSER_INFO', {
        Name: browser.name,
        Version: browser.version,
      });

      userApi
        .getUserByEmail(cognitoUser.username, cognitoUser)
        .then(data => {
          if (!data.organizationId || data.organizationId === '') {
            hashHistory.push('/unEnrolledUser');
          } else if (data.personalOrganization && data.presentHippaAlert) {
            hashHistory.push('/selfEnrolledUser');
          }
          if (data.profileThumbnailPictureHash) {
            userApi.getUserProfilePic(data.userId, 'PROFILE');
          }
        })
        .catch(() => {
          hashHistory.push('login');
        });
    }
  }

  render() {
    const { children } = this.props;
    const { locationPathname } = this.state;

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
            <NavLink to="/logout">Logout</NavLink>
          </ul>
        </div>
        <Drawer>
          <SwitchTransition>
            <CSSTransition
              key={locationPathname}
              timeout={250}
              classNames="fade"
            >
              {children}
            </CSSTransition>
          </SwitchTransition>
        </Drawer>
      </div>
    );
  }
}

TemplateCore.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = store => ({
  user: store.userState.user,
});

const mapDispatchToProps = dispatch => ({
  taskListActions: bindActionCreators(TaskListActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateCore);
