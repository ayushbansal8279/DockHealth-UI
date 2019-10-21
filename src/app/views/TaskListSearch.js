import ProgressIcon from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

class TaskListSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      searchPerformed: false,
    };
  }

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'TaskListSearch',
    });
  }

  searchUpdated = term => {
    this.setState({ searchTerm: term.target.value });
  };

  searchTasks = () => {
    this.props.taskActions.loading();
    this.props.taskActions.searchTasks(
      this.state.searchTerm,
      undefined,
      undefined,
      'INCOMPLETE',
    );
    this.setState({ searchPerformed: true });
  };

  getCompletedTasks = () => {
    this.props.taskActions.loading();
    this.props.taskActions.searchTasks(
      this.state.searchTerm,
      undefined,
      undefined,
      'COMPLETE',
    );
    this.setState({ searchPerformed: true });
  };

  getListTasks = (sortBy, filterBy) => {
    this.props.taskActions.loading();
    this.props.taskActions.searchTasks(
      this.state.searchTerm,
      sortBy,
      filterBy,
      'INCOMPLETE',
    );
  };

  handleKeyPress = event => {
    if (event.key == 'Enter') {
      this.props.taskActions.loading();
      this.props.taskActions.searchTasks(
        this.state.searchTerm,
        undefined,
        undefined,
        'INCOMPLETE',
      );
      this.setState({ searchPerformed: true });
    }
  };

  handleAddTask = () => {
    this.props.taskActions.taskToState(null);
    openAddForm();
  };

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
                <h3>Search</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <div className="wrapper list-filter row collapse align-middle align-right " />
          </div>
        </div>

        <div className="wrapper-search">
          <div className="row expanded collapse">
            <div className="large-2 columns" />
            <div className="large-8 columns">
              <div className="input-group searchbar">
                <input
                  className="input-field search-field expand-search"
                  id="task-search-field"
                  type="search"
                  placeholder="Search tasks"
                  onKeyPress={this.handleKeyPress}
                  onChange={this.searchUpdated}
                  value={this.state.searchTerm}
                />
                <div className="input-group-button">
                  <button className="button">
                    <svg
                      onClick={this.searchTasks}
                      id="task-search-button"
                      className="icon"
                    >
                      <use xlinkHref="#icon-search" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="large-2 columns" />
          </div>

          {this.props.isFetching && (
            <FadeContainer>
              <Fade
                in={this.props.isFetching}
                unmountOnExit
                style={{
                  transitionDelay: this.props.isFetching ? '800ms' : '0ms',
                }}
              >
                <ProgressIcon />
              </Fade>
            </FadeContainer>
          )}
          <TaskListSearchContainer
            searchPerformed={this.state.searchPerformed}
            getCompletedTasks={this.getCompletedTasks}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.taskState.tasks,
    isFetching: state.taskState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearch);
