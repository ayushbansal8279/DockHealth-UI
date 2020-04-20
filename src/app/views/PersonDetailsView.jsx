import { Grid, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
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
import { themeMontserratNormal } from '../theme-montserrat';
import PersonInfoPanel from './PersonDetailsView.PersonInfoPanel';
import {
  BackButton,
  PersonDetailsViewHeader,
} from './PersonDetailsView.Styled';
import { SideClickListener } from '../components/patients/PatientsView.Styled';
import { closeDrawer } from '../actions/task-drawer-actions';

class PersonDetailsView extends PureComponent {
  state = {
    fetching: true,
    personData: {},
  };

  async componentDidMount() {
    const {
      peopleActions,
      routeParams: { userIdentifier },
      setHeader,
    } = this.props;

    setHeader({
      layout: [
        {
          key: 'generic-header',
          component: <GenericHeader>People</GenericHeader>,
        },
      ],
    });

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });

    let personData = {};

    try {
      personData = await peopleActions.getUserById(userIdentifier);

      this.setState(
        {
          personData,
        },
        () => {
          if (personData?.userIdentifier) {
            this.handleFilterChange(undefined, undefined);
          }
        },
      );
    } catch {
      noop();
    }

    if (personData?.firstName || personData?.lastName) {
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
      personData?.userIdentifier,
      undefined,
      sortBy,
      filterBy,
      'INCOMPLETE',
    );
    taskActions.getCountOfTasksAssignedToSpecificUser(
      personData?.userIdentifier,
      undefined,
      filterBy,
      'COMPLETE',
    );
  };

  handleCompletedTasksRequest = (
    selectedTaskListIdentifier,
    filterBy,
    sortBy,
  ) => {
    const { taskActions } = this.props;
    const { personData } = this.state;

    return taskActions.getTasksAssignedToSpecificUser(
      personData?.userIdentifier,
      selectedTaskListIdentifier,
      sortBy,
      filterBy,
      'COMPLETE',
      true,
    );
  };

  onSideClick = () => {
    const { clearTask, closeTaskDrawer } = this.props;

    closeTaskDrawer();
    clearTask();
  };

  render() {
    const { personData } = this.props;
    const { fetching } = this.state;

    const memberName = `${personData?.firstName ?? ''} ${personData?.lastName ??
      ''}`.trim();

    return (
      !fetching && (
        <>
          <PersonDetailsViewHeader>
            <ThemeProvider theme={themeMontserratNormal}>
              <Typography variant="h2">
                <Link to="people">
                  <BackButton>
                    <img src={BackIcon} alt="Go back to people list" />
                  </BackButton>
                </Link>
                {memberName}
              </Typography>
            </ThemeProvider>
          </PersonDetailsViewHeader>
          <Grid direction="row" container>
            <SideClickListener onClick={this.onSideClick} />
            <Grid direction="column" alignItems="center" container>
              {personData && <PersonInfoPanel personData={personData} />}
              <TaskListSearchContainer
                searchPerformed
                onFilter={this.handleFilterChange}
                onCompletedTasksRequest={this.handleCompletedTasksRequest}
                showToolbar
                showFilterStats={false}
                showNotifications={false}
                showMembers={false}
                paneled
              />
            </Grid>
            <SideClickListener onClick={this.onSideClick} />
          </Grid>
        </>
      )
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
    closeTaskDrawer: () => closeDrawer()(dispatch),
    clearTask: () => TaskActions.storeAsCurrentTask(null)(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetailsView);
