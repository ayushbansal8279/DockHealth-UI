import { Grid, Typography } from '@material-ui/core';
import debounce from 'lodash.debounce';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setHeader as setHeaderRaw } from '../actions/header-actions';
import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import GenericHeader from '../components/common/GenericHeader';
import SafariFixGrid from '../components/common/SafariFixGrid';
import Spacing from '../components/common/Spacing';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';
import TaskCheckbox from '../components/task/TaskCheckbox';
import Search from '../components/taskView/Search';
import { SearchFieldContainer } from './TaskListSearch.Styled';

class TaskListSearch extends PureComponent {
  state = {
    isSearching: false,
    searchCompletedTasks: false,
    searchTerm: '',
    searchPerformed: false,
  };

  debouncedSearchTasks = debounce(() => this.searchTasks(), 300);

  componentDidMount() {
    const {
      taskActions: { resetTaskSearch },
    } = this.props;

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'TaskListSearch',
    });

    resetTaskSearch();
    this.resetHeader();
  }

  resetHeader = () => {
    const { setHeader } = this.props;

    setHeader({
      layout: [
        {
          key: 'search-header',
          component: <GenericHeader>Search</GenericHeader>,
        },
      ],
    });
  };

  setSearchCompletedTasks = (newValue, callback = () => {}) => {
    this.setState(
      {
        searchCompletedTasks: newValue,
        isSearching: true,
      },
      callback,
    );
  };

  searchTasks = async () => {
    const { searchCompletedTasks } = this.state;

    await Promise.all([
      this.getListTasks({ status: 'INCOMPLETE' }),
      searchCompletedTasks
        ? this.getListTasks({ status: 'COMPLETE' })
        : Promise.resolve(),
    ]);

    this.setState({
      isSearching: false,
    });
  };

  getListTasks = ({
    sortBy = undefined,
    filterBy = undefined,
    status = 'INCOMPLETE',
  } = {}) => {
    const { taskActions } = this.props;
    const { searchTerm } = this.state;
    taskActions.loading();
    return taskActions.searchTasks(searchTerm, sortBy, filterBy, status);
  };

  handleAddTask = () => {
    const { taskActions } = this.props;
    taskActions.taskToState(null);
    openAddForm();
  };

  handleSearch = event => {
    this.setState(
      {
        searchTerm: event?.target?.value ?? '',
        searchPerformed: Boolean(event?.target?.value),
      },
      () => {
        const { searchTerm } = this.state;
        const { taskActions } = this.props;

        if (searchTerm) {
          this.setState(
            {
              isSearching: true,
            },
            () => {
              this.debouncedSearchTasks();
            },
          );
        } else {
          this.setState(
            {
              isSearching: false,
            },
            () => {
              this.debouncedSearchTasks.cancel();
              taskActions.clearSearchTasks({ status: 'COMPLETE' });
              taskActions.clearSearchTasks({ status: 'INCOMPLETE' });
            },
          );
        }
      },
    );
  };

  render() {
    const {
      isSearching,
      searchPerformed,
      searchTerm,
      searchCompletedTasks,
    } = this.state;

    return (
      <Grid container direction="column" alignItems="center">
        <Spacing vertical={6} />
        <SearchFieldContainer>
          <SafariFixGrid item xs={12} container justify="center" spacing={2}>
            <Grid item xs={12} sm={12} md={6} container alignItems="center">
              <Search
                fullWidth
                onChange={this.handleSearch}
                value={searchTerm}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              container
              alignItems="center"
              wrap="nowrap"
            >
              <TaskCheckbox
                size={22}
                onChange={event => {
                  this.setSearchCompletedTasks(
                    event.target.checked,
                    this.searchTasks,
                  );
                }}
                checked={searchCompletedTasks}
              />
              <Spacing horizontal={3} />
              <Typography variant="body1" color="textSecondary">
                Search completed tasks
              </Typography>
            </Grid>
          </SafariFixGrid>
        </SearchFieldContainer>
        <SafariFixGrid item xs={12} container justify="center">
          <TaskListSearchContainer
            searchPerformed={searchPerformed}
            onFilter={this.handleFilterChange}
            isSearching={isSearching}
            globalSearch
          />
        </SafariFixGrid>
        <Spacing vertical={6} />
      </Grid>
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
    setHeader: setHeaderRaw(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListSearch);
