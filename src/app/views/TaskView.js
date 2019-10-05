import * as React from 'react';
import styled from 'styled-components';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import PrintIcon from '../img/print.svg';
import Select from '../components/Select';
import Search from '../components/Search';
import Header from '../components/home/Header';
import AddTask from '../components/home/AddTask';
import TaskList from '../components/home/TaskList';
import TaskDetails from '../components/home/TaskDetails';
import TaskListAction from '../components/TaskListAction';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
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

class TaskView extends React.Component {
  state = {
    filterBy: '',
    searchTerms: [],
  }

  refresh = () => {
    const {
      actions,
      patientActions,
    } = this.props;

    actions.loading();
    this.closeAuditHistory();

    actions.getInboxTasks('INCOMPLETE');

    patientActions.getAllPatients();
  }

  handleFilterChange = (filterBy) => {
    const { onFilter } = this.props;
    const sortBy = 'CREATED_DT';

    this.setState({ filterBy });

    onFilter(filterBy, sortBy);
  }

  handleSearch = (e) => {
    const { value } = e.target;
    const searchTerms = value.toLowerCase().match(/[\S]+/g) || [];
    this.setState({ searchTerms });
  }

  search = (tasks) => {
    if (tasks?.length === 0) {
      return tasks;
    }

    const { searchTerms } = this.state;
    const isMatch = text => searchTerms.every(term => text?.toLowerCase().includes(term));
    const filteredTasks = searchTerms.length === 0
      ? tasks
      : tasks.filter(({ description }) => isMatch(description));

    return filteredTasks;
  }

  handleClose = () => {
    const { storeAsCurrentTask } = this.props;
    storeAsCurrentTask(null);
  }

  renderTasklists = () => {
    const {
      tasks, markComplete, storeAsCurrentTask, selectedTaskId,
    } = this.props;

    const groupedTasks = groupBy(tasks, task => (task.taskList ? task.taskList.listName : ''));
    const tasklistCount = Array.from(groupedTasks.keys()).length;

    const isCollapsed = selectedTaskId != null;

    const tasklistProps = {
      tasks: this.search(tasks),
      markComplete: (task, status) => { markComplete(task, status, 'INCOMPLETE'); },
      storeAsCurrentTask,
      hideDate: isCollapsed,
      hideTags: isCollapsed,
      hidePriority: isCollapsed,
      selectedTaskId,
    };

    if (tasks.length === 0 || tasklistCount <= 1) {
      return <TaskList {...tasklistProps} />;
    }

    return (
      Array.from(groupedTasks.keys()).map(taskListId => (
        <React.Fragment key={taskListId}>
          <h5>{taskListId}</h5>
          <TaskList {...tasklistProps} />
        </React.Fragment>
      ))
    );
  }

  renderCompleted = () => {
    const {
      completedTasks,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      pullCompletedTasks,
      selectedTaskId,
      storeAsCurrentTask,
    } = this.props;

    if (!showingCompletedTasks) {
      return <StyledButton onClick={pullCompletedTasks}>Show completed tasks</StyledButton>;
    }

    if (isCompletedTasksFetching) {
      return (
        <StyledButton onClick={pullCompletedTasks}>
          Fetching completed tasks...
        </StyledButton>
      );
    }

    if (completedTasks == null || completedTasks.length === 0) {
      return <StyledButton onClick={pullCompletedTasks}>No completed tasks</StyledButton>;
    }

    const isCollapsed = selectedTaskId != null;
    const tasklistProps = {
      tasks: this.search(completedTasks),
      markComplete: (task, status) => { markComplete(task, status, 'COMPLETE'); },
      storeAsCurrentTask,
      hideDate: isCollapsed,
      hideTags: isCollapsed,
      hidePriority: isCollapsed,
      selectedTaskId,
    };

    return (
      <React.Fragment>
        <StyledButton onClick={pullCompletedTasks}>Hide completed tasks</StyledButton>
        <TaskList {...tasklistProps} />
      </React.Fragment>
    );
  }

  render() {
    const {
      userId,
      tasks,
      completedTasks,
      isFetching,
      selectedTaskId,
      downloadPDF,
      title,
      members,
      markComplete,
      toggleTaskPriority,
      addTaskComment,
      taskList,
    } = this.props;
    const { filterBy } = this.state;

    const taskId = selectedTaskId != null && selectedTaskId;
    const unfinishedTasks = tasks.flatMap(task => [task, ...task.subtasks]);
    const finishedTasks = completedTasks.flatMap(task => [task, ...task.subtasks]);
    const allTasks = [...unfinishedTasks, ...finishedTasks];
    const task = allTasks.find(t => t.taskId === taskId);

    const groupedTasks = groupBy(tasks, t => (t.taskList ? t.taskList.listName : ''));
    const tasklistCount = Array.from(groupedTasks.keys()).length;
    const isSingleTaskList = tasklistCount === 1;
    const isInbox = tasks.length !== 0 && tasks[0].taskList === null;

    return (
      <div className="off-canvas-content" data-off-canvas-content="true" style={{ minHeight: '100%' }}>
        <div className="row expanded collapse" style={{ minHeight: '100%' }}>
          <div className="large-12 columns" style={{ minHeight: '100%', background: '#f5f8fa' }}>
            <Header
              isFetching={isFetching}
              title={title}
              taskCount={tasks.length}
              members={members}
              taskList={taskList}
            />
            {this.props.showToolbar && isSingleTaskList && !isInbox && <AddTask taskListId={tasks[0].taskList.taskListId} style={{ padding: '7px 38px 0 48px' }} />}
            {this.props.showToolbar
            && (
              <Toolbar style={{ padding: '0 38px 0 48px' }}>
                <Select
                  updateFilter={this.handleFilterChange}
                  value={filterBy}
                  options={[
                    { value: '', description: 'Filter' },
                    { value: 'ASSIGNED_TO_ME', description: 'Assigned to me' }, // TODO:
                    { value: 'CREATED_BY_ME', description: 'Created by me' },
                    { value: 'OVERDUE', description: 'Overdue' },
                    { value: 'DUE_TODAY', description: 'Due Today' },
                    { value: 'DUE_THIS_WEEK', description: 'Due This Week' },
                    { value: 'DUE_NEXT_WEEK', description: 'Due Next Week' },
                  ]}
                />
                <Search onChange={this.handleSearch} style={{ marginLeft: '14px' }} />
                <div style={{ marginLeft: 'auto' }}>
                  <TaskListAction onClick={downloadPDF} icon={PrintIcon} alt="Print">
                    Print
                  </TaskListAction>
                </div>
              </Toolbar>
            )
            }
            {isFetching
              ? (
                <FadeContainer>
                  <Fade in={isFetching} unmountOnExit style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}>
                    <ProgressIcon />
                  </Fade>
                </FadeContainer>
              )
              : (
                <div style={{ display: 'flex' }}>
                  <TaskListContainer>
                    {this.renderTasklists()}
                    {this.renderCompleted()}
                  </TaskListContainer>
                  {task && (
                    <TaskDetails
                      addTaskComment={comment => addTaskComment(task, ({ comment }))}
                      userId={userId}
                      selectedTask={task}
                      close={this.handleClose}
                      markComplete={markComplete}
                      toggleTaskPriority={toggleTaskPriority}
                    />
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

    );
  }
}

export default TaskView;
