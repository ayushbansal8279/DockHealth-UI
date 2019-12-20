import Grid from '@material-ui/core/Grid';
import { times } from 'ramda';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';

import { setHeader as setHeaderRaw } from '../actions/header-actions';
import * as TaskActions from '../actions/task-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import GenericHeader from '../components/common/GenericHeader';
import TaskListSearchContainer from '../components/LEGACY_list/TaskListSearchContainer';
import {
  HeadsUpAreaContainer,
  HeadsUpButtonsContainer,
  HeadsUpSectionButton,
  HeadsUpSectionButtonCount,
  HeadsUpSectionButtonLabel,
  HeadsUpSectionContainer,
  HeadsUpSectionDivider,
  HeadsUpSectionGrid,
  HeadsUpSectionHeader,
  HeadsUpSectionLabelInnerContainer,
  HeadsUpSectionLabelOuterContainer,
} from '../components/taskView/HeadsUpArea.Styled';
import BackIcon from '../img/back.svg';
import { BackButton } from './PersonTaskList.Styled';
import HeadsUpAreaChart from '../components/taskView/HeadsUpArea.chart';

const tabData = [
  {
    key: 'Incomplete_TaskList_Count',
    label: 'All active tasks',
    filter: '',
    value: 0,
  },
  {
    key: 'HighPriority_TaskList_Count',
    label: 'Flagged',
    filter: 'FLAGGED',
    value: 0,
  },
  {
    key: 'DueToday_TaskList_Count',
    label: 'Due today',
    filter: 'DUE_TODAY',
    value: 0,
  },
  {
    key: 'OverDue_TaskList_Count',
    label: 'Overdue',
    filter: 'OVERDUE',
    value: 0,
  },
  {
    key: 'Completed_TaskList_Count',
    label: 'Completed this week',
    filter: 'COMPLETED_THIS_WEEK',
    value: 0,
  },
];

const dummyNewTasksByDate = [
  {
    date: '2019-12-18T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 2,
  },
  {
    date: '2019-12-12T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 3,
  },
  {
    date: '2019-12-11T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 1,
  },
  {
    date: '2019-12-02T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 3,
  },
  {
    date: '2019-11-29T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 13,
  },
  {
    date: '2019-11-26T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 2,
  },
  {
    date: '2019-11-22T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 16,
  },
  {
    date: '2019-11-21T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 3,
  },
  {
    date: '2019-11-20T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 4,
  },
  {
    date: '2019-11-19T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 15,
  },
  {
    date: '2019-11-18T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 5,
  },
  {
    date: '2019-11-16T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 5,
  },
  {
    date: '2019-11-15T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 6,
  },
  {
    date: '2019-11-14T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 1,
  },
  {
    date: '2019-11-13T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 1,
  },
  {
    date: '2019-11-08T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 3,
  },
  {
    date: '2019-11-07T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 5,
  },
  {
    date: '2019-11-05T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 1,
  },
  {
    date: '2019-10-31T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 2,
  },
  {
    date: '2019-10-28T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 2,
  },
  {
    date: '2019-10-25T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 7,
  },
  {
    date: '2019-10-24T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 1,
  },
  {
    date: '2019-10-17T00:00:00.000+0000',
    metricName: 'NewTasks',
    metricValue: 6,
  },
];

class TaskListSearch extends PureComponent {
  state = {
    filterBy: '',
    searchTerm: '',
  };

  tabButtonReferences = times(() => React.createRef(), tabData.length);

