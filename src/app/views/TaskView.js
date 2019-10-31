import ButtonBase from '@material-ui/core/ButtonBase';
import ProgressIcon from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setHeader } from '../actions/header-actions';
import TaskList from '../components/task/TaskList';
import AddTaskButton from '../components/taskView/AddTaskButton';
import Header from '../components/taskView/Header';
import HeadsUpArea from '../components/taskView/HeadsUpArea';
import NewTaskDrawer from '../components/taskView/NewTaskDrawer';
import Search from '../components/taskView/Search';
import Select from '../components/taskView/Select';
import TaskListAction from '../components/taskView/TaskListAction';
import PrintIcon from '../img/print.svg';
import { StyledSlimViewSwitch, TaskViewGrid } from './TaskView.styled';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const TaskListContainer = styled.div`
  padding: 0 8px;
  flex: 1;
`;

const StyledButton = styled(ButtonBase)`
  && {
    display: flex;
    margin: 33px auto;
    width: 224px;
    background: #0ca1c7;
    border-radius: 57px;
    height: 30px;
    padding: 8px 37px;
    font-size: 14px;
    color: #fff;
  }
`;

class TaskView extends Component {
  state = {
    filterBy: '',
    searchTerms: [],
    slimView: false,
    taskDrawerOpen: false,
  };

  headsUpArea = React.createRef();

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

  componentDidUpdate = ({ isFetching: prevIsFetching }) => {
    const { isFetching } = this.props;
    if (prevIsFetching !== isFetching) {
      this.resetHeader();
    }
  };

  openTaskDrawer = () => {
    this.setState({
      taskDrawerOpen: true,
    });
  };

  closeTaskDrawer = () => {
    const { storeAsCurrentTask } = this.props;

    this.setState({
      taskDrawerOpen: false,
    });
    setTimeout(() => {
      storeAsCurrentTask(null);
    }, 250);
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
    this.setState({ filterBy });

    onFilter(filterBy, sortBy);
  };

  handleSearch = e => {
    const { value } = e.target;
    const searchTerms = value.toLowerCase().match(/[\S]+/g) || [];

    this.clearStoredCurrentTask();
    this.setState({ searchTerms });
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
    const { taskDrawerOpen } = this.state;

    if (!taskDrawerOpen) {
      storeAsCurrentTask(null);
    }
    this.toggleTaskDrawer();
  };

  renderTasklists = () => {
    const {
      tasks,
      markComplete,
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
    } = this.props;
    const { slimView } = this.state;

    const groupedTasks = groupBy(tasks, task =>
      task.taskList ? task.taskList.listName : '',
    );
    const tasklistCount = Array.from(groupedTasks.keys()).length;

    const tasklistProps = {
      tasks: this.search(tasks),
      markComplete: (task, status) => {
        markComplete(task, status, 'INCOMPLETE');
      },
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      slimView,
      openTaskDrawer: this.openTaskDrawer,
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
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      pullCompletedTasks,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
    } = this.props;
    const { slimView } = this.state;

    if (!showingCompletedTasks) {
      return (
        <StyledButton onClick={pullCompletedTasks}>
          Show completed tasks
        </StyledButton>
      );
    }

    if (isCompletedTasksFetching) {
      return (
        <StyledButton onClick={pullCompletedTasks}>
          Fetching completed tasks...
        </StyledButton>
      );
    }

    if (completedTasks == null || completedTasks.length === 0) {
      return (
        <StyledButton onClick={pullCompletedTasks}>
          No completed tasks
        </StyledButton>
      );
    }

    const tasklistProps = {
      tasks: this.search(completedTasks),
      markComplete: (task, status) => {
        markComplete(task, status, 'COMPLETE');
      },
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
      slimView,
      openTaskDrawer: this.openTaskDrawer,
    };

    return (
      <>
        <StyledButton onClick={pullCompletedTasks}>
          Hide completed tasks
        </StyledButton>
        <TaskList {...tasklistProps} />
      </>
    );
  };

  render() {
    const {
      tasks,
      completedTasks,
      isFetching,
      selectedTaskId,
      downloadPDF,
      taskList,
      showToolbar,
    } = this.props;
    const { filterBy, slimView, taskDrawerOpen } = this.state;

    const taskId = selectedTaskId != null && selectedTaskId;
    const unfinishedTasks = tasks.flatMap(task => [task, ...task.subtasks]);
    const finishedTasks = completedTasks.flatMap(task => [
      task,
      ...task.subtasks,
    ]);
    const allTasks = [...unfinishedTasks, ...finishedTasks];
    const task = allTasks.find(t => t.taskId === taskId);

    // TODO: Optimize!!!
    const isCompletedTaskSelected =
      task && !unfinishedTasks.find(t => t.taskId === task.taskId);
    const isMainTaskComplete =
      task &&
      task.parentTaskId &&
      allTasks.find(
        t => t.taskId === task.parentTaskId && t.status === 'COMPLETE',
      );

    const isInbox = tasks.length !== 0 && tasks[0].taskList === null;
    const taskListId = taskList?.taskListId;

    return (
      <div>
        <HeadsUpArea ref={this.headsUpArea} taskList={taskList} />
        <TaskViewGrid container>
          <NewTaskDrawer
            headsUpAreaRef={this.headsUpArea.current}
            open={taskDrawerOpen}
            closeDrawer={this.closeTaskDrawer}
            taskList={taskList}
          />
          <AddTaskButton
            addingNewTask={taskDrawerOpen}
            onClick={this.onAddTaskButtonClick}
          />
          <Grid item xs={12}>
            {showToolbar && (
              <Toolbar>
                <Grid container justify="space-between">
                  <div>
                    <StyledSlimViewSwitch
                      onClick={this.switchSlimView}
                      slimView={slimView}
                      variant="contained"
                    />
                    <Select
                      updateFilter={this.handleFilterChange}
                      value={filterBy}
                      options={[
                        { value: '', description: 'Filter' },
                        {
                          value: 'ASSIGNED_TO_ME',
                          description: 'Assigned to me',
                        }, // TODO:
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
                      ]}
                    />
                    <Search
                      onChange={this.handleSearch}
                      style={{ marginLeft: '14px' }}
                    />
                    <TaskListAction
                      onClick={downloadPDF}
                      icon={PrintIcon}
                      alt="Print"
                    >
                      Print
                    </TaskListAction>
                  </div>
                </Grid>
              </Toolbar>
            )}
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
                {/* {task && (
                  <TaskDetails
                    addTaskComment={comment =>
                      addTaskComment(task, { comment })
                    }
                    userId={userId}
                    selectedTask={task}
                    close={this.handleClose}
                    markComplete={(_task, status) => {
                      markComplete(
                        _task,
                        status,
                        isCompletedTaskSelected ? 'COMPLETE' : 'INCOMPLETE',
                      );
                    }}
                    toggleTaskPriority={toggleTaskPriority}
                    isMainTaskComplete={isMainTaskComplete}
                    storeAsCurrentTask={storeAsCurrentTask}
                    markAsUnread={markAsUnread}
                  />
                )} */}
              </div>
            )}
          </Grid>
        </TaskViewGrid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchedSetHeader: setHeader(dispatch),
});

export default connect(
  null,
  mapDispatchToProps,
)(TaskView);
