import * as React from 'react';
import styled from 'styled-components';

import Toolbar from '@material-ui/core/Toolbar';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import MenuIcon from '@material-ui/icons/Menu';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Select from '../components/Select';
import Search from '../components/Search';
import Header from '../components/home/Header';
import AddTask from '../components/home/AddTask';
import TaskList from '../components/home/TaskList';

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

  handleFilterChange = (event) => {
    const { onFilter } = this.props;
    const sortBy = 'CREATED_DT';
    const filterBy = event.target.value;

    this.setState({ filterBy });

    onFilter(filterBy, sortBy);
  }

  handleSearch = () => {

  }

  renderTasklists = () => {
    const { tasks, markComplete } = this.props;
    const groupedTasks = groupBy(tasks, task => (task.taskList ? task.taskList.listName : ''));
    const tasklistCount = Array.from(groupedTasks.keys()).length;

    if (tasks.length === 0 || tasklistCount <= 1) {
      return <TaskList tasks={tasks} markComplete={markComplete} />;
    }

    return (
      Array.from(groupedTasks.keys()).map(taskListId => (
        <React.Fragment key={taskListId}>
          <h5>{taskListId}</h5>
          <TaskList tasks={groupedTasks.get(taskListId)} markComplete={markComplete} />
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
    } = this.props;

    if (!showingCompletedTasks) {
      return <StyledButton onClick={pullCompletedTasks}>Load completed tasks</StyledButton>;
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

    return (
      <React.Fragment>
        <StyledButton onClick={pullCompletedTasks}>Hide completed tasks</StyledButton>
        <TaskList tasks={completedTasks} markComplete={markComplete} />
      </React.Fragment>
    );
  }

  render() {
    const {
      tasks, isFetching, downloadPDF, title, members,
    } = this.props;
    const { filterBy } = this.state;

    return (
      <div className="off-canvas-content" data-off-canvas-content="true">
        <div className="row expanded collapse">
          <div className="large-12 columns" style={{ minHeight: '100%', background: '#f5f8fa' }}>
            <Header
              isFetching={isFetching}
              title={title}
              taskCount={tasks.length}
              members={members}
            />
            <AddTask onClick={() => {}} />
            <Toolbar style={{ padding: '0 38px 0 48px' }}>
              <Select
                onChange={this.handleFilterChange}
                value={filterBy}
                options={[
                  { value: '', description: 'Unfiltered' },
                  { value: 'ASSIGNED_TO_ME', description: 'Assigned to me' }, // TODO: 
                  { value: 'CREATED_BY_ME', description: 'Created by me' },
                  { value: 'OVERDUE', description: 'Overdue' },
                  { value: 'DUE_TODAY', description: 'Due Today' },
                  { value: 'DUE_THIS_WEEK', description: 'Due This Week' },
                  { value: 'DUE_NEXT_WEEK', description: 'Due Next Week' },
                ]}
              />
              <Search onChange={this.handleSearch} style={{ marginLeft: '14px' }} />
              <div style={{ marginLeft: 'auto', marginRight: '-8px' }}>
                <IconButton aria-label="Disable notifications" style={{ padding: '8px' }}>
                  <NotificationsOffIcon style={{ width: '20px', height: '20px' }}>alarm</NotificationsOffIcon>
                </IconButton>
                <IconButton onClick={downloadPDF} aria-label="Disable notifications" style={{ padding: '8px' }}>
                  <PrintIcon style={{ width: '20px', height: '20px' }}>alarm</PrintIcon>
                </IconButton>
                <IconButton aria-label="Disable notifications" style={{ padding: '8px' }}>
                  <MenuIcon style={{ width: '20px', height: '20px' }}>alarm</MenuIcon>
                </IconButton>
              </div>
            </Toolbar>
            {isFetching
              ? (
                <FadeContainer>
                  <Fade in={isFetching} unmountOnExit style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}>
                    <ProgressIcon />
                  </Fade>
                </FadeContainer>
              )
              : (
                <TaskListContainer>
                  {this.renderTasklists()}
                  {this.renderCompleted()}
                </TaskListContainer>
              )}
          </div>
        </div>
      </div>

    );
  }
}

export default TaskView;
