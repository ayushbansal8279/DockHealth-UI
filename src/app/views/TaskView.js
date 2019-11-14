import { List, ListItem, Popover } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import ProgressIcon from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import equals from 'ramda/es/equals';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setHeader } from '../actions/header-actions';
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
  flex: 2;
  padding: 0 0.375rem;
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
    searchTerms: [],
    slimView: false,
    taskDrawerOpen: false,
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

  componentDidUpdate = ({
    isFetching: prevIsFetching,
    members: prevMembers,
  }) => {
    const { isFetching, members } = this.props;
    if (prevIsFetching !== isFetching || !equals(members, prevMembers)) {
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

  renderTasklists = () => {
    const {
      tasks,
      markComplete,
      storeAsCurrentTask,
      markAsUnread,
      selectedTaskId,
    } = this.props;
    const { slimView, taskDrawerOpen } = this.state;

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
      taskDrawerOpen,
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
    const { isFetching, downloadPDF, taskList, showToolbar } = this.props;
    const { slimView, taskDrawerOpen } = this.state;

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
          <HeadsUpArea ref={this.headsUpArea} taskList={taskList} />
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
                {!taskDrawerOpen && (
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
});

export default connect(
  null,
  mapDispatchToProps,
)(TaskView);
