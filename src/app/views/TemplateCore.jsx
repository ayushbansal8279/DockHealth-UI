import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { bindActionCreators } from 'redux';

import * as TaskListActions from '../actions/tasklist-actions';
import CubesLoaderOverlay from '../components/common/CubesLoaderOverlay';
import Drawer from '../components/drawer/Drawer';
import { unsetHeader } from '../actions/header-actions';
import { checkUserAuthentication } from './TemplateCore.Utilities';

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

    // await userApi.isAuthenticated({ isLoggedIn: this.isLoggedIn });
    await checkUserAuthentication();
    this.unlockLoading();
    taskListActions.getTaskListForUser();
  }

  unlockLoading = () => {
    this.setState({
      loading: false,
    });
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateCore);
