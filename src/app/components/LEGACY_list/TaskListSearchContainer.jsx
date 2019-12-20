import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import { AnimatePresence } from 'framer-motion';
import React, { PureComponent, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/groupTasksByList';
import useBoolean from '../../hooks/useBoolean';
import CollapseIcon from '../../img/collapse.svg';
import FilterActiveIcon from '../../img/filter-active.svg';
import FilterIcon from '../../img/filter.svg';
import TaskView from '../../views/TaskView';
import {
  FilterByBoldLabel,
  FilterByLabel,
  FilterByLinkLabel,
  FilterByTextContainer,
  StyledSlimViewSwitch,
  StyledToolbar,
  ToolbarContainer,
} from '../../views/TaskView.Styled';
import CubesLoader from '../common/CubesLoader';
import PatientsTasklistEditable from '../patients/PatientsTasklistEditable';
import NewTaskDrawer from '../taskView/NewTaskDrawer';
import TaskListAction from '../taskView/TaskListAction';

const TaskDrawerContainer = styled.div`
  flex: 1.4;
`;

const CubesLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

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
  font-size: 24px;
  font-weight: 600;
  padding: 15px 13.5px 19px 27px;
`;

export const TaskListSectionContainer = styled.div`
  border: solid 2px #ddf2f7;
  background: #fff;
  padding: 18px 27px 27px 24px;

  :not(:first-child) {
    margin-top: 4px;
  }
`;

export const TaskListSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TaskListSectionHeading = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #0ca1c7;
`;

const StyledButton = styled(({ isCollapsed, ...props }) => (
  <IconButton {...props} />
))`
  && {
    height: 36px;
    width: 36px;
    padding: 0;
    ${({ isCollapsed }) => isCollapsed && 'transform: rotate(180deg);'}
  }
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

const selectCurrentTask = ({ closeTaskDrawer, dispatch }) => task => {
  if (!task) {
    closeTaskDrawer();
  }
  TaskActions.storeAsCurrentTask(task)(dispatch);
};

const renderTaskListSection = ({
  dispatch,
  closeTaskDrawer,
  ...otherProps
}) => ({ listName, taskListId, tasks, completedTasks }) => {
  return (
    <div key={`taskList_${listName}`}>
      <div>
        {tasks && tasks.length > 0 && (
          <TaskListSection heading={listName} key={listName}>
            <PatientsTasklistEditable
              tasks={tasks}
              completedTasks={completedTasks}
              submitTask={description =>
                TaskActions.saveTask({ description, taskListId })(dispatch)
              }
              isAddTaskEnabled={false}
              selectCurrentTask={selectCurrentTask({
                closeTaskDrawer,
                dispatch,
              })}
              {...otherProps}
            />
          </TaskListSection>
        )}
      </div>
    </div>
  );
};

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
  style,
  headingStyle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <TaskListSectionContainer style={style}>
      <TaskListSectionHeader>
        <TaskListSectionHeading style={headingStyle}>
          {heading}
        </TaskListSectionHeading>
        {!hideCollapse && (
          <StyledButton isCollapsed={isCollapsed} onClick={toggleIsCollapsed}>
            <img src={CollapseIcon} alt="Collapse Details" />
          </StyledButton>
        )}
      </TaskListSectionHeader>
      {!isCollapsed && children}
    </TaskListSectionContainer>
  );
};

const TaskListLayout = ({ searchedTasks, isFetching, slimView }) => {
  const dispatch = useDispatch();
  const [taskDrawerOpen, openTaskDrawer, hideTaskDrawer] = useBoolean(false);
  const selectedTaskId = useSelector(
    store => store.taskState.selectedTask?.taskId,
  );

  const closeTaskDrawer = () => {
    hideTaskDrawer();
    TaskActions.storeAsCurrentTask(null)(dispatch);
  };

  const lists = groupTasksAndCompletedTasksByList(
    searchedTasks.tasks,
    searchedTasks.completedTasks,
  );

  return (
    <>
      {isFetching && (
        <CubesLoaderContainer>
          <CubesLoader size={40} />
        </CubesLoaderContainer>
      )}
      {!isFetching && (!lists || lists.length === 0) ? (
        <Grid container justify="center">
          <b>No matching tasks</b>
        </Grid>
      ) : (
        <>
          <TaskListContainerWrapper>
            {lists.map(
              renderTaskListSection({
                dispatch,
                closeTaskDrawer,
                openTaskDrawer,
                taskDrawerOpen,
                slimView,
                selectedTaskId,
              }),
            )}
          </TaskListContainerWrapper>
          {taskDrawerOpen && (
            <TaskDrawerContainer>
              <NewTaskDrawer closeDrawer={closeTaskDrawer} />
            </TaskDrawerContainer>
          )}
        </>
      )}
    </>
  );
};

class TaskListSearchContainer extends PureComponent {
  state = {
    filterBy: '',
    filterPopoverOpen: false,
    searchTerms: [],
    slimView: false,
  };

  filterButton = React.createRef();

  componentWillUnmount = () => {
    const { taskActions } = this.props;
    taskActions.resetTaskSearch();
  };

  switchSlimView = () => {
    this.setState(previousState => ({
      slimView: !previousState.slimView,
    }));
  };

  handleFilterChange = filterBy => {
    const { onFilter } = this.props;
    const sortBy = '';

    this.setState({
      filterBy,
    });

    onFilter(filterBy, sortBy);
  };

  handleSearch = event => {
    const { value } = event.target;
    const searchTerms = value.toLowerCase().match(/\S+/g) || [];

    this.setState({ searchTerms });
  };

  search = tasks => {
    if (tasks?.length === 0) {
      return tasks;
    }

    const { searchTerms } = this.state;
    const isMatch = text =>
      searchTerms.every(term => text?.toLowerCase().includes(term));

    return tasks.filter(({ description }) => isMatch(description));
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

  renderList(taskListId, listName, taskStatus, tasks, members) {
    const {
      userId,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      taskActions: {
        markComplete,
        storeAsCurrentTask,
        markAsUnread,
        toggleTaskPriority,
        addTaskComment,
      },
    } = this.props;

    const title = listName;

    const taskViewProps = {
      userId,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userId, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.handleFilterChange,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title,
      showToolbar: false,
    };

    return <TaskView {...taskViewProps} />;
  }

  render() {
    const { tasks, completedTasks, isFetching } = this.props;

    const toolbarContainerVisible = tasks.length > 0;
    const { slimView, filterBy } = this.state;
    const currentFilterDescription =
      filterOptions.find(({ value }) => value === filterBy)?.description ?? '';

    const searchedTasks = {
      tasks: this.search(tasks),
      completedTasks: this.search(completedTasks),
    };

    return (
      <div className="tasks-container-new">
        {toolbarContainerVisible && (
          <StyledToolbar>
            <Grid
              container
              alignItems="center"
              justify={toolbarContainerVisible ? 'space-between' : 'flex-end'}
            >
              <ToolbarContainer>
                <StyledSlimViewSwitch
                  onClick={this.switchSlimView}
                  slimView={slimView}
                  variant="contained"
                />
                <TaskListAction
                  alt="Filter"
                  activeIcon={FilterActiveIcon}
                  backgroundColor="#fff"
                  icon={FilterIcon}
                  active={Boolean(filterBy)}
                  onClick={filterBy ? this.clearFilter : this.openFilterPopover}
                  ref={this.filterButton}
                >
                  Filter
                </TaskListAction>
              </ToolbarContainer>
            </Grid>
          </StyledToolbar>
        )}
        <Grid container direction="column">
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
          {tasks && (
            <TaskListLayout
              searchedTasks={searchedTasks}
              isFetching={isFetching}
              slimView={slimView}
            />
          )}
          {this.renderFilterPopover()}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasklists: state.taskListState.tasklist,
    tasks: state.taskState.tasks,
    completedTasks: state.taskState.completedTasks,
    isFetching: state.taskState.isFetching,
    isCompletedTasksFetching: state.taskState.isCompletedTasksFetching,
    showingCompletedTasks: state.taskState.showingCompletedTasks,
    user: state.userState.user,
    userId: state.userState.userProfile.userId,
    selectedTaskId: state.taskState.selectedTaskId,
    selectedTask: state.taskState.selectedTask,
    currentTaskHistory: state.taskState.currentTaskHistory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearchContainer);
