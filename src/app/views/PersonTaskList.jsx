import Grid from '@material-ui/core/Grid';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { setHeader as setHeaderRaw } from '../actions/header-actions';
import * as PeopleActions from '../actions/people-actions';
import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import GenericHeader from '../components/common/GenericHeader';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';
import { noop } from '../helpers/utility-functions';
import BackIcon from '../img/back.svg';
import PersonInfoPanel from './PersonTaskList.PersonInfoPanel';
import { BackButton } from './PersonTaskList.Styled';

class TaskListSearch extends PureComponent {
  state = {
    fetching: true,
    personData: {},
  };

  async componentDidMount() {
    const {
      peopleActions,
      routeParams: { email },
      setHeader,
    } = this.props;

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });

    let personData = {};

    try {
      personData = await peopleActions.getUserByEmail({ email });

      this.setState(
        {
          personData,
        },
        () => {
          if (parseInt(personData.userIdentifier, 10)) {
            this.handleFilterChange(undefined, undefined);
          }
        },
      );
    } catch {
      noop();
    }

    let memberName = '';

    if (personData.firstName || personData.lastName) {
      memberName = `${personData.firstName} ${personData.lastName}`.trim();

      setHeader({
        layout: [
          {
            key: 'generic-header',
            component: (
              <GenericHeader isFetching={false}>
                <Link to="people">
                  <BackButton>
                    <img src={BackIcon} alt="Go back to people list" />
                  </BackButton>
                </Link>
                <span>{memberName}</span>
              </GenericHeader>
            ),
          },
        ],
      });

      this.setState({
        fetching: false,
      });
    } else {
      hashHistory.push('people');
    }
  }

  handleFilterChange = (filterBy, sortBy) => {
    const { taskActions } = this.props;
    const { personData } = this.state;

    taskActions.loading();
    taskActions.hideCompletedTasks();

    taskActions.getTasksAssignedToSpecificUser(
      personData.userIdentifier,
      undefined,
      sortBy,
      filterBy,
      'INCOMPLETE',
    );
    // taskActions.getTasksAssignedToSpecificUser(
    //   personData.userIdentifier,
    //   undefined,
    //   sortBy,
    //   filterBy,
    //   'COMPLETE',
    // );
  };

  handleCompletedTasksRequest = (
    selectedTaskListIdentifier,
    filterBy,
    sortBy,
  ) => {
    const { taskActions } = this.props;
    const { personData } = this.state;

    taskActions.getTasksAssignedToSpecificUser(
      personData.userIdentifier,
      selectedTaskListIdentifier,
      sortBy,
      filterBy,
      'COMPLETE',
      true,
    );
  };

  render() {
    const { personData } = this.props;
    const { fetching } = this.state;

    return (
      <Grid direction="column" alignItems="center" container>
        {!fetching && (
          <>
            {personData && <PersonInfoPanel personData={personData} />}
            <TaskListSearchContainer
              searchPerformed
              onFilter={this.handleFilterChange}
              onCompletedTasksRequest={this.handleCompletedTasksRequest}
              showSortingStats
            />
          </>
        )}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.taskState.tasks,
    isFetching: state.taskState.isFetching,
    personData: state.peopleState.personData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
    peopleActions: bindActionCreators(PeopleActions, dispatch),
    setHeader: setHeaderRaw(dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearch);
