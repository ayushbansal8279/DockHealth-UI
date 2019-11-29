import React, { PureComponent, useCallback, useState } from 'react';
import Moment from 'react-moment';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';

import useBoolean from '../../hooks/useBoolean';

import { saveTask, storeAsCurrentTask } from '../../actions/task-actions';
import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskView from '../../views/TaskView';
import MemberInitials from '../members/MemberInitials';

// import { TaskListSection } from '../patients/TaskList';
import PatientsTasklistEditable from '../patients/PatientsTasklistEditable';
import CollapseIcon from '../../img/collapse.svg';


const TaskDrawerContainer = styled.div`
  flex: 1.4;
`;

export const TaskListContainer = styled.div`
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
  const TaskListLayout = ({ searchedTasks, isFetching }) => {
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

    const groupedTasks = groupBy(
      searchedTasks,
      task => task.taskList.listName,
    );

    var listMap = Array.from(groupedTasks.keys())

    // const selectedTaskId = taskDrawerOpen ? selectedTask?.taskId : undefined;
  
    // const selectedTaskList = lists?.find(
    //   ({ taskListId }) => taskListId === selectedTask?.taskListId,
    // );
    
    const selectedTaskList = undefined;

    return (
      <>
      {(!isFetching && (!groupedTasks || groupedTasks.size == 0)) ?
        <div>
          <p className="light-gray" style={{ fontWeight: 'bold' }}>
            No matching tasks
          </p>
        </div>
      : <>
          <p className="light-gray" style={{ fontWeight: 'bold'}}>
            {/* <span>Tasks found</span> */}
          </p>
          <TaskListContainer>
            {listMap.map(
                renderTaskListSection({
                  groupedTasks,
                  dispatch,
                  closeTaskDrawer,
                  openTaskDrawer,
                  taskDrawerOpen
                })
              )
            }
          </TaskListContainer>
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
      groupedTasks,
      dispatch,
      closeTaskDrawer,
      openTaskDrawer,
      taskDrawerOpen,
      ...otherProps
    }) => ( listName ) => {
      const tasks = groupedTasks.get(listName);
      let taskListId = 0;
      if (tasks) {
        taskListId = tasks[0].taskList.taskListId;
      }

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
                  completedTasks={tasks}
                  submitTask={description =>
                    saveTask({ description, taskListId, patientId })(dispatch)
                  }
                  selectCurrentTask={selectCurrentTask}
                  {...otherProps}
                />
              </TaskListSection>              
             : (
              <p className="light-gray">No matching tasks</p>
            )}
          </div>
      </div>
    )
  }

class TaskListSearchContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  pullCompletedTasks = () => {
    if (!this.props.showingCompletedTasks) {
      this.props.getCompletedTasks();
    } else {
      this.props.taskActions.hideCompletedTasks();
    }
  };

  setTaskEditingStatus = isEditing => {
    this.setState({ editing: isEditing });
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
    return (
      <div className="tasks-container-new">
        <div className="row expanded collapse">
            {this.props.tasks &&
              // this.renderTaskListName('INCOMPLETE', this.props.tasks)
              <TaskListLayout 
              searchedTasks={this.props.tasks}
              isFetching={this.props.isFetching}
              />
            }
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
