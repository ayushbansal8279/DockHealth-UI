import {
  Button,
  Collapse,
  Fade,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import Pusher from 'pusher-js';
import {
  any,
  equals,
  filter,
  isEmpty,
  map,
  omit,
  prop,
  reject,
  uniqBy,
} from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { useToggle } from 'react-use';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { setHeader } from '../actions/header-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskDrawerActions from '../actions/task-drawer-actions';
import CubesLoader from '../components/common/CubesLoader';
import GenericHeader from '../components/common/GenericHeader';
import Spacing from '../components/common/Spacing';
import AddTask from '../components/task/AddTask';
import TaskList from '../components/task/TaskList';
import { TASK_LIST_SHOW_MORE_STEP } from '../components/task/TaskList.Data';
import Header from '../components/taskView/Header';
import HeadsUpArea from '../components/taskView/HeadsUpArea';
import NewTaskDrawer from '../components/taskView/NewTaskDrawer';
import Toolbar from '../components/taskView/Toolbar';
import {
  onButtonClicked,
  onFilterChanged,
  onHeadsUpDisplayToggled,
  onSlimViewChanged,
} from '../helpers/ga-event-helper';
import { isTaskArchivable } from '../helpers/utility-functions';
import ChevronSmallIcon from '../img/chevron-small.svg';
import { themeMontserrat600 } from '../theme-montserrat';
import { getSubscriptionIsTrial } from './self-serve/subscriptions/SubscriptionsView.Utilities';
import {
  InboxHelpPanel,
  InboxNoMessagesAvailable,
} from './TaskView.InboxElements';
import {
  CompletedButtonRowContainer,
  FadeContainer,
  SideClickListener,
  StyledButtonLabel,
  TableWrapper,
  TaskListContainer,
  TasklistCount,
  TaskListSectionContainer,
  TaskListSectionHeader,
  TaskViewContainer,
  TaskViewGrid,
} from './TaskView.Styled';

const APP_KEY = process.env.PUSHER_APP_KEY;
const APP_CLUSTER = process.env.PUSHER_CLUSTER_NAME;

const pusher = new Pusher(APP_KEY, {
  cluster: APP_CLUSTER,
});

const groupBy = (list, keyGetter) => {
  const checkMap = new Map();

  list.forEach(item => {
    const key = keyGetter(item);
    const collection = checkMap.get(key);
    if (!collection) {
      checkMap.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return checkMap;
};

const useTaskListClasses = makeStyles({
  paneled: {
    backgroundColor: '#fff',
    border: '0.125rem solid #ddf2f7',
    padding: '0.125rem',
    width: '100%',
  },
});

export const TaskListSection = ({
  heading,
  children,
  hideCollapse = false,
  taskListIdentifier = '',
  patientIdentifier,
  paneled,
  storeAsCurrentTask,
}) => {
  const [isCollapsed, toggleIsCollapsed] = useToggle(false);

  const taskListClasses = useTaskListClasses();

  return (
    <TaskListSectionContainer
      className={clsx(paneled && taskListClasses.paneled)}
    >
      <TaskListSectionHeader>
        <Grid item container xs={12} justify="space-between">
          {heading}
          {!hideCollapse && (
            <CollapseStyledButton
              isCollapsed={isCollapsed}
              onClick={toggleIsCollapsed}
            >
              <img src={ChevronSmallIcon} alt="Collapse Details" />
            </CollapseStyledButton>
          )}
        </Grid>
        <Collapse in={!isCollapsed}>
          <Grid item container xs={12}>
            <AddTask
              taskListIdentifier={taskListIdentifier}
              patientIdentifier={patientIdentifier}
              style={{
                width: '100%',
              }}
              storeAsCurrentTask={storeAsCurrentTask}
            />
          </Grid>
        </Collapse>
      </TaskListSectionHeader>
      <Collapse in={!isCollapsed}>{children}</Collapse>
    </TaskListSectionContainer>
  );
};

const CollapseStyledButton = styled(props => (
  <IconButton {...omit(['isCollapsed'], props)} />
))`
  && {
    height: 36px;
    width: 36px;
    padding: 0;
    ${({ isCollapsed }) => isCollapsed && 'transform: rotate(180deg);'}
  }
`;

const TASK_VIEW_STORAGE_PREFIX = 'task-view-';
const TASK_VIEW_STORAGE_CURRENT_VERSION = 1;

class TaskView extends Component {
  state = {
    filterBy: '',
    completedTasksShown: false,
    rawSearchTerm: '',
    searchTerms: [],
    slimView: false,
    initialSearchValue: null,
    displayHUD: true,
    taskTimeouts: {
      complete: [],
      incomplete: [],
    },
    preferencesInitialized: false,
  };

  headsUpArea = React.createRef();

  taskListContainerReference = React.createRef();

  handleSearchDebounced = debounce(value => {
    const searchTerms = value.toLowerCase().match(/\S+/g) || [];

    this.clearStoredCurrentTask();
    this.setState({ searchTerms }, () => {
      this.saveTaskListPreferences();
    });
    this.closeTaskDrawer();
  }, 300);

  componentDidMount = () => {
    const { taskList, currentUser } = this.props;
    const taskListIdentifier = taskList?.taskListIdentifier;

    let localStorageKey = `${TASK_VIEW_STORAGE_PREFIX}_${currentUser.userIdentifier}`;
    if (taskListIdentifier) {
      localStorageKey = TASK_VIEW_STORAGE_PREFIX + taskListIdentifier;
    }

    let taskListPreferences = {};

    try {
      taskListPreferences =
        JSON.parse(localStorage.getItem(localStorageKey)) || {};

      const { version } = taskListPreferences;

      if (
        (version && version !== TASK_VIEW_STORAGE_CURRENT_VERSION) ||
        !version
      ) {
        taskListPreferences = {};
        localStorage.removeItem(localStorageKey);
        this.saveTaskListPreferences();
      }
    } catch {
      taskListPreferences = {};
      this.saveTaskListPreferences();
    }

    this.setState({
      ...taskListPreferences,
      initialSearchValue: (taskListPreferences.searchTerms || [])
        .join(' ')
        .trim(),
      preferencesInitialized: true,
    });

    this.resetHeader();
    this.listenForRealTimeEvents(taskList, currentUser);
    this.closeTaskDrawer();
  };

  componentWillUpdate(nextProps) {
    const { taskList, currentUser } = this.props;

    if (
      (!taskList && nextProps && nextProps.taskList) ||
      (nextProps &&
        nextProps.taskList &&
        taskList.taskListIdentifier !== nextProps.taskList.taskListIdentifier)
    ) {
      this.listenForRealTimeEvents(nextProps.taskList, currentUser);
    }
  }

  handlePreSelectionCompletedTask = task => {
    if (task?.status?.toUpperCase() === 'COMPLETE') {
      this.toggleCompletedTasks();
    }
  };

  componentDidUpdate = ({
    isFetching: previousIsFetching,
    members: previousMembers,
    preSelectedTask: previousPreSelectedTask,
  }) => {
    const {
      isFetching,
      members,
      preSelectedTask,
      storeAsCurrentTask,
      tasks,
    } = this.props;

    if (
      previousIsFetching !== isFetching ||
      !equals(members, previousMembers)
    ) {
      this.resetHeader();
    }

    if (
      preSelectedTask !== previousPreSelectedTask &&
      !previousPreSelectedTask
    ) {
      if (preSelectedTask.parentTaskIdentifier) {
        const parentTask =
          tasks.find(
            ({ taskIdentifier }) =>
              taskIdentifier === preSelectedTask.parentTaskIdentifier,
          ) ?? null;
        this.handlePreSelectionCompletedTask(parentTask);
      } else {
        this.handlePreSelectionCompletedTask(preSelectedTask);
      }
      this.openTaskDrawer();
      storeAsCurrentTask(preSelectedTask);
    }
  };

  saveTaskListPreferences = () => {
    const { taskList, currentUser } = this.props;

    const taskListIdentifier = taskList?.taskListIdentifier;
    let localStorageKey = `${TASK_VIEW_STORAGE_PREFIX}_${currentUser.userIdentifier}`;
    if (taskListIdentifier) {
      localStorageKey = `${TASK_VIEW_STORAGE_PREFIX}${taskListIdentifier}`;
    }
    if (taskListIdentifier) {
      const { slimView, filterBy, displayHUD, searchTerms } = this.state;

      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          slimView,
          filterBy,
          displayHUD,
          searchTerms,
          version: TASK_VIEW_STORAGE_CURRENT_VERSION,
        }),
      );
    }
  };

  listenForRealTimeEvents = (taskList, currentUser) => {
    if (!currentUser) {
      return;
    }

    const { refreshTask, taskActions } = this.props;
    const currentUserIdentifier = currentUser.userIdentifier;
    const channelName = `dock-user-channel-${currentUserIdentifier}`;

    let channel = pusher.channel(channelName);
    if (!channel) {
      channel = pusher.subscribe(channelName);
      // console.log('subscribed to channel');
    }
    // channel.bind('pusher:subscription_succeeded', function() {
    //   console.log('subscription_succeeded');
    // });
    // channel.bind('pusher:subscription_error', function(status) {
    //   console.log('subscription_error', status);
    // });
    // console.log(channel);
    // Listen to the channel for new entries.
    // The server publishes to this channel whenever a entry is updated

    channel.bind('task-update', data => {
      // Since the app is going to be realtime, we don't want the same item to
      // be shown twice. Device A publishes an entry, all other devices including itself
      // receives the entry, so act like a basic filter
      // console.log(data);
      const currentTaskListIdentifier = taskList?.taskListIdentifier;
      if (
        data.task?.taskList &&
        data.task?.taskList.taskListIdentifier === currentTaskListIdentifier
      ) {
        if (
          (data.eventType?.startsWith('CREATE_TASK') ||
            data.eventType?.startsWith('DUPLICATE_TASK')) &&
          data.task?.taskList
        ) {
          taskActions.getListTasks(
            data.task.taskList.taskListIdentifier,
            null,
            null,
            'INCOMPLETE',
          );
        }
        // eslint-disable-next-line no-unused-expressions
        refreshTask?.(data.task);
      }
    });
  };

  refresh = () => {
    const { actions, patientActions } = this.props;

    actions.loading();
    this.closeAuditHistory();

    patientActions.getAllPatients();
  };

  componentWillUnmount = () => {
    const { taskTimeouts } = this.state;

    Object.values(taskTimeouts)
      .flat()
      .forEach(({ taskTimeoutId }) => {
        clearTimeout(taskTimeoutId);
      });

    // console.log('unsubscribing from channel');
    const { currentUser } = this.props;
    const currentUserIdentifier = currentUser?.userIdentifier;
    if (currentUserIdentifier) {
      const channelName = `dock-user-channel-${currentUserIdentifier}`;
      let channel = pusher.channel(channelName);
      if (channel) {
        channel = pusher.unsubscribe(channelName);
        // console.log('unsubscribed from channel');
      }
    }
  };

  clearTaskTimeouts = (taskTimeoutId, callback = () => {}) => {
    this.setState(previousState => {
      return {
        taskTimeouts: map(
          filter(
            taskTimeoutData => taskTimeoutData.taskTimeoutId !== taskTimeoutId,
          ),
          previousState.taskTimeouts,
        ),
      };
    }, callback);
  };

  addTaskMoveTimeout = task => {
    const { taskActions, selectedTask, storeAsCurrentTask } = this.props;

    const { taskTimeouts } = this.state;

    const taskTimeoutArrayKey =
      task.status === 'COMPLETE' ? 'complete' : 'incomplete';

    const timeoutFired =
      Object.values(taskTimeouts)
        .flat()
        .map(({ taskTimeoutId: oldTaskTimeoutId, taskIdentifier }) => {
          if (taskIdentifier === task?.taskIdentifier) {
            clearTimeout(oldTaskTimeoutId);
            this.clearTaskTimeouts(oldTaskTimeoutId);

            return true;
          }

          return false;
        })
        .filter(Boolean).length > 0;

    if (!timeoutFired) {
      const taskTimeoutId = setTimeout(() => {
        if (
          selectedTask?.taskIdentifier === task?.taskIdentifier &&
          !task?.parentTaskIdentifier
        ) {
          storeAsCurrentTask(null);
          this.closeTaskDrawer();
        }

        taskActions.moveTaskBetweenLists(task);

        this.clearTaskTimeouts(taskTimeoutId);
      }, 3000);

      this.setState(previousState => {
        const previousTaskTimeouts =
          previousState.taskTimeouts[taskTimeoutArrayKey];

        return {
          taskTimeouts: {
            ...previousState.taskTimeouts,
            [taskTimeoutArrayKey]: [
              ...previousTaskTimeouts,
              {
                taskTimeoutId,
                taskIdentifier: task?.taskIdentifier,
              },
            ],
          },
        };
      });
    }
  };

  openTaskDrawer = () => {
    const { taskDrawerActions } = this.props;
    taskDrawerActions.openDrawer();
  };

  toggleCompletedTasks = () => {
    this.setState(previousState => ({
      completedTasksShown: !previousState.completedTasksShown,
    }));
  };

  closeTaskDrawer = () => {
    const { storeAsCurrentTask, taskDrawerActions } = this.props;
    taskDrawerActions.closeDrawer();
    storeAsCurrentTask(null);
  };

  resetHeader = tasksCount => {
    const {
      tasks,
      completedTasks,
      isFetching,
      hasTitle = true,
      title,
      taskList,
      dispatchedSetHeader,
      isSpecialList,
    } = this.props;

    const allTasks = [...(tasks ?? []), ...(completedTasks ?? [])];
    const allTasksCount = tasksCount ?? allTasks.length;

    const headerComponent = isSpecialList ? (
      <GenericHeader>{title}</GenericHeader>
    ) : (
      <Header
        isFetching={isFetching}
        title={title}
        taskCount={allTasksCount}
        taskList={taskList}
        resetHeader={this.resetHeader}
        hasTitle={hasTitle}
      />
    );

    if (title) {
      dispatchedSetHeader({
        layout: [
          {
            key: 'header',
            component: headerComponent,
            xs: 12,
          },
        ],
      });
    }
  };

  clearStoredCurrentTask = () => {
    const { storeAsCurrentTask } = this.props;

    storeAsCurrentTask(null);
  };

  handleFilterChange = filterBy => {
    const { onFilter } = this.props;
    const sortBy = '';

    this.setState(
      {
        filterBy,
      },
      () => {
        this.saveTaskListPreferences();
      },
    );

    onFilterChanged(filterBy);

    this.clearStoredCurrentTask();

    onFilter(filterBy, sortBy);
  };

  handleSearch = event => {
    const { value } = event.target;
    this.setState({
      rawSearchTerm: value,
    });
    this.handleSearchDebounced(value);
  };

  searchTaskProperties = ({
    description,
    sourceMessage,
    comments,
    subtasks,
    parentTaskIdentifier,
  }) => {
    const { searchTerms } = this.state;

    const isMatch = text =>
      searchTerms.every(term => text?.toLowerCase().includes(term));

    const commentsContents = comments.map(prop('comment'));

    const isTaskMatched = any(isMatch)([
      description,
      sourceMessage,
      ...commentsContents,
    ]);

    if (isTaskMatched) {
      return isTaskMatched;
    }

    return (
      !parentTaskIdentifier &&
      (subtasks ?? []).map(this.searchTaskProperties).some(Boolean)
    );
  };

  search = tasks => {
    if (tasks?.length === 0) {
      return tasks;
    }

    return tasks.filter(this.searchTaskProperties);
  };

  toggleHUD = () => {
    this.setState(
      previousState => ({
        displayHUD: !previousState.displayHUD,
      }),
      () => {
        const { displayHUD } = this.state;
        onHeadsUpDisplayToggled(displayHUD);
      },
    );
  };

  handleClose = () => {
    const { storeAsCurrentTask } = this.props;
    storeAsCurrentTask(null);
  };

  switchSlimView = () => {
    this.setState(
      previousState => ({
        slimView: !previousState.slimView,
      }),
      () => {
        const { slimView } = this.state;
        onSlimViewChanged(slimView);
        this.saveTaskListPreferences();
      },
    );
  };

  onAddTaskButtonClick = () => {
    const { storeAsCurrentTask } = this.props;

    onButtonClicked('Add Task');
    storeAsCurrentTask(null);
    this.openTaskDrawer();
  };

  onFilterChange = ({ value }) => () => {
    this.handleFilterChange(value);
  };

  clearFilter = () => {
    this.onFilterChange({ value: '' })();
  };

  onMarkComplete = newTask => {
    const { storeAsCurrentTask, currentTask } = this.props;

    this.addTaskMoveTimeout(newTask);

    if (currentTask) {
      storeAsCurrentTask(newTask);
    }
  };

  mapInboxTasks = ({ isInbox }) => task => {
    const mappedTaskListId = task?.taskList?.taskListIdentifier;

    if (isInbox && mappedTaskListId === 0) {
      return {
        ...task,
        taskList: null,
      };
    }

    return task;
  };

  getToolbarContainerVisible = () => {
    const { isFetching, isInbox = false, tasks } = this.props;
    const { filterBy } = this.state;

    const hasTasks = !isEmpty(tasks);
    const hasNoTasksAfterFilterApplication =
      isEmpty(tasks) && !isEmpty(filterBy);

    return (
      (isInbox &&
        (hasTasks || hasNoTasksAfterFilterApplication || isFetching)) ||
      !isInbox
    );
  };

  renderTasklists = () => {
    const {
      tasks: allIncompleteTasks,
      completedTasks: allCompletedTasks,
      markComplete,
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      currentUser,
      currentPatientId,
      isInbox,
      isMultiList,
      taskListIdentifier,
      listName,
      showListHeadings = true,
      taskDrawerOpen,
      globalSearch,
      paneled = false,
    } = this.props;
    const { filterBy, slimView, taskTimeouts } = this.state;

    const incompleteTasks = this.search(allIncompleteTasks);
    const completedTasks = this.search(allCompletedTasks);

    const archivableTasks = completedTasks.filter(
      isTaskArchivable(currentUser),
    );

    const allJoinedTasks = [...incompleteTasks, ...completedTasks];

    const tasks = [...incompleteTasks, ...archivableTasks].map(
      this.mapInboxTasks({ isInbox }),
    );

    const groupedTasks = groupBy(
      allJoinedTasks,
      task => task?.taskList?.listName ?? '',
    );

    const listNames = [...groupedTasks.keys()].sort((a, b) =>
      a.localeCompare(b),
    );

    const groupedInCompletedTasks = groupBy(
      tasks,
      task => task?.taskList?.listName ?? '',
    );

    const groupedCompletedTasks = groupBy(
      completedTasks,
      task => task?.taskList?.listName ?? '',
    );

    const allTasksAndSubTasksCount =
      groupedTasks?.length > 0
        ? groupedTasks.map(group => {
            return group.length;
          })
        : 0;

    this.resetHeader(allTasksAndSubTasksCount);

    const tasklistProps = {
      tasks,
      completedTasks: tasks,
      markComplete: (task, status) => {
        markComplete(task, status, 'INCOMPLETE', currentUser).then(
          this.onMarkComplete,
        );
      },
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      slimView,
      openTaskDrawer: this.openTaskDrawer,
      taskDrawerOpen,
      taskTimeouts: Object.values(taskTimeouts).flat(),
      taskListIdentifier,
      status: 'INCOMPLETE',
      search: this.search,
      filterBy,
      isInbox,
      listName,
      showListHeadings,
      globalSearch,
      paneled,
    };

    const { searchTerms, filterBy: stateFilterBy } = this.state;

    if (
      isInbox &&
      isEmpty(allJoinedTasks) &&
      isEmpty(searchTerms) &&
      isEmpty(stateFilterBy)
    ) {
      return <InboxNoMessagesAvailable />;
    }

    if (!isMultiList || isInbox) {
      return this.renderSingleTaskList({ tasklistProps, completedTasks });
    }

    return this.renderMultipleTaskList({
      listNames,
      groupedTasks,
      groupedInCompletedTasks,
      groupedCompletedTasks,
      currentPatientId,
      storeAsCurrentTask,
      tasklistProps,
    });
  };

  renderSingleTaskList = ({ tasklistProps, completedTasks }) => {
    const { showListHeadings = true } = this.props;
    const { filterBy } = this.state;

    const isCompletedThisWeekFilter =
      filterBy === 'ASSIGNED_TO_ME_COMPLETED_THIS_WEEK' ||
      filterBy === 'COMPLETED_THIS_WEEK';
    const showCompletedTasksButton =
      isEmpty(filterBy) || !isCompletedThisWeekFilter;

    return (
      <>
        <TaskList showListHeadings={showListHeadings} {...tasklistProps} />
        {showCompletedTasksButton &&
          this.renderCompleted({ listCompletedTasks: completedTasks })}
      </>
    );
  };

  renderMultipleTaskList = ({
    listNames,
    groupedTasks,
    groupedInCompletedTasks,
    groupedCompletedTasks,
    currentPatientId,
    storeAsCurrentTask,
    tasklistProps,
  }) => {
    const {
      showListHeadings = true,
      isMultiList,
      markComplete,
      isSpecificPatient,
      globalSearch,
      onCompletedTasksRequest,
      paneled,
    } = this.props;
    const { filterBy } = this.state;

    return listNames.map(groupedListName => {
      const incompleteTasks =
        groupedTasks
          ?.get(groupedListName)
          ?.filter(({ status }) => status === 'INCOMPLETE') ?? [];

      const tasksCount = uniqBy(prop('taskIdentifier'), [
        ...incompleteTasks,
        ...incompleteTasks
          ?.flatMap(({ subtasks }) => subtasks)
          ?.filter(Boolean)
          ?.filter(({ status }) => status !== 'COMPLETE'),
      ]).length;

      const tasksCountContent = `${tasksCount} ${
        tasksCount === 1 ? 'task' : 'tasks'
      }`;

      const incompleteTasksForList = groupedInCompletedTasks.get(
        groupedListName,
      );
      const completedTasksForList = groupedCompletedTasks.get(groupedListName);

      const currentTaskList = groupedTasks.get(groupedListName)[0]?.taskList;
      const currentTaskListId = currentTaskList?.taskListIdentifier;

      const heading = (
        <div>
          <ThemeProvider theme={themeMontserrat600}>
            <Typography variant="h3" color="primary">
              {groupedListName && (
                <Link to={`tasks/${currentTaskListId}`}>{groupedListName}</Link>
              )}
              {!groupedListName && <Link to="tasks/Inbox">Inbox</Link>}
            </Typography>
          </ThemeProvider>
          <TasklistCount>{tasksCountContent}</TasklistCount>
        </div>
      );

      const joinedListTasks = uniqBy(prop('taskIdentifier'), [
        ...(incompleteTasksForList ?? []),
        ...(completedTasksForList ?? []),
      ]);

      return (
        <TaskListSection
          taskListIdentifier={currentTaskListId}
          patientIdentifier={currentPatientId}
          storeAsCurrentTask={storeAsCurrentTask}
          heading={heading}
          paneled={paneled}
          key={groupedListName}
        >
          <TaskList
            listTasks={joinedListTasks}
            showListHeadings={showListHeadings}
            isMultiList={isMultiList}
            globalSearch={globalSearch}
            filterBy={filterBy}
            onCompletedTasksRequest={onCompletedTasksRequest}
            taskListIdentifier={currentTaskListId}
            taskDrawerProps={{
              taskList: currentTaskList,
              closeDrawer: this.closeTaskDrawer,
              markComplete,
              onMarkComplete: this.onMarkComplete,
              isSpecificPatient,
            }}
            {...tasklistProps}
          />
        </TaskListSection>
      );
    });
  };

  renderCompleted = ({ listCompletedTasks: completedOrArchivedTasks }) => {
    const {
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      currentUser,
      isInbox,
      taskListIdentifier,
      listName,
      globalSearch,
      taskDrawerOpen,
      showListHeadings = true,
      isMultiList,
      isSpecificPatient,
      onCompletedTasksRequest,
    } = this.props;
    const {
      slimView,
      completedTasksShown,
      taskTimeouts,
      filterBy,
    } = this.state;

    const listCompletedTasks = reject(
      isTaskArchivable(currentUser),
      completedOrArchivedTasks,
    ).map(this.mapInboxTasks({ isInbox }));

    const tasklistProps = {
      tasks: this.search(listCompletedTasks),
      markComplete: (task, status) => {
        markComplete(task, status, 'COMPLETE', currentUser).then(
          this.onMarkComplete,
        );
      },
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      slimView,
      openTaskDrawer: this.openTaskDrawer,
      taskDrawerOpen,
      taskTimeouts: Object.values(taskTimeouts).flat(),
      taskListIdentifier,
      status: 'COMPLETE',
      search: this.search,
      filterBy,
      isInbox,
      listName,
      showListHeadings,
      listTasks: listCompletedTasks,
      isMultiList,
      globalSearch,
    };

    const getCompletedTasks = () => {
      onCompletedTasksRequest(taskListIdentifier, filterBy, '');
      this.toggleCompletedTasks();
    };

    const showCompletedTasksFlag = globalSearch ? true : completedTasksShown;

    const buttonToggleWord = showCompletedTasksFlag ? 'Hide' : 'Show';

    const completedTasksAndSubTasksCount = [
      ...listCompletedTasks,
      ...listCompletedTasks.flatMap(task => task?.subtasks ?? null),
    ].filter(Boolean).length;

    return (
      <>
        <CompletedButtonRowContainer>
          <SideClickListener heightMax onClick={this.closeTaskDrawer} />
          {!isMultiList && (
            <Button
              size="small"
              variant="contained"
              onClick={
                listCompletedTasks.length > 0
                  ? this.toggleCompletedTasks
                  : getCompletedTasks
              }
            >
              {`${buttonToggleWord} completed tasks${
                listCompletedTasks.length > 0
                  ? ` (${
                      listCompletedTasks.length >= TASK_LIST_SHOW_MORE_STEP
                        ? `${TASK_LIST_SHOW_MORE_STEP}+`
                        : completedTasksAndSubTasksCount
                    })`
                  : ``
              }
              `}
            </Button>
          )}
          {isMultiList && (
            <StyledButtonLabel>
              {`Completed tasks (${
                listCompletedTasks.length >= TASK_LIST_SHOW_MORE_STEP
                  ? `${TASK_LIST_SHOW_MORE_STEP}+`
                  : completedTasksAndSubTasksCount
              })`}
            </StyledButtonLabel>
          )}
          <SideClickListener heightMax onClick={this.closeTaskDrawer} />
        </CompletedButtonRowContainer>
        {showCompletedTasksFlag && (
          <TaskList
            isMultiList={isMultiList}
            taskDrawerProps={{
              closeDrawer: this.closeTaskDrawer,
              markComplete,
              onMarkComplete: this.onMarkComplete,
              isSpecificPatient,
            }}
            {...tasklistProps}
          />
        )}
      </>
    );
  };

  render() {
    const {
      isFetching,
      downloadPDF,
      taskList,
      showToolbar,
      selectedTask,
      markComplete,
      isSearching = false,
      isInbox = false,
      isSpecificPatient = false,
      isMultiList,
      taskDrawerOpen,
      showAddTaskButton = true,
      globalSearch,
      tasks,
      completedTasks,
      taskListMembers,
      members,
      membersNotInTaskList,
      addingNewSubtask,
      subscription,
      isSpecialList,
      headsUpAreaVisible = true,
    } = this.props;
    const {
      rawSearchTerm,
      initialSearchValue,
      slimView,
      displayHUD,
      filterBy,
      preferencesInitialized,
    } = this.state;

    const toolbarContainerVisible = this.getToolbarContainerVisible();

    const mainTaskDrawerOpen =
      taskDrawerOpen && (selectedTask?.taskIdentifier || addingNewSubtask);

    const isSubscriptionTrial = getSubscriptionIsTrial({
      subscription,
    });

    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
        }}
      >
        <Grid container justify="center" item xs={12}>
          {showToolbar && !globalSearch && (
            <Toolbar
              clearFilter={this.clearFilter}
              downloadPDF={downloadPDF}
              filterBy={filterBy}
              handleSearch={this.handleSearch}
              onAddTaskButtonClick={this.onAddTaskButtonClick}
              openFilterPopover={this.openFilterPopover}
              preferencesInitialized={preferencesInitialized}
              searchValue={rawSearchTerm}
              initialSearchValue={initialSearchValue}
              selectedTask={selectedTask}
              slimView={slimView}
              switchSlimView={this.switchSlimView}
              taskDrawerOpen={taskDrawerOpen}
              toolbarContainerVisible={toolbarContainerVisible}
              showAddTaskButton={showAddTaskButton}
              taskListContainerReference={this.taskListContainerReference}
              taskList={taskList}
              members={members}
              membersNotInTaskList={membersNotInTaskList}
              isInbox={isInbox}
              addingNewSubtask={addingNewSubtask}
              closeDrawer={this.closeTaskDrawer}
              markComplete={markComplete}
              onMarkComplete={this.onMarkComplete}
              isSpecificPatient={isSpecificPatient}
              isSpecialList={isSpecialList}
              isMultiList={isMultiList}
              onFilterChange={this.onFilterChange}
              printData={{
                tasks,
                completedTasks,
                taskListMembers,
              }}
            />
          )}
        </Grid>
        {isInbox && (
          <Grid item xs={12} container>
            <InboxHelpPanel />
            <Spacing vertical={3} />
          </Grid>
        )}
        <SideClickListener onClick={this.closeTaskDrawer} />
        <TaskViewContainer>
          {displayHUD && headsUpAreaVisible && (
            <HeadsUpArea
              ref={this.headsUpArea}
              taskList={taskList}
              filterChange={this.handleFilterChange}
              currentFilter={filterBy}
            />
          )}
          <TaskViewGrid container wrap="nowrap">
            <TableWrapper taskDrawerOpen={mainTaskDrawerOpen}>
              {isFetching || isSearching ? (
                <FadeContainer>
                  <Fade
                    in={isFetching || isSearching}
                    unmountOnExit
                    style={{
                      transitionDelay:
                        isFetching || isSearching ? '800ms' : '0ms',
                    }}
                  >
                    <CubesLoader size={40} />
                  </Fade>
                </FadeContainer>
              ) : (
                <div style={{ display: 'flex' }}>
                  <div
                    ref={this.taskListContainerReference}
                    style={{ width: '100%' }}
                  >
                    <TaskListContainer
                      isSubscriptionTrial={isSubscriptionTrial}
                    >
                      {this.renderTasklists()}
                      <SideClickListener onClick={this.closeTaskDrawer} />
                    </TaskListContainer>
                  </div>
                  {mainTaskDrawerOpen && !isMultiList && (
                    <NewTaskDrawer
                      headsUpAreaRef={this.headsUpArea.current}
                      closeDrawer={this.closeTaskDrawer}
                      taskList={taskList}
                      markComplete={markComplete}
                      onMarkComplete={this.onMarkComplete}
                      isInbox={isInbox}
                      isSpecificPatient={isSpecificPatient}
                      isMultiList={false}
                    />
                  )}
                </div>
              )}
            </TableWrapper>
          </TaskViewGrid>
        </TaskViewContainer>
        <SideClickListener onClick={this.closeTaskDrawer} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchedSetHeader: setHeader(dispatch),
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

const mapStateToProps = store => ({
  selectedTask: store.taskState.selectedTask,
  currentUser: store.userState.userProfile,
  currentPatientId: store.patient?.details?.patientIdentifier,
  taskDrawerOpen: store.taskDrawerState?.open,
  addingNewTask: store.taskState.addingNewTask,
  addingNewSubtask: store.taskState.addingNewSubtask,
  subscription: store.organizationState?.organization?.subscriptionDetails,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
