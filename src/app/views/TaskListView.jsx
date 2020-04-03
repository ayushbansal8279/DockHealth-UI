import { Button, Grid } from '@material-ui/core';
import { Add, List } from '@material-ui/icons';
import clsx from 'clsx';
import { isEmpty } from 'ramda';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { setHeader } from '../actions/header-actions';
import * as InvitationActions from '../actions/invitation-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import AdornedButton from '../components/common/AdornedButton';
import CubesLoader from '../components/common/CubesLoader';
import GenericHeader from '../components/common/GenericHeader';
import HelpfulTipsDialog from '../components/common/HelpfulTipsDialog';
import PageContentHeader from '../components/common/PageContentHeader';
import SafariFixGrid from '../components/common/SafariFixGrid';
import Spacing from '../components/common/Spacing';
import TipsContentHeader from '../components/common/TipsContentHeader';
import ListsComponent from '../components/LEGACY_list/ListsComponent';
import PendingListsComponent from '../components/LEGACY_list/PendingListsComponent';
import {
  onTaskListDeleted,
  onTaskListInvitationAccepted,
  onTaskListInvitationRejected,
  onTaskListLeft,
} from '../helpers/ga-event-helper';
import pusherInstance from '../helpers/pusher-instance';
import Lightbulb from '../img/lightbulb-grey.svg';
import TaskListTip1 from '../img/tips/task-list/task-list-1.png';
import TaskListTip2 from '../img/tips/task-list/task-list-2.png';
import TaskListTip3 from '../img/tips/task-list/task-list-3.png';
import TaskListTour1 from '../img/tour/task-list/task-list-1.png';
import TaskListTour2 from '../img/tour/task-list/task-list-2.png';
import TaskListTour3 from '../img/tour/task-list/task-list-3.png';
import { RobotoTypography } from '../theme';
import { MontserratTypography } from '../theme-montserrat';
import AddListForm from './TaskListView.AddListForm';
import { FormSpacing } from './TaskListView.AddListForm.Components';
import {
  BlockItemContainer,
  CubesLoaderContainer,
  NoListsAvailableContainer,
  NoListsIconContainer,
  StyledCollapse,
  TaskListViewWrapper,
  TipsImage,
  TopMessageContainer,
} from './TaskListView.Styled';

const STORAGE_TASK_LIST_TIPS_OPEN = 'STORAGE_TASK_LIST_TIPS_OPEN';
const STORAGE_NEW_USER_FIRST_TIME = 'STORAGE_NEW_USER_FIRST_TIME';

const ICONS = {
  ASSIGN_TO: 'icon-assign-to',
  CALENDAR: 'icon-calendar',
  CHECKMARK: 'icon-checkmark',
  EMAIL: 'icon-email',
  FLAG: 'icon-flag',
  LIST: 'icon-list',
};

const getTourStep = (contentImage, displayDescription) => ({
  content: <img alt="step 1" src={contentImage} />,
  title: 'A QUICK TOUR OF THE LISTS PAGE',
  description: displayDescription
    ? 'The list page is your central station for getting to the lists that organize tasks. You can create new lists or get invited to lists that other people in your organization have created.'
    : '',
});

class TaskListView extends PureComponent {
  state = {
    listFormOpen: false,
    hasStartedFetching: false,
    channelName: null,
    tipsOpen: localStorage.getItem(STORAGE_TASK_LIST_TIPS_OPEN) || 'true',
    tipsModalOpen: false,
  };

  tipsButtonReference = React.createRef(null);

