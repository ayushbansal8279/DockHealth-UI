import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import * as TaskListActions from 'actions/tasklist-actions';
import LoaderOverlay from 'components/common/Loader/LoaderOverlay';
import Drawer from 'components/drawer/Drawer';

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
    this.unlockLoading();
    taskListActions.getTaskListForUser().catch(error => {
      console.log(error);
      hashHistory.push('login');
    });
  }

  unlockLoading = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    const { children } = this.props;
    const { loading, locationPathname } = this.state;

    if (loading) {
      return <LoaderOverlay withBackground />;
    }

    return <Drawer locationPathname={locationPathname}>{children}</Drawer>;
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
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCore);
