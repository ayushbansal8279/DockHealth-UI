import React, { PureComponent, useCallback, useState } from 'react';
import Moment from 'react-moment';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import { AnimatePresence } from 'framer-motion';

import useBoolean from '../../hooks/useBoolean';

import { saveTask, storeAsCurrentTask, resetTaskSearch } from '../../actions/task-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/groupTasksByList';
import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskView from '../../views/TaskView';
import MemberInitials from '../members/MemberInitials';

import CubesLoader from '../../components/common/CubesLoader';

// import { TaskListSection } from '../patients/TaskList';
import PatientsTasklistEditable from '../patients/PatientsTasklistEditable';
import NewTaskDrawer from '../taskView/NewTaskDrawer';
import TaskListAction from '../taskView/TaskListAction';
import Search from '../taskView/Search';
import CollapseIcon from '../../img/collapse.svg';
import FilterActiveIcon from '../../img/filter-active.svg';
import FilterIcon from '../../img/filter.svg';
import PrintIcon from '../../img/print.svg';

import {
  CompletedButtonRowContainer,
  FadeContainer,
  FilterByBoldLabel,
  FilterByLabel,
  FilterByLinkLabel,
  FilterByTextContainer,
  InboxNoMessagesAvailable,
  SideClickListener,
  StyledSlimViewSwitch,
  StyledToolbar,
  TableWrapper,
  ToolbarContainer,
} from '../../views/TaskView.styled';

const TaskDrawerContainer = styled.div`
  flex: 1.4;
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

  // Lists TaskLists
  const TaskListLayout = ({ searchedTasks, isFetching, slimView }) => {
    const dispatch = useDispatch();
    const [taskDrawerOpen, openTaskDrawer, closeTaskDrawer] = useBoolean(false);

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
    }

    const lists = groupTasksAndCompletedTasksByList(searchedTasks.tasks, searchedTasks.completedTasks);

    // const groupedTasks = groupBy(
    //   searchedTasks.tasks,
    //   task => task.taskList.listName,
    // );
    // var listMap = Array.from(groupedTasks.keys())

    const selectedTaskList = undefined;

    return (
      <>
      {isFetching &&
        <FadeContainer>
          <Fade
            in={isFetching}
            unmountOnExit
            style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}
          >
            <CubesLoader size={40} />
          </Fade>
        </FadeContainer>
      }
      {(!isFetching && (!lists || lists.size == 0)) ?
        <div>
          <p className="light-gray" style={{ fontWeight: 'bold' }}>
            No matching tasks
          </p>
        </div>
      : <>
          <p className="light-gray" style={{ fontWeight: 'bold'}}>
            {/* <span>Tasks found</span> */}
          </p>
          <TaskListContainerWrapper>
            {lists.map(
                renderTaskListSection({
                  dispatch,
                  closeTaskDrawer,
                  openTaskDrawer,
                  taskDrawerOpen,
                  slimView
                })
              )
            }
          </TaskListContainerWrapper>
          {taskDrawerOpen && (
            <TaskDrawerContainer>
              <NewTaskDrawer
                closeDrawer={closeTaskDrawer}
                taskList={selectedTaskList}
              />
            </TaskDrawerContainer>
          )}
        </>
      }
      </>
    )
  }

  const renderTaskListSection = ({
      dispatch,
      closeTaskDrawer,
      ...otherProps
    }) => ({listName, taskListId, tasks, completedTasks}) => {
      
      const selectCurrentTask = task => {
        if (!task) {
          closeTaskDrawer();
        }
        storeAsCurrentTask(task)(dispatch);
      };
    return (
      <div key={"taskList_"+listName}>
          <div>
            {tasks && tasks.length > 0 ? 
              <TaskListSection heading={listName} key={listName}>
                <PatientsTasklistEditable
                  tasks={tasks}
                  completedTasks={completedTasks}
                  submitTask={description =>
                    saveTask({ description, taskListId, patientId })(dispatch)
                  }
                  isAddTaskEnabled={false}
                  selectCurrentTask={selectCurrentTask}
                  {...otherProps}
                />
              </TaskListSection>              
             : (
              <p className="light-gray"></p>
            )}
          </div>
      </div>
    )
  }

class TaskListSearchContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    filterBy: '',
    filterPopoverOpen: false,
    searchTerms: [],
    slimView: false
  };

  filterButton = React.createRef();

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount = () => {
    resetTaskSearch(); // task actions
  };

  // pullCompletedTasks = () => {
  //   if (!this.props.showingCompletedTasks) {
  //     this.props.getCompletedTasks();
  //   } else {
  //     this.props.taskActions.hideCompletedTasks();
  //   }
  // };

  setTaskEditingStatus = isEditing => {
    this.setState({ editing: isEditing });
  };

  switchSlimView = () => {
    this.setState(prevState => ({
      slimView: !prevState.slimView,
    }));
  };

  handleFilterChange = filterBy => {
    const { onFilter } = this.props;
    const sortBy = '';

    this.setState({
      filterBy,
    });

    // this.clearStoredCurrentTask();

    onFilter(filterBy, sortBy);
  };

  handleSearch = e => {
    const { value } = e.target;
    const searchTerms = value.toLowerCase().match(/[\S]+/g) || [];

    // this.clearStoredCurrentTask();
    this.setState({ searchTerms });

    // const [taskDrawerOpen, openTaskDrawer, closeTaskDrawer] = useBoolean(false);
    // closeTaskDrawer();

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

  // Lists Activity for a TaskList
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
      tasklists,
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
    const toolbarContainerVisible = (this.props.tasks.length > 0);
    const { slimView, filterBy } = this.state;
    const currentFilterDescription =
      filterOptions.find(({ value }) => value === filterBy)?.description ?? '';
    
    const searchedTasks = {tasks: this.search(this.props.tasks), completedTasks: this.search(this.props.completedTasks)}
    
    return (
      <div className="tasks-container-new">
        <div className="column expanded collapse">
          <StyledToolbar>
              <Grid
                container
                alignItems="center"
                justify={toolbarContainerVisible ? 'space-between' : 'flex-end'}
              >
                {toolbarContainerVisible && (
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
                      onClick={
                        filterBy ? this.clearFilter : this.openFilterPopover
                      }
                      ref={this.filterButton}
                    >
                      Filter
                    </TaskListAction>
                    <Search onChange={this.handleSearch} />
                  </ToolbarContainer>
                )}
              </Grid>
            </StyledToolbar>
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
            {this.props.tasks &&
              // this.renderTaskListName('INCOMPLETE', this.props.tasks)
              <TaskListLayout 
              searchedTasks={searchedTasks}
              isFetching={this.props.isFetching}
              slimView={slimView}
              />
            }
            {this.renderFilterPopover()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    // taskSearchResults: state.taskState.taskSearchResults
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
