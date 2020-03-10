import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import debounce from 'lodash.debounce';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setHeader as setHeaderRaw } from '../actions/header-actions';
import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import GenericHeader from '../components/common/GenericHeader';
import SafariFixGrid from '../components/common/SafariFixGrid';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';
import {
  SearchFieldContainer,
  SearchPersonIcon,
  StyledSearch,
} from './TaskListSearch.Styled';

class TaskListSearch extends PureComponent {
  state = {
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
          key: 'generic-header',
          component: (
            <GenericHeader>
              <Typography variant="h4">Search</Typography>
            </GenericHeader>
          ),
        },
      ],
    });
  };

  searchTasks = () => {
    this.getListTasks({ status: 'INCOMPLETE' });
    this.getListTasks({ status: 'COMPLETE' });
  };

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

  handleAddTask = () => {
    const { taskActions } = this.props;
    taskActions.taskToState(null);
    openAddForm();
  };

  handleSearch = event => {
    this.setState(
      {
        searchTerm: event?.target?.value ?? '',
        searchPerformed: true,
      },
      () => {
        const { searchTerm } = this.state;
        const { taskActions } = this.props;

        if (searchTerm) {
          this.debouncedSearchTasks();
        } else {
          this.debouncedSearchTasks.cancel();
          taskActions.clearSearchTasks({ status: 'COMPLETE' });
          taskActions.clearSearchTasks({ status: 'INCOMPLETE' });
        }
      },
    );
  };

  render() {
    const { searchPerformed } = this.state;

    return (
      <Grid container direction="column" alignItems="center">
        <SafariFixGrid item xs={12} container justify="center">
          <SearchPersonIcon />
        </SafariFixGrid>
        <SafariFixGrid item xs={12} container justify="center">
          <SearchFieldContainer>
            <StyledSearch onChange={this.handleSearch} />
          </SearchFieldContainer>
        </SafariFixGrid>
        <SafariFixGrid item xs={12} container justify="center">
          <TaskListSearchContainer
            searchPerformed={searchPerformed}
            onFilter={this.handleFilterChange}
            globalSearch
          />
        </SafariFixGrid>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearch);
