import ProgressIcon from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';
import GenericHeader from '../components/common/GenericHeader';

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader
          isFetching={false}
          title="Search"
        />
        <Grid container alignItems="center" justify="flex-end" direction="row" style={{height: "88px", paddingTop: "10px", width: "80%"}}>
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
        </Grid>
        <div className="wrapper-search">

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
