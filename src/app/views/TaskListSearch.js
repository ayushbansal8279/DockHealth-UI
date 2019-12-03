import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import CubesLoader from '../components/common/CubesLoader';
import GenericHeader from '../components/common/GenericHeader';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

class TaskListSearch extends PureComponent {
  state = {
    searchTerm: '',
    searchPerformed: false,
  };

  componentDidMount() {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'TaskListSearch',
    });
    this.props.taskActions.resetTaskSearch();
  }

  searchUpdated = term => {
    this.setState({ searchTerm: term.target.value });
  };

  searchTasks = () => {
    this.getListTasks({ status: 'INCOMPLETE' });
    this.getListTasks({ status: 'COMPLETE' });
  };

  // getCompletedTasks = () => {
  //   this.getListTasks({ status: 'COMPLETE' });
  // };

  getListTasks = ({
    sortBy = undefined,
    filterBy = undefined,
    status = 'INCOMPLETE',
  } = {}) => {
    const { taskActions } = this.props;
    const { searchTerm } = this.state;
    taskActions.loading();
    taskActions.searchTasks(searchTerm, sortBy, filterBy, status);
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.searchTasks();
    }
  };

  handleAddTask = () => {
    const { taskActions } = this.props;
    taskActions.taskToState(null);
    openAddForm();
  };

  render() {
    const { isFetching } = this.props;
    const { searchPerformed, searchTerm } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader isFetching={false} title="Search" />
        <Grid
          container
          alignItems="center"
          justify="flex-end"
          direction="row"
          style={{ height: '88px', paddingTop: '10px', width: '80%' }}
        >
          <div className="input-group searchbar">
            <input
              className="input-field search-field expand-search"
              id="task-search-field"
              type="search"
              placeholder="Search tasks"
              onKeyPress={this.handleKeyPress}
              onChange={this.searchUpdated}
              value={searchTerm}
            />
            <div className="input-group-button">
              <button className="button" type="button">
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
        </Grid>
        <div className="wrapper-search">
          {isFetching && (
            <FadeContainer>
              <Fade
                in={isFetching}
                unmountOnExit
                style={{
                  transitionDelay: isFetching ? '800ms' : '0ms',
                }}
              >
                <CubesLoader size={40} />
              </Fade>
            </FadeContainer>
          )}
          <TaskListSearchContainer
            searchPerformed={searchPerformed}
            // getCompletedTasks={this.getCompletedTasks}
            onFilter={this.handleFilterChange}
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
