import { List, ListItem, Popover } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import ProgressIcon from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import equals from 'ramda/es/equals';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import map from 'ramda/es/map';
import filter from 'ramda/es/filter';

import { setHeader } from '../actions/header-actions';
import { moveTaskBetweenLists } from '../actions/task-actions';
import TaskList from '../components/task/TaskList';
import Header from '../components/taskView/Header';
import HeadsUpArea from '../components/taskView/HeadsUpArea';
import NewTaskDrawer from '../components/taskView/NewTaskDrawer';
import Search from '../components/taskView/Search';
import { AddTaskButton } from '../components/taskView/TaskDrawerButtons';
import TaskListAction from '../components/taskView/TaskListAction';
import FilterIcon from '../img/filter.svg';
import PrintIcon from '../img/print.svg';
import SortingStatsActiveIcon from '../img/sorting-stats-active.svg';
import SortingStatsIcon from '../img/sorting-stats.svg';
import {
  StyledSlimViewSwitch,
  StyledToolbar,
  TableWrapper,
  TaskViewGrid,
  ToolbarContainer,
} from './TaskView.styled';

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

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const TaskListContainer = styled.div`
  flex: 2;
  padding: 0 0.375rem;
`;

const StyledButton = styled(ButtonBase)`
  && {
    display: flex;
    margin: 2rem auto;
    background: #0ca1c7;
    border-radius: 1rem;
    height: 2rem;
    padding: 0.5rem 2.25rem;
    font-size: 0.875rem;
    color: #fff;
  }
`;