  componentDidMount() {
    const { taskListAction, invitationAction, currentUser } = this.props;
    taskListAction.loading();
    invitationAction.findPendingTaskListsForUser();
    taskListAction.getGenericListCounts();
    taskListAction.getTaskListForUser();

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'Lists',
    });

    this.setState({
      hasStartedFetching: true,
    });
    this.resetHeader();

    if (localStorage.getItem(STORAGE_NEW_USER_FIRST_TIME) === 'true') {
      this.showTipsModal();
    }

    const currentUserIdentifier = currentUser.userIdentifier;
    const channelName = `dock-user-channel-${currentUserIdentifier}`;

    let channel = pusherInstance.channel(channelName);
    if (!channel) {
      channel = pusherInstance.subscribe(channelName);
    }

    this.setState({
      channelName,
    });

    channel.bind('task-update', () => {
      taskListAction.getGenericListCounts();
      taskListAction.getTaskListForUser();
    });
    channel.bind('tasklist-update', () => {
      taskListAction.getGenericListCounts();
      taskListAction.getTaskListForUser();
    });
  }

  componentDidUpdate(
    { isFetching: previousIsFetching },
    { tipsOpen: previousTipsOpen },
  ) {
    const { isFetching } = this.props;
    const { tipsOpen } = this.state;

    if (isFetching !== previousIsFetching) {
      this.resetHeader();
    }
    // needed for contextual menu
    enableFoundationForMultipleComponents('.item-list-wrapper', '.row');

    if (tipsOpen !== previousTipsOpen) {
      localStorage.setItem(STORAGE_TASK_LIST_TIPS_OPEN, tipsOpen);
    }
  }

  componentWillUnmount() {
    const { channelName } = this.state;

    let channel = pusherInstance.channel(channelName);
    if (channel) {
      channel = pusherInstance.unsubscribe(channelName);
    }
  }

  toggleTips = () => {
    this.setState(({ tipsOpen: previousTipsOpen }) => ({
      tipsOpen: previousTipsOpen === 'true' ? 'false' : 'true',
    }));
  };

  showTipsModal = () => {
    this.setState({
      tipsModalOpen: 'true',
    });
  };

  hideTipsModal = () => {
    this.setState({
      tipsModalOpen: 'false',
    });

    localStorage.setItem(STORAGE_NEW_USER_FIRST_TIME, false);
  };

  resetHeader = () => {
    const { setHeaderBound, isFetching } = this.props;
    setHeaderBound({
      layout: [
        {
          key: clsx('header', isFetching && 'fetching'),
          component: <GenericHeader>Lists</GenericHeader>,
        },
      ],
    });
  };

  setListFormOpen = listFormOpen => {
    this.setState({
      listFormOpen,
    });
  };

  addTaskList = () => {
    const { taskListAction } = this.props;
    const contentContainer = document.querySelector('#content-container');
    // eslint-disable-next-line no-unused-expressions
    contentContainer?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    taskListAction.setTaskListAsCurrentList(null);
    this.setListFormOpen(true);
  };

  editTaskList = taskList => {
    const { taskListAction } = this.props;
    const contentContainer = document.querySelector('#content-container');
    // eslint-disable-next-line no-unused-expressions
    contentContainer?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    taskListAction.setTaskListAsCurrentList(taskList);
    this.setListFormOpen(true);
  };

  deleteList = taskListIdentifier => {
    const { taskListAction } = this.props;
    return taskListAction.deleteTaskListById(taskListIdentifier).then(() => {
      taskListAction.getGenericListCounts();
      onTaskListDeleted();
    });
  };

  leaveList = taskListIdentifier => {
    const { taskListAction } = this.props;
    return taskListAction.leaveList(taskListIdentifier).then(() => {
      onTaskListLeft();
    });
  };

  acceptInviteToTaskList = taskList => {
    const { invitationAction, taskActions } = this.props;
    invitationAction.acceptInviteToTaskList(taskList);
    onTaskListInvitationAccepted();
    taskActions.resetTaskSearch();
    hashHistory.push(`tasks/${taskList.taskListIdentifier}`);
  };

  rejectInviteToTaskList = taskList => {
    const { invitationAction } = this.props;
    invitationAction.rejectInviteToTaskList(taskList);
    onTaskListInvitationRejected();
  };

  refresh = () => {
    const { taskListAction } = this.props;
    taskListAction.loading();
    taskListAction.getTaskListForUser();
  };

  onSelectHUD = link => {
    hashHistory.push(link);
  };

  getGenericProxyListMetricTarget = metricName => {
    switch (metricName) {
      case 'Inbox_Count': {
        return {
          iconName: ICONS.EMAIL,
          panelName: 'Inbox',
          listName: 'Inbox',
          filterBy: 'NONE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'AssignedToMe_Count': {
        return {
          iconName: ICONS.LIST,
          panelName: 'Assigned to me',
          listName: 'assigned_to_me',
          filterBy: 'NONE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'AssignedByMe_Count': {
        return {
          iconName: ICONS.ASSIGN_TO,
          iconColor: 'blue',
          panelName: 'Assigned by me',
          listName: 'assigned_by_me',
          filterBy: 'NONE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'HighPriority_Count': {
        return {
          iconName: ICONS.FLAG,
          iconColor: 'orange',
          panelName: 'Flagged',
          listName: 'assigned_to_me',
          filterBy: 'FLAGGED',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'Overdue_Count': {
        return {
          iconName: ICONS.CALENDAR,
          iconColor: 'red',
          panelName: 'Overdue',
          listName: 'assigned_to_me',
          filterBy: 'OVERDUE',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'DueToday_Count': {
        return {
          iconName: ICONS.CALENDAR,
          iconColor: 'blue',
          panelName: 'Due Today',
          listName: 'assigned_to_me',
          filterBy: 'DUE_TODAY',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'DueThisWeek_Count': {
        return {
          iconName: ICONS.CALENDAR,
          iconColor: 'green',
          panelName: 'Due This Week',
          listName: 'assigned_to_me',
          filterBy: 'DUE_THIS_WEEK',
          taskStatus: 'INCOMPLETE',
        };
      }
      case 'CompletedThisWeek_Count': {
        return {
          iconName: ICONS.CHECKMARK,
          iconColor: 'green',
          panelName: 'Completed This Week',
          listName: 'assigned_to_me',
          filterBy: 'COMPLETED_THIS_WEEK',
          taskStatus: 'COMPLETE',
        };
      }
      default: {
        return {};
      }
    }
  };

  getGenericListMetricData = metricName => {
    const metricProxyTarget = this.getGenericProxyListMetricTarget(metricName);

    return new Proxy(metricProxyTarget, {
      get: (target, name) => target[name] ?? '',
    });
  };

  onGenericListTileClick = ({
    listName,
    taskStatus,
    filterBy,
    metricValue,
  }) => () => {
    if (metricValue > 0) {
      const { taskActions } = this.props;
      taskActions.resetTaskSearch();
      this.onSelectHUD(
        listName === 'Inbox'
          ? 'tasks/Inbox'
          : `tasks/filtered/${listName}/${taskStatus}/${filterBy}`,
      );
    }
  };

  onClick = taskListIdentifier => {
    const { taskActions } = this.props;
    taskActions.resetTaskSearch();
    hashHistory.push(`/tasks/${taskListIdentifier}`);
  };

  renderGenericList = list => {
    const {
      iconName,
      iconColor,
      panelName,
      listName,
      filterBy,
      taskStatus,
    } = this.getGenericListMetricData(list.metricName);

    const { metricValue } = list;

    return (
      list.metricName.includes('Count') && (
        <Grid
          item
          xs={3}
          key={list.metricName}
          onClick={this.onGenericListTileClick({
            listName,
            taskStatus,
            filterBy,
            metricValue,
          })}
          style={{ cursor: 'pointer' }}
        >
          <BlockItemContainer>
            <svg className={`icon xlarge icon-header ${iconColor}`}>
              <use xlinkHref={`#${iconName}`} />
            </svg>
            <h6 className="border">{panelName}</h6>
            <h4>{list.metricValue}</h4>
          </BlockItemContainer>
        </Grid>
      )
    );
  };

  render() {
    const {
      isFetching,
      pendingTaskLists,
      taskLists,
      genericLists,
      currentUser,
    } = this.props;

    const {
      listFormOpen,
      hasStartedFetching,
      tipsOpen,
      tipsModalOpen,
    } = this.state;

    const taskListsEmpty = isEmpty(taskLists);

    const taskListFormOpen = !isFetching && listFormOpen;

    const anyTaskListExists = !isEmpty(pendingTaskLists) || !taskListsEmpty;

    const hasCovidList = Boolean(
      taskLists?.find(({ listName }) => listName.includes('COVID')),
    );

    return (
      <TaskListViewWrapper>
        {hasStartedFetching && !isFetching && (
          <Grid container direction="column" alignItems="center" spacing={1}>
            <PageContentHeader>
              <Button
                variant="text"
                color="inherit"
                size="small"
                onClick={this.toggleTips}
                innerRef={this.tipsButtonReference}
              >
                <img alt="lightbulb" src={Lightbulb} />
                <Spacing horizontal={2} />
                <RobotoTypography weight="normal">TIPS</RobotoTypography>
              </Button>
              <AdornedButton adornment={<Add />} onClick={this.addTaskList}>
                ADD A LIST
              </AdornedButton>
            </PageContentHeader>
            <StyledCollapse in={tipsOpen === 'true'} timeout={250}>
              <TipsContentHeader
                closeHeader={this.toggleTips}
                arrowAnchorElement={this.tipsButtonReference.current}
                onTakeTourClick={this.showTipsModal}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6} sm={6} md={6} lg={4}>
                    <TipsImage alt="step 1" src={TaskListTip1} />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={4}>
                    <TipsImage alt="step 2" src={TaskListTip2} />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={4}>
                    <TipsImage alt="step 3" src={TaskListTip3} />
                  </Grid>
                </Grid>
              </TipsContentHeader>
            </StyledCollapse>
            <HelpfulTipsDialog
              open={tipsModalOpen === 'true'}
              closeDialog={this.hideTipsModal}
            >
              {[
                getTourStep(TaskListTour1, true),
                getTourStep(TaskListTour2, false),
                getTourStep(TaskListTour3, false),
              ]}
            </HelpfulTipsDialog>
            <SafariFixGrid container item xs={12} justify="center">
              <Grid container item xs={9}>
                <StyledCollapse
                  in={taskListFormOpen}
                  timeout={250}
                  style={{
                    paddingTop: taskListFormOpen ? '40px' : '0px',
                    paddingBottom: taskListFormOpen ? '40px' : '0px',
                  }}
                >
                  <AddListForm
                    setListFormOpen={this.setListFormOpen}
                    cancelButtonShown={!taskListsEmpty}
                  />
                </StyledCollapse>
              </Grid>
            </SafariFixGrid>
            {anyTaskListExists ? (
              <>
                <SafariFixGrid container item xs={12} justify="center">
                  <Grid
                    container
                    item
                    xs={9}
                    justify="center"
                    direction="row"
                    spacing={1}
                  >
                    {genericLists?.map(this.renderGenericList)}
                  </Grid>
                </SafariFixGrid>
                <FormSpacing />
                <SafariFixGrid container item xs={12} justify="center">
                  <Grid container item xs={9} justify="center" direction="row">
                    {hasCovidList && (
                      <TopMessageContainer>
                        <MontserratTypography variant="h3">
                          In response to COVID-19, we&apos;ve taken the
                          essential CDC protocols and turned them into
                          actionable team task lists. Feel free to add your own
                          and remove these as needed.
                        </MontserratTypography>
                      </TopMessageContainer>
                    )}
                  </Grid>
                </SafariFixGrid>
                <SafariFixGrid
                  container
                  item
                  xs={12}
                  justify="center"
                  spacing={1}
                >
                  <Grid item xs={9}>
                    {isFetching ? (
                      <CubesLoaderContainer>
                        <CubesLoader size={40} />
                      </CubesLoaderContainer>
                    ) : (
                      <div className="item-list-wrapper list-wrapper-all-lists">
                        <PendingListsComponent
                          taskLists={pendingTaskLists}
                          acceptInviteToTaskList={this.acceptInviteToTaskList}
                          rejectInviteToTaskList={this.rejectInviteToTaskList}
                        />
                        <ListsComponent
                          taskLists={taskLists}
                          currentUser={currentUser}
                          editForm={this.editTaskList}
                          deleteList={this.deleteList}
                          leaveList={this.leaveList}
                          onClick={this.onClick}
                        />
                      </div>
                    )}
                  </Grid>
                </SafariFixGrid>
                <FormSpacing />
              </>
            ) : (
              <StyledCollapse in={!taskListFormOpen} timeout={250}>
                <NoListsAvailableContainer>
                  <NoListsIconContainer>
                    <List color="inherit" fontSize="large" />
                  </NoListsIconContainer>
                  <MontserratTypography variant="h4" weight="500">
                    GET STARTED BY
                  </MontserratTypography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={this.addTaskList}
                  >
                    <MontserratTypography variant="h6" weight="bold">
                      ADDING A LIST
                    </MontserratTypography>
                  </Button>
                </NoListsAvailableContainer>
              </StyledCollapse>
            )}
          </Grid>
        )}
      </TaskListViewWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    taskLists: state.taskListState.tasklist,
    pendingTaskLists: state.invitationState.pendingTasklists,
    genericLists: state.taskListState.genericLists,
    isFetching: state.taskListState.isFetching,
    currentUser: state.userState.userProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
    taskListAction: bindActionCreators(TaskListActions, dispatch),
    invitationAction: bindActionCreators(InvitationActions, dispatch),
    setHeaderBound: setHeader(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListView);
