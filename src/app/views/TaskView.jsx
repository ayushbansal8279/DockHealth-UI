import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import { AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import Pusher from 'pusher-js';
import any from 'ramda/es/any';
import equals from 'ramda/es/equals';
import filter from 'ramda/es/filter';
import map from 'ramda/es/map';
import prop from 'ramda/es/prop';
import reject from 'ramda/es/reject';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import { setHeader } from '../actions/header-actions';
import { moveTaskBetweenLists } from '../actions/task-actions';
import { getTaskListStats } from '../actions/tasklist-actions';
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
  StyledButton,
  TableWrapper,
  TaskListContainer,
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

export const TaskListContainerWrapper = styled.div`
  flex: 2;
  padding: 4px;
`;

export const TaskListHeader = styled.div`
  display: flex;
  position: relative;
  height: 67px;
  background: #2a4a70;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 13.5px 19px 27px;
`;

export const TaskListSectionContainer = styled.div`
  margin-bottom: 0.25rem;
`;

export const TaskListSectionHeader = styled(Grid)`
  background-color: #fff;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0.75rem;
`;

export const TaskListSectionHeading = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0ca1c7;
`;

export const TasklistCount = styled.div`
  color: #2e3a43;
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 0.5rem;
`;

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
  taskListId,
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
        <Grid item container xs={12}>
          <AddTask
            taskListId={taskListId}
            style={{
              width: '100%',
            }}
            storeAsCurrentTask={storeAsCurrentTask}
          />
        </Grid>
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
    taskDrawerOpen: false,
    displayHUD: true,
    taskTimeouts: {
      complete: [],
      incomplete: [],
    },
    preferencesInitialized: false,
  };

  headsUpArea = React.createRef();

  filterButton = React.createRef();

  handleSearchDebounced = debounce(value => {
    const searchTerms = value.toLowerCase().match(/\S+/g) || [];

    this.clearStoredCurrentTask();
    this.setState({ searchTerms }, () => {
      this.saveTaskListPreferences();
    });
    this.closeTaskDrawer();
  }, 200);

  componentDidMount = () => {
    const { taskList } = this.props;

    const taskListId = taskList?.taskListId;
    const localStorageKey = `${TASK_VIEW_STORAGE_PREFIX}${taskListId}`;

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
    this.listenForRealTimeEvents(taskList);
  };

  componentWillUpdate(nextProps) {
    const { taskList } = this.props;

    if (
      (!taskList && nextProps && nextProps.taskList) ||
      (nextProps &&
        nextProps.taskList &&
        taskList.taskListId !== nextProps.taskList.taskListId)
    ) {
      this.listenForRealTimeEvents(nextProps.taskList);
    }
  }

  componentDidUpdate = ({
    isFetching: previousIsFetching,
    members: previousMembers,
  }) => {
    const { isFetching, members } = this.props;
    if (
      previousIsFetching !== isFetching ||
      !equals(members, previousMembers)
    ) {
      this.resetHeader();
    }
  };

  saveTaskListPreferences = () => {
    const { taskList } = this.props;

    const taskListId = taskList?.taskListId;

    if (taskListId) {
      const localStorageKey = `${TASK_VIEW_STORAGE_PREFIX}${taskListId}`;
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

  listenForRealTimeEvents = taskList => {
    if (!taskList) {
      return;
    }

    const { refreshTask } = this.props;

    const socket = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
    });

    const currentTaskListId = taskList.taskListId;
    const channelName = `dock-task-channel-${currentTaskListId}`;

    const channel = socket.subscribe(channelName);

    // Listen to the channel for new entries.
    // The server publishes to this channel whenever a entry is updated
    channel.bind('task-update', data => {
      // Since the app is going to be realtime, we don't want the same item to
      // be shown twice. Device A publishes an entry, all other devices including itself
      // receives the entry, so act like a basic filter
      refreshTask(data.task);
      getTaskListStats(taskList);
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
    const {
      dispatchedMoveTaskBetweenLists,
      selectedTask,
      storeAsCurrentTask,
    } = this.props;

    const { taskTimeouts } = this.state;

    const taskTimeoutArrayKey =
      task.status === 'COMPLETE' ? 'complete' : 'incomplete';

    const timeoutFired =
      Object.values(taskTimeouts)
        .flat()
        .map(({ taskTimeoutId: oldTaskTimeoutId, taskId }) => {
          if (taskId === task?.taskId) {
            clearTimeout(oldTaskTimeoutId);
            this.clearTaskTimeouts(oldTaskTimeoutId);

            return true;
          }

          return false;
        })
        .filter(Boolean).length > 0;

    if (!timeoutFired) {
      const taskTimeoutId = setTimeout(() => {
        if (selectedTask?.taskId === task?.taskId && !task?.parentTaskId) {
          storeAsCurrentTask(null);
          this.closeTaskDrawer();
        }

        dispatchedMoveTaskBetweenLists(task);

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
                taskId: task?.taskId,
              },
            ],
          },
        };
      });
    }
  };

  openTaskDrawer = () => {
    this.setState({
      taskDrawerOpen: true,
    });
  };

  toggleCompletedTasks = () => {
    this.setState(previousState => ({
      completedTasksShown: !previousState.completedTasksShown,
    }));
  };

  closeTaskDrawer = () => {
    const { storeAsCurrentTask } = this.props;

    this.setState(
      {
        taskDrawerOpen: false,
      },
      () => {
        storeAsCurrentTask(null);
      },
    );
  };

  toggleTaskDrawer = () => {
    const { taskDrawerOpen } = this.state;

    if (taskDrawerOpen) {
      this.closeTaskDrawer();
    } else {
      this.openTaskDrawer();
    }
  };

  resetHeader = () => {
    const {
      tasks,
      isFetching,
      title,
      members,
      taskList,
      dispatchedSetHeader,
    } = this.props;

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
                taskCount={tasks.length}
                members={members}
                taskList={taskList}
                resetHeader={this.resetHeader}
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

    return [
      ...tasks.filter(this.searchTaskProperties),
      ...tasks.flatMap(prop('subtasks')).filter(this.searchTaskProperties),
    ];
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
    const mappedTaskListId = task?.taskList?.taskListId;

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
      tasks: incompleteTasks,
      completedTasks,
      markComplete,
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      currentUser,
      isInbox,
      isMultiList,
      taskListId,
      listName,
    } = this.props;
    const { filterBy, slimView, taskDrawerOpen, taskTimeouts } = this.state;

    const archivableTasks = completedTasks.filter(
      isTaskArchivable(currentUser),
    );

    const tasks = [...incompleteTasks, ...archivableTasks].map(
      this.mapInboxTasks({ isInbox }),
    );

    const groupedTasks = groupBy(tasks, task =>
      task.taskList ? task.taskList.listName : '',
    );
    const tasklistCount = [...groupedTasks.keys()].length;

    const tasklistProps = {
      tasks: this.search(tasks),
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
      taskListId,
      status: 'INCOMPLETE',
      search: this.search,
      filterBy,
      isInbox,
      listName,
    };

    if (isInbox && tasks.length === 0) {
      return <InboxNoMessagesAvailable />;
    }

    if (tasks.length === 0 || (!isMultiList && tasklistCount <= 1) || isInbox) {
      return <TaskList {...tasklistProps} />;
    }

    return [...groupedTasks.keys()].map(groupedListName => {
      const tasksCount = groupedTasks.get(groupedListName).length;
      const tasksCountContent = `${tasksCount} ${
        tasksCount === 1 ? 'task' : 'tasks'
      }`;

      const heading = (
        <div>
          <TaskListSectionHeading>
            {groupedListName || 'Inbox'}
          </TaskListSectionHeading>
          <TasklistCount>{tasksCountContent}</TasklistCount>
        </div>
      );

      const currentTaskListId = groupedTasks.get(groupedListName)[0]?.taskList
        ?.taskListId;

      return (
        <React.Fragment key={groupedListName}>
          <TaskListSection
            taskListId={currentTaskListId}
            storeAsCurrentTask={storeAsCurrentTask}
            heading={heading}
            key={groupedListName}
          >
            <TaskList
              listTasks={groupedTasks.get(groupedListName)}
              {...tasklistProps}
            />
          </TaskListSection>
        </React.Fragment>
      );
    });
  };

  renderCompleted = () => {
    const {
      completedTasks: completedOrArchivedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      currentUser,
      isInbox,
      taskListId,
      listName,
    } = this.props;
    const {
      slimView,
      completedTasksShown,
      taskDrawerOpen,
      taskTimeouts,
      filterBy,
    } = this.state;

    const completedTasks = reject(
      isTaskArchivable(currentUser),
      completedOrArchivedTasks,
    ).map(this.mapInboxTasks({ isInbox }));

    const tasklistProps = {
      tasks: this.search(completedTasks),
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
      taskListId,
      status: 'COMPLETE',
      search: this.search,
      filterBy,
      isInbox,
      listName,
    };

    if (completedTasks.length === 0) {
      return null;
    }

    const buttonToggleWord = completedTasksShown ? 'Hide' : 'Show';

    let completedTasksAndSubTasksCount = completedTasks.length;
    completedTasks.forEach(task => {
      completedTasksAndSubTasksCount += task.subtasks?.length ?? 0;
    });

    return (
      <>
        <CompletedButtonRowContainer>
          <SideClickListener heightMax onClick={this.closeTaskDrawer} />
          <StyledButton onClick={this.toggleCompletedTasks}>
            {`${buttonToggleWord} completed tasks (${
              completedTasks.length >= SHOW_MORE_STEP_COUNT
                ? `${SHOW_MORE_STEP_COUNT}+`
                : completedTasksAndSubTasksCount
            })`}
          </StyledButton>
          <SideClickListener heightMax onClick={this.closeTaskDrawer} />
        </CompletedButtonRowContainer>
        {completedTasksShown && <TaskList {...tasklistProps} />}
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
      showSortingStats = true,
      isInbox = false,
      tasks,
      showAddTaskButton = true,
    } = this.props;
    const {
      initialSearchValue,
      slimView,
      taskDrawerOpen,
      displayHUD,
      filterBy,
      preferencesInitialized,
    } = this.state;

    const currentFilterDescription =
      filterOptions.find(({ value }) => value === filterBy)?.description ?? '';

    const toolbarContainerVisible =
      (isInbox && (tasks.length > 0 || isFetching)) || !isInbox;

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
          {showToolbar && (
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
                  <TaskListContainer>
                    {this.renderTasklists()}
                    {this.renderCompleted()}
                    <SideClickListener onClick={this.closeTaskDrawer} />
                  </TaskListContainer>
                  {taskDrawerOpen && (
                    <NewTaskDrawer
                      headsUpAreaRef={this.headsUpArea.current}
                      closeDrawer={this.closeTaskDrawer}
                      taskList={taskList}
                      markComplete={markComplete}
                      onMarkComplete={this.onMarkComplete}
                      isInbox={isInbox}
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
  dispatchedMoveTaskBetweenLists: task => moveTaskBetweenLists(task)(dispatch),
});

const mapStateToProps = store => ({
  selectedTask: store.taskState.selectedTask,
  currentUser: store.userState.userProfile,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskView);
