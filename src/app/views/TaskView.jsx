import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import { AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import Pusher from 'pusher-js';
import { any, equals, filter, isEmpty, map, prop, reject, uniqBy } from 'ramda';
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
import AddTask from '../components/task/AddTask';
import TaskList from '../components/task/TaskList';
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
import FilterIcon from '../img/filter.svg';
import {
  CompletedButtonRowContainer,
  FadeContainer,
  FilterByBoldLabel,
  FilterByLabel,
  FilterByLinkLabel,
  FilterByTextContainer,
  InboxNoMessagesAvailable,
  SideClickListener,
  StyledButtonLabel,
  TableWrapper,
  TaskListContainer,
  TasklistCount,
  TaskListSectionContainer,
  TaskListSectionHeader,
  TaskListSectionHeading,
  TaskViewContainer,
  TaskViewGrid,
} from './TaskView.Styled';

const APP_KEY = process.env.PUSHER_APP_KEY;
const APP_CLUSTER = process.env.PUSHER_CLUSTER_NAME;

const SHOW_MORE_STEP_COUNT = 100;

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

const filterOptions = [
  {
    value: 'ASSIGNED_TO_ME',
    description: 'Assigned to me',
  },
  {
    value: 'CREATED_BY_ME',
    description: 'Created by me',
  },
  { value: 'FLAGGED', description: 'Flagged' },
  { value: 'OVERDUE', description: 'Overdue' },
  { value: 'DUE_TODAY', description: 'Due Today' },
  {
    value: 'DUE_THIS_WEEK',
    description: 'Due This Week',
  },
  {
    value: 'DUE_NEXT_WEEK',
    description: 'Due Next Week',
  },
];

const animationProperties = {
  variants: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: '2.5rem', opacity: 1 },
  },
  initial: 'hidden',
  exit: 'hidden',
  animate: 'visible',
  transition: { ease: 'backInOut', duration: 0.25 },
};

export const TaskListSection = ({
  heading,
  children,
  hideCollapse = false,
  taskListIdentifier = '',
  patientIdentifier,
  storeAsCurrentTask,
}) => {
  const [isCollapsed, toggleIsCollapsed] = useToggle(false);

  return (
    <TaskListSectionContainer>
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
        {!isCollapsed && (
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
        )}
      </TaskListSectionHeader>
      {!isCollapsed && children}
    </TaskListSectionContainer>
  );
};

