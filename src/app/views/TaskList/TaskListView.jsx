import {
  Backdrop,
  Button,
  Dialog,
  Grid,
  Popover,
  ClickAwayListener,
} from '@material-ui/core';
import { Add, Close, List } from '@material-ui/icons';
import clsx from 'clsx';
import { isEmpty } from 'ramda';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { useCss } from 'react-use';
import { bindActionCreators } from 'redux';
import { setHeader } from 'actions/header-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import AdornedButton from 'components/common/AdornedButton';
import Loader from 'components/common/Loader/Loader';
import GenericHeader from 'components/common/GenericHeader';
import HelpfulTipsDialog from 'components/common/HelpfulTipsDialog';
import PageContentHeader from 'components/common/PageContentHeader';
import SafariFixGrid from 'components/common/SafariFixGrid';
import Spacing from 'components/common/Spacing';
import TipsButton from 'components/common/TipsButton';
import TipsContentHeader from 'components/common/TipsContentHeader';
import ListsComponent from 'components/LEGACY_list/ListsComponent';
import PendingListsComponent from 'components/LEGACY_list/PendingListsComponent';
import {
  onTaskListDeleted,
  onTaskListInvitationAccepted,
  onTaskListInvitationRejected,
  onTaskListLeft,
} from 'helpers/ga-event-helper';
import pusherInstance from 'helpers/pusher-instance';
import TipNextStepIcon from 'img/tip-next-step-icon.svg';
import TipPencilIcon from 'img/tip-pencil-icon.svg';
import TaskListTip1 from 'img/tips/task-list/task-list-1.svg';
import TaskListTip2 from 'img/tips/task-list/task-list-2.svg';
import TaskListTip3 from 'img/tips/task-list/task-list-3.svg';
import TaskListTour1 from 'img/tour/task-list/task-list-1.svg';
import TaskListTour2 from 'img/tour/task-list/task-list-2.svg';
import TaskListTour3 from 'img/tour/task-list/task-list-3.svg';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import ListForm from 'components/ListForm/ListForm';
import {
  BlockItemContainer,
  LoaderContainer,
  NoListsAvailableContainer,
  NoListsIconContainer,
  StyledCollapse,
  TaskListTipsFooterContainer,
  TaskListTipSmallTextContainer,
  TaskListTipTextContainer,
  TaskListViewTipsContainer,
  TaskListViewWrapper,
  TipsImage,
  TopMessageContainer,
  TipsContainer,
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

const TaskListViewTip = ({ topLabel, titleLabel, children }) => {
  const childContentClassName = useCss({
    '&&': {
      lineHeight: '1.0625rem',
    },
  });

  return (
    <TaskListTipTextContainer>
      <Grid container alignItems="center" wrap="nowrap">
        <img alt="pencil" src={TipPencilIcon} />
        <Spacing horizontal={3} />
        <TaskListTipSmallTextContainer>
          <RobotoTypography variant="h4" weight="bold">
            {topLabel}
          </RobotoTypography>
        </TaskListTipSmallTextContainer>
      </Grid>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4" weight="bold">
        {titleLabel}
      </MontserratTypography>
      <Spacing vertical={3} />
      <TaskListTipSmallTextContainer>
        <RobotoTypography
          variant="h4"
          weight="500"
          className={childContentClassName}
        >
          {children}
        </RobotoTypography>
      </TaskListTipSmallTextContainer>
    </TaskListTipTextContainer>
  );
};

class TaskListView extends PureComponent {
  state = {
    listFormOpen: false,
    hasStartedFetching: false,
    channelName: null,
    tipsOpen: localStorage.getItem(STORAGE_TASK_LIST_TIPS_OPEN) || 'true',
    tipsModalOpen: false,
  };

  tipsButtonReference = React.createRef(null);

  addTaskButtonReference = React.createRef(null);

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

  closeTips = () => {
    this.setState({
      tipsOpen: 'false',
    });
  };

  toggleTips = () => {
    this.setState(({ tipsOpen: previousTipsOpen }) => ({
      tipsOpen: previousTipsOpen === 'true' ? 'false' : 'true',
    }));
  };

  showTipsModal = () => {
    this.closeTips();
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
      currentTaskList,
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

    const hasCovidList =
      currentUser.referralCode && currentUser.referralCode === 'covid19';

    return (
      <TaskListViewWrapper>
        {hasStartedFetching && !isFetching && (
          <Grid container direction="column" alignItems="center" spacing={1}>
            <PageContentHeader>
              <TipsButton
                active={tipsOpen === 'true'}
                tipsButtonReference={this.tipsButtonReference}
                toggleTips={this.toggleTips}
              />
              <AdornedButton
                adornment={
                  taskListFormOpen && !currentTaskList ? <Close /> : <Add />
                }
                onClick={this.addTaskList}
                innerRef={this.addTaskButtonReference}
                style={{
                  zIndex: 110,
                }}
              >
                ADD A LIST
              </AdornedButton>
            </PageContentHeader>
            {tipsOpen === 'true' && (
              <ClickAwayListener onClickAway={this.closeTips}>
                <TipsContainer>
                  <TipsContentHeader
                    arrowAnchorElement={this.tipsButtonReference.current}
                    closeHeader={this.closeTips}
                    footerContent={
                      <TaskListTipsFooterContainer>
                        <Grid container direction="column" justify="flex-end">
                          <MontserratTypography
                            weight="normal"
                            textDecoration="underline"
                            variant="h4"
                            onClick={this.showTipsModal}
                          >
                            TAKE THE TOUR
                          </MontserratTypography>
                          <Spacing vertical={4} />
                        </Grid>
                      </TaskListTipsFooterContainer>
                    }
                  >
                    <TaskListViewTipsContainer>
                      <TipsImage alt="step 1" src={TaskListTip1} />
                      <div />
                      <TipsImage alt="step 2" src={TaskListTip2} />
                      <div />
                      <TipsImage alt="step 3" src={TaskListTip3} />
                      <TaskListViewTip
                        topLabel="Name lists by patient or provider to keep tasks organized."
                        titleLabel="Start by creating a list."
                      >
                        To create a new list, simply click the button in the
                        upper right corner of the window. Name your list by
                        patient or clinic or however you’d like to organize your
                        tasks. After the list is created, you can add tasks to
                        that List.
                      </TaskListViewTip>
                      <Grid container justify="center" alignItems="center">
                        <img alt="next step" src={TipNextStepIcon} />
                      </Grid>
                      <TaskListViewTip
                        topLabel="Invite others to a list to collaborate and share tasks."
                        titleLabel="Then, invite members to your list."
                      >
                        Once you have created your list you can invite other
                        members. Invite members by clicking on the three dots on
                        the right side of the List. Select “Invite Members” from
                        the menu.
                      </TaskListViewTip>
                      <Grid container justify="center" alignItems="center">
                        <img alt="next step" src={TipNextStepIcon} />
                      </Grid>
                      <TaskListViewTip
                        topLabel="Keep your lists updated to stay organized."
                        titleLabel="To edit/delete lists, click the dots!"
                      >
                        If you are an admin of a list you can delete or edit a
                        list by clicking the three dots to the right of the list
                        . A drop-down menu will appear and give you the choice
                        to delete the list or to edit.
                      </TaskListViewTip>
                    </TaskListViewTipsContainer>
                  </TipsContentHeader>
                </TipsContainer>
              </ClickAwayListener>
            )}
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
            <Backdrop
              open={taskListFormOpen && !currentTaskList}
              style={{ zIndex: 100 }}
            >
              <Popover
                open={taskListFormOpen && !currentTaskList}
                anchorEl={this.addTaskButtonReference.current}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={() => this.setListFormOpen(false)}
              >
                <ListForm setListFormOpen={this.setListFormOpen} />
              </Popover>
            </Backdrop>
            <Dialog
              open={taskListFormOpen && currentTaskList}
              fullWidth
              onClose={() => this.setListFormOpen(false)}
              PaperProps={{
                elevation: 0,
                square: true,
                style: {
                  maxWidth: '40rem',
                },
              }}
            >
              <ListForm setListFormOpen={this.setListFormOpen} />
            </Dialog>
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
                      <LoaderContainer>
                        <Loader />
                      </LoaderContainer>
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
              </>
            ) : (
              <StyledCollapse in={!taskListFormOpen} timeout={250}>
                <NoListsAvailableContainer>
                  <Spacing vertical={6} />
                  <Spacing vertical={6} />
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
    currentTaskList: state.taskListState.currentList,
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