  componentDidMount() {
    const {
      taskActions,
      routeParams: { memberName, personId },
      setHeader,
    } = this.props;

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });

    taskActions.loading();
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      undefined,
      undefined,
      'INCOMPLETE',
    );
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      undefined,
      undefined,
      'COMPLETE',
    );

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
  }

  handleKeyPress = event => {
    const { taskActions } = this.props;
    const { searchTerm } = this.state;

    if (event.key === 'Enter') {
      taskActions.searchTasks(searchTerm, 'INCOMPLETE');
    }
  };

  handleFilterChange = (filterBy, sortBy) => {
    const {
      taskActions,
      routeParams: { personId },
    } = this.props;

    this.setState({
      filterBy,
    });

    taskActions.loading();
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      sortBy,
      filterBy,
      'INCOMPLETE',
    );
    taskActions.getTasksAssignedToSpecificUser(
      personId,
      undefined,
      sortBy,
      filterBy,
      'COMPLETE',
    );
  };

  toggleHUD = () => {
    this.setState(
      ({ displayHUD }) => ({
        displayHUD: !displayHUD,
      }),
      () => {
        // forced update to initialize tab button animation
        this.forceUpdate();
      },
    );
  };

  renderTab = () =>
    tabData.map(({ filter, key, label, value }, index, elements) => {
      const { filterBy } = this.state;
      const innerLabelReference = this.tabButtonReferences[index];
      const isFilterCurrentlySelected = filter === filterBy;

      const innerLabelAnimated =
        innerLabelReference.current?.scrollWidth >
        innerLabelReference.current?.offsetWidth;

      return (
        <HeadsUpSectionButton
          onClick={() => {
            this.handleFilterChange(filter, undefined);
          }}
          key={key}
          active={isFilterCurrentlySelected}
          elementsCount={elements.length}
        >
          <HeadsUpSectionButtonCount active={isFilterCurrentlySelected}>
            {value}
          </HeadsUpSectionButtonCount>
          <HeadsUpSectionButtonLabel active={isFilterCurrentlySelected}>
            <HeadsUpSectionLabelOuterContainer>
              <HeadsUpSectionLabelInnerContainer
                animated={innerLabelAnimated}
                ref={innerLabelReference}
                scrollWidth={innerLabelReference.current?.scrollWidth}
              >
                {label}
              </HeadsUpSectionLabelInnerContainer>
            </HeadsUpSectionLabelOuterContainer>
          </HeadsUpSectionButtonLabel>
        </HeadsUpSectionButton>
      );
    });

  renderCurrentTrendTab = ({ taskListStats }) => {
    const taskListTrends = taskListStats.newTasksByDate;

    if (taskListStats && taskListTrends) {
      return <HeadsUpAreaChart taskListTrends={taskListTrends} />;
    }
    return null;
  };

  render() {
    const { searchPerformed, displayHUD } = this.state;

    return (
      <Grid direction="column" alignItems="center" container>
        {displayHUD && (
          <HeadsUpAreaContainer>
            <Grid container>
              <HeadsUpSectionGrid container item xs={8}>
                <HeadsUpSectionContainer>
                  <div>
                    <HeadsUpSectionHeader>
                      <div>Heads Up</div>
                    </HeadsUpSectionHeader>
                    <HeadsUpSectionDivider />
                  </div>
                  <HeadsUpButtonsContainer>
                    {this.renderTab()}
                  </HeadsUpButtonsContainer>
                </HeadsUpSectionContainer>
              </HeadsUpSectionGrid>
              <HeadsUpSectionGrid item xs={4}>
                <HeadsUpSectionContainer>
                  <div>
                    <HeadsUpSectionHeader>
                      <span>Daily</span>
                    </HeadsUpSectionHeader>
                    <HeadsUpSectionDivider />
                  </div>
                  <HeadsUpButtonsContainer>
                    {this.renderCurrentTrendTab({
                      taskListStats: {
                        newTasksByDate: dummyNewTasksByDate,
                      },
                    })}
                  </HeadsUpButtonsContainer>
                </HeadsUpSectionContainer>
              </HeadsUpSectionGrid>
            </Grid>
          </HeadsUpAreaContainer>
        )}
        <TaskListSearchContainer
          searchPerformed={searchPerformed}
          onFilter={this.handleFilterChange}
          showSortingStats
          toggleHUD={this.toggleHUD}
        />
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
