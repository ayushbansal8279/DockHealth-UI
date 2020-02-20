import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { bindActionCreators } from 'redux';

import * as TaskListActions from '../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import * as userApi from '../api/user-api';
import * as organizationApi from '../api/organization-api';
import CubesLoaderOverlay from '../components/common/CubesLoaderOverlay';
import Drawer from '../components/drawer/Drawer';
import { unsetHeader } from '../actions/header-actions';
import handleFeatureToggle from '../helpers/handle-feature-toggle';

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

class TemplateCore extends PureComponent {
  state = {
    loading: true,
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

  async componentDidMount() {
    const { taskListActions } = this.props;

    await userApi.isAuthenticated({ isLoggedIn: this.isLoggedIn });

    taskListActions.getTaskListForUser();
  }

  unlockLoading = () => {
    this.setState({
      loading: false,
    });
  };

  isLoggedIn = async (isLoggedIn, cognitoUser) => {
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

      try {
        await this.checkUserData({ user: cognitoUser });
      } catch (error) {
        // console.log(error);
        hashHistory.push('login');
      } finally {
        this.unlockLoading();
      }
    }
  };

  checkUserData = async ({ user }) => {
    const data = await userApi.getUserByEmail(user.username, user);
    let orgData = null;
    if (data && data.organizationIdentifier) {
      orgData = await organizationApi.checkBAASignedStatus();
    }
    if (!data.organizationIdentifier || data.organizationIdentifier === '') {
      hashHistory.push('/unEnrolledUser');
    } else if (data.personalOrganization && data.presentHippaAlert) {
      hashHistory.push('/selfEnrolledUser');
    } else if (!data.eulaAcknowledged) {
      hashHistory.push('/onboarding/eula');
    } else if (orgData && !orgData.baaSigned) {
      hashHistory.push('/onboarding/baa-check');
    } else {
      if (data.profileThumbnailPictureHash) {
        userApi.getUserProfilePic(data.userIdentifier, 'PROFILE');
      }

      handleFeatureToggle({
        location: hashHistory.getCurrentLocation(),
        user: data,
      });
    }
  };

  render() {
    const { dispatchedUnsetHeader, children } = this.props;
    const { loading, locationPathname } = this.state;

    if (loading) {
      return <CubesLoaderOverlay withBackground />;
    }

    return (
      <Drawer locationPathname={locationPathname}>
        <SwitchTransition>
          <CSSTransition
            key={locationPathname}
            timeout={{
              exit: 250,
              appear: 250,
            }}
            onExiting={() => {
              dispatchedUnsetHeader();
            }}
            classNames="fade"
          >
            {children}
          </CSSTransition>
        </SwitchTransition>
      </Drawer>
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
  dispatchedUnsetHeader: unsetHeader(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCore);