const filterOptions = [
  {
    value: '',
    description: 'Clear',
  },
  {
    value: 'ASSIGNED_TO_ME',
    description: 'Assigned to me',
  },
  {
    value: 'CREATED_BY_ME',
    description: 'Created by me',
  },
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

class TaskView extends Component {
  state = {
    filterPopoverOpen: false,
    completedTasksShown: false,
    searchTerms: [],
    slimView: false,
    taskDrawerOpen: false,
    displayHUD: true,
    taskTimeouts: {
      complete: [],
      incomplete: [],
    },
  };

  headsUpArea = React.createRef();

  filterButton = React.createRef();

  refresh = () => {
    const { actions, patientActions } = this.props;

    actions.loading();
    this.closeAuditHistory();

    actions.getInboxTasks('INCOMPLETE');

    patientActions.getAllPatients();
  };

  componentDidMount = () => {
    this.resetHeader();
  };

  componentWillUnmount = () => {
    const { taskTimeouts } = this.state;

    Object.values(taskTimeouts)
      .flat()
      .forEach(({ taskTimeoutId }) => {
        clearTimeout(taskTimeoutId);
      });
  };

  componentDidUpdate = ({
    isFetching: prevIsFetching,
    members: prevMembers,
  }) => {
    const { isFetching, members } = this.props;
    if (prevIsFetching !== isFetching || !equals(members, prevMembers)) {
      this.resetHeader();
    }
  };

  clearTaskTimeouts = (taskTimeoutId, callback = () => {}) => {
    this.setState(prevState => {
      return {
        taskTimeouts: map(
          filter(
            taskTimeoutData => taskTimeoutData.taskTimeoutId !== taskTimeoutId,
          ),
          prevState.taskTimeouts,
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

      this.setState(prevState => {
        const previousTaskTimeouts =
          prevState.taskTimeouts[taskTimeoutArrayKey];

        return {
          taskTimeouts: {
            ...prevState.taskTimeouts,
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
    this.setState(prevState => ({
      completedTasksShown: !prevState.completedTasksShown,
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
  };

  clearStoredCurrentTask = () => {
    const { storeAsCurrentTask } = this.props;

    storeAsCurrentTask(null);
  };

  handleFilterChange = filterBy => {
    const { onFilter } = this.props;
    const sortBy = 'CREATED_DT';

    this.clearStoredCurrentTask();

    onFilter(filterBy, sortBy);
  };

  handleSearch = e => {
    const { value } = e.target;
    const searchTerms = value.toLowerCase().match(/[\S]+/g) || [];

    this.clearStoredCurrentTask();
    this.setState({ searchTerms });
    this.closeTaskDrawer();
  };

  search = tasks => {
    if (tasks?.length === 0) {
      return tasks;
    }

    const { searchTerms } = this.state;
    const isMatch = text =>
      searchTerms.every(term => text?.toLowerCase().includes(term));
    const filteredTasks = tasks.filter(({ description }) =>
      isMatch(description),
    );

    return filteredTasks;
  };

  toggleHUD = () => {
    this.setState(prevState => ({
      displayHUD: !prevState.displayHUD,
    }));
  };

  handleClose = () => {
    const { storeAsCurrentTask } = this.props;
    storeAsCurrentTask(null);
  };

  switchSlimView = () => {
    this.setState(prevState => ({
      slimView: !prevState.slimView,
    }));
  };

  onAddTaskButtonClick = () => {
    const { storeAsCurrentTask } = this.props;

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
              {value ? description : <em>{description}</em>}
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

  renderTasklists = () => {
    const {
      tasks,
      markComplete,
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      currentUser,
    } = this.props;
    const { slimView, taskDrawerOpen, taskTimeouts } = this.state;

    const groupedTasks = groupBy(tasks, task =>
      task.taskList ? task.taskList.listName : '',
    );
    const tasklistCount = Array.from(groupedTasks.keys()).length;

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
    };

    if (tasks.length === 0 || tasklistCount <= 1) {
      return <TaskList {...tasklistProps} />;
    }

    return Array.from(groupedTasks.keys()).map(taskListId => (
      <React.Fragment key={taskListId}>
        <h5>{taskListId}</h5>
        <TaskList {...tasklistProps} />
      </React.Fragment>
    ));
  };

  renderCompleted = () => {
    const {
      completedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      currentUser,
    } = this.props;
    const {
      slimView,
      completedTasksShown,
      taskDrawerOpen,
      taskTimeouts,
    } = this.state;

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
    };

    const buttonToggleWord = completedTasksShown ? 'Hide' : 'Show';

    return (
      <>
        <StyledButton onClick={this.toggleCompletedTasks}>
          {`${buttonToggleWord} completed tasks (${completedTasks.length})`}
        </StyledButton>
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
    } = this.props;
    const { slimView, taskDrawerOpen, displayHUD } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1152px',
          }}
        >
          {displayHUD && (
            <HeadsUpArea ref={this.headsUpArea} taskList={taskList} />
          )}
          {showToolbar && (
            <StyledToolbar>
              <Grid container alignItems="center" justify="space-between">
                <ToolbarContainer>
                  <StyledSlimViewSwitch
                    onClick={this.switchSlimView}
                    slimView={slimView}
                    variant="contained"
                  />
                  <TaskListAction
                    alt="Filter"
                    backgroundColor="#fff"
                    icon={FilterIcon}
                    onClick={this.openFilterPopover}
                    ref={this.filterButton}
                  >
                    Filter
                  </TaskListAction>
                  <TaskListAction
                    alt="Filter"
                    active
                    activeIcon={SortingStatsActiveIcon}
                    backgroundColor="#fff"
                    icon={SortingStatsIcon}
                    onClick={this.toggleHUD}
                  >
                    Sorting & Stats
                  </TaskListAction>
                  <Search onChange={this.handleSearch} />
                  <TaskListAction
                    alt="Print"
                    backgroundColor="#fff"
                    icon={PrintIcon}
                    onClick={downloadPDF}
                  >
                    Print
                  </TaskListAction>
                </ToolbarContainer>
                {(selectedTask || !taskDrawerOpen) && (
                  <AddTaskButton onClick={this.onAddTaskButtonClick} />
                )}
              </Grid>
            </StyledToolbar>
          )}
          <TaskViewGrid container wrap="nowrap">
            <TableWrapper taskDrawerOpen={taskDrawerOpen}>
              {isFetching ? (
                <FadeContainer>
                  <Fade
                    in={isFetching}
                    unmountOnExit
                    style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}
                  >
                    <ProgressIcon />
                  </Fade>
                </FadeContainer>
              ) : (
                <div style={{ display: 'flex' }}>
                  <TaskListContainer>
                    {this.renderTasklists()}
                    {this.renderCompleted()}
                  </TaskListContainer>
                  {taskDrawerOpen && (
                    <NewTaskDrawer
                      headsUpAreaRef={this.headsUpArea.current}
                      closeDrawer={this.closeTaskDrawer}
                      taskList={taskList}
                      markComplete={markComplete}
                      onMarkComplete={this.onMarkComplete}
                    />
                  )}
                </div>
              )}
            </TableWrapper>
          </TaskViewGrid>
          {this.renderFilterPopover()}
        </div>
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