const CollapseStyledButton = styled(({ isCollapsed, ...props }) => (
  <IconButton {...props} />
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
    filterPopoverOpen: false,
    completedTasksShown: false,
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

  filterButton = React.createRef();

  taskListContainerReference = React.createRef();

  handleSearchDebounced = debounce(value => {
    const searchTerms = value.toLowerCase().match(/\S+/g) || [];

    this.clearStoredCurrentTask();
    this.setState({ searchTerms }, () => {
      this.saveTaskListPreferences();
    });
    this.closeTaskDrawer();
  }, 200);

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
    const { taskList } = this.props;

    if (
      (!taskList && nextProps && nextProps.taskList) ||
      (nextProps &&
        nextProps.taskList &&
        taskList.taskListIdentifier !== nextProps.taskList.taskListIdentifier)
    ) {
      // this.listenForRealTimeEvents(nextProps.taskList);
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
    const socket = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
    });

    const currentUserIdentifier = currentUser.userIdentifier;
    const channelName = `dock-user-channel-${currentUserIdentifier}`;
    const channel = socket.subscribe(channelName);
    // Listen to the channel for new entries.
    // The server publishes to this channel whenever a entry is updated
    channel.bind('task-update', data => {
      // Since the app is going to be realtime, we don't want the same item to
      // be shown twice. Device A publishes an entry, all other devices including itself
      // receives the entry, so act like a basic filter
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
      isMultiList,
      title,
      members,
      membersNotInTaskList,
      taskList,
      dispatchedSetHeader,
    } = this.props;

    let allTasks = [];
    if (tasks != null && completedTasks != null) {
      allTasks = [...tasks, ...completedTasks];
    }

    let allTasksCount = tasksCount;
    if (!tasksCount) {
      allTasksCount = allTasks.length;
    }

    if (title) {
      dispatchedSetHeader({
        backgroundColor: '#fff',
        layout: [
          {
            key: 'header',
            component: (
              <Header
                isFetching={isFetching}
                title={title}
                taskCount={allTasksCount}
                members={members}
                membersNotInTaskList={membersNotInTaskList}
                taskList={taskList}
                resetHeader={this.resetHeader}
                isMultiList={isMultiList}
              />
            ),
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
    this.handleSearchDebounced(value);
  };

  searchTaskProperties = ({ description, sourceMessage, comments }) => {
    const { searchTerms } = this.state;

    const isMatch = text =>
      searchTerms.every(term => text?.toLowerCase().includes(term));

    const commentsContents = comments.map(prop('comment'));

    return any(isMatch)([description, sourceMessage, ...commentsContents]);
  };

  search = tasks => {
    if (tasks?.length === 0) {
      return tasks;
    }

    const matchedTasks = [
      ...tasks.filter(this.searchTaskProperties),
      ...tasks.flatMap(prop('subtasks')).filter(this.searchTaskProperties),
    ];

    return matchedTasks.filter(
      ({ parentTaskIdentifier }) => parentTaskIdentifier == null,
    );
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

  openFilterPopover = () => {
    this.setState({
      filterPopoverOpen: true,
    });
  };

  closeFilterPopover = () => {
    this.setState({
      filterPopoverOpen: false,
    });
  };

  onFilterChange = ({ value }) => () => {
    this.handleFilterChange(value);
    this.closeFilterPopover();
  };

  clearFilter = () => {
    this.onFilterChange({ value: '' })();
  };

  renderFilterPopover = () => {
    const { filterPopoverOpen } = this.state;

    return (
      <Popover
        open={filterPopoverOpen}
        anchorEl={this.filterButton?.current}
        onClose={this.closeFilterPopover}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
      >
        <List>
          {filterOptions.map(({ value, description }) => (
            <ListItem
              key={value}
              button
              onClick={this.onFilterChange({ value })}
            >
              {description}
            </ListItem>
          ))}
        </List>
      </Popover>
    );
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

    return (
      <>
        <TaskList showListHeadings={showListHeadings} {...tasklistProps} />
        {this.renderCompleted({ listCompletedTasks: completedTasks })}
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
          <TaskListSectionHeading>
            {groupedListName && (
              <Link to={`tasks/${currentTaskListId}`}>{groupedListName}</Link>
            )}
            {!groupedListName && <Link to="tasks/Inbox">Inbox</Link>}
          </TaskListSectionHeading>
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
                      listCompletedTasks.length >= SHOW_MORE_STEP_COUNT
                        ? `${SHOW_MORE_STEP_COUNT}+`
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
                listCompletedTasks.length >= SHOW_MORE_STEP_COUNT
                  ? `${SHOW_MORE_STEP_COUNT}+`
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
      isInbox = false,
      isSpecificPatient = false,
      isMultiList,
      taskDrawerOpen,
      showAddTaskButton = true,
      globalSearch,
      tasks,
      completedTasks,
      taskListMembers,
    } = this.props;
    const {
      initialSearchValue,
      slimView,
      displayHUD,
      filterBy,
      preferencesInitialized,
    } = this.state;

    const currentFilterDescription =
      filterOptions.find(({ value }) => value === filterBy)?.description ?? '';

    const hasTasks = !isEmpty(tasks);
    const hasNoTasksAfterFilterApplication =
      isEmpty(tasks) && !isEmpty(filterBy);

    const toolbarContainerVisible =
      (isInbox &&
        (hasTasks || hasNoTasksAfterFilterApplication || isFetching)) ||
      !isInbox;

    const showSortingStats = !isMultiList && !isInbox;

    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'center',
        }}
      >
        <SideClickListener onClick={this.closeTaskDrawer} />
        <TaskViewContainer>
          {showSortingStats && displayHUD && (
            <HeadsUpArea
              ref={this.headsUpArea}
              taskList={taskList}
              filterChange={this.handleFilterChange}
              currentFilter={filterBy}
            />
          )}
          {showToolbar && !globalSearch && (
            <Toolbar
              clearFilter={this.clearFilter}
              displayHUD={displayHUD}
              downloadPDF={downloadPDF}
              filterButton={this.filterButton}
              filterBy={filterBy}
              handleSearch={this.handleSearch}
              onAddTaskButtonClick={this.onAddTaskButtonClick}
              openFilterPopover={this.openFilterPopover}
              preferencesInitialized={preferencesInitialized}
              initialSearchValue={initialSearchValue}
              selectedTask={selectedTask}
              showSortingStats={showSortingStats}
              slimView={slimView}
              switchSlimView={this.switchSlimView}
              taskDrawerOpen={taskDrawerOpen}
              toggleHUD={this.toggleHUD}
              toolbarContainerVisible={toolbarContainerVisible}
              showAddTaskButton={showAddTaskButton}
              taskListContainerReference={this.taskListContainerReference}
              printData={{
                tasks,
                completedTasks,
                taskListMembers,
              }}
            />
          )}
          <AnimatePresence>
            {currentFilterDescription && (
              <FilterByTextContainer {...animationProperties}>
                <img src={FilterIcon} alt="Filter icon" />
                <FilterByLabel>Filter:</FilterByLabel>
                <FilterByBoldLabel>
                  {currentFilterDescription}
                </FilterByBoldLabel>
                <FilterByLinkLabel onClick={this.clearFilter}>
                  clear filter
                </FilterByLinkLabel>
              </FilterByTextContainer>
            )}
          </AnimatePresence>
          <TaskViewGrid container wrap="nowrap">
            <TableWrapper taskDrawerOpen={taskDrawerOpen}>
              {isFetching ? (
                <FadeContainer>
                  <Fade
                    in={isFetching}
                    unmountOnExit
                    style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}
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
                    <TaskListContainer>
                      {this.renderTasklists()}
                      <SideClickListener onClick={this.closeTaskDrawer} />
                    </TaskListContainer>
                  </div>
                  {taskDrawerOpen && !isMultiList && (
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
          {this.renderFilterPopover()}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskView);
