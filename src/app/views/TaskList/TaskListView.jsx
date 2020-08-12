import {
  Backdrop,
  Button,
  Dialog,
  Grid,
  Popover,
  ClickAwayListener,
} from '@material-ui/core';
import { Add, Close, List } from '@material-ui/icons';
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
import HelpfulTipsDialog from 'components/common/HelpfulTipsDialog';
import PageContentHeader from 'components/common/PageContentHeader';
import SafariFixGrid from 'components/common/SafariFixGrid';
import Spacing from 'components/common/Spacing';
import TipsButton from 'components/common/TipsButton';
import TipsContentHeader from 'components/common/TipsContentHeader';
import GenericHeader from 'components/common/GenericHeader';
import ListsComponent from 'components/LEGACY_list/ListsComponent';
// import PendingListsComponent from 'components/LEGACY_list/PendingListsComponent';
import {
  onTaskListDeleted,
  onTaskListInvitationRejected,
  onTaskListLeft,
  onListsTipsEvent,
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
    taskListAction.getTaskListForUser();

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'Lists',
    });

    this.setState({
      hasStartedFetching: true,
    });

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
      taskListAction.getTaskListForUser();
    });
    channel.bind('tasklist-update', () => {
      taskListAction.getTaskListForUser();
    });
  }

  componentDidUpdate({ tipsOpen: previousTipsOpen }) {
    const { tipsOpen } = this.state;

    // needed for contextual menu

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
    const { tipsOpen } = this.state;
    if (!tipsOpen) {
      onListsTipsEvent('Lists tips popover opened');
    }
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
    onListsTipsEvent('Lists tips popover closed');
    this.setState({
      tipsModalOpen: 'false',
    });

    localStorage.setItem(STORAGE_NEW_USER_FIRST_TIME, false);
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
      onTaskListDeleted();
    });
  };

  leaveList = ({ taskListIdentifier }) => {
    const { taskListAction } = this.props;
    return taskListAction.leaveList(taskListIdentifier).then(() => {
      onTaskListLeft();
    });
  };

  acceptInviteToTaskList = taskList => {
    const { invitationAction, taskActions } = this.props;
    invitationAction.acceptInviteToTaskList(taskList);
    taskActions.resetTaskSearch();
    hashHistory.push(`tasks/${taskList.taskListIdentifier}`);
  };

  rejectInviteToTaskList = taskList => {
    const { invitationAction } = this.props;
    return invitationAction
      .rejectInviteToTaskList(taskList)
      .then(() => onTaskListInvitationRejected());
  };

  refresh = () => {
    const { taskListAction } = this.props;
    taskListAction.loading();
    taskListAction.getTaskListForUser();
  };

  onClick = taskListIdentifier => {
    const { taskActions } = this.props;
    taskActions.resetTaskSearch();
    hashHistory.push(`/tasks/${taskListIdentifier}`);
  };

  onClickPendingList = taskListIdentifier => {
    const { taskActions } = this.props;
    taskActions.resetTaskSearch();
    this.acceptInviteToTaskList({ taskListIdentifier });
    hashHistory.push(`/tasks/${taskListIdentifier}`);
  };

  render() {
    const {
      isFetching,
      pendingTaskLists,
      taskLists,
      currentUser,
      currentTaskList,
      setHeaderBound,
    } = this.props;

    const {
      listFormOpen,
      hasStartedFetching,
      tipsOpen,
      tipsModalOpen,
    } = this.state;

    setHeaderBound({
      layout: [
        {
          key: 'tasks-list-header',
          component: <GenericHeader>Lists</GenericHeader>,
        },
      ],
    });

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
                      <div style={{ marginTop: '0px', padding: '0px' }}>
                        {/* <PendingListsComponent
                          taskLists={pendingTaskLists}
                          acceptInviteToTaskList={this.acceptInviteToTaskList}
                          rejectInviteToTaskList={this.rejectInviteToTaskList}
                        /> */}
                        <ListsComponent
                          taskLists={pendingTaskLists}
                          currentUser={currentUser}
                          editForm={this.editTaskList}
                          deleteList={this.deleteList}
                          leaveList={this.rejectInviteToTaskList}
                          onClick={this.onClickPendingList}
                          showNewIndicator
                        />
                        <ListsComponent
                          taskLists={taskLists}
                          currentUser={currentUser}
                          editForm={this.editTaskList}
                          deleteList={this.deleteList}
                          leaveList={this.leaveList}
                          onClick={this.onClick}
                          showNewIndicator={false}
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
