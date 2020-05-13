import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import {
  TaskViewContainer,
  TaskGroupsContainer,
  AddTaskInputWrapper,
  EmptyListWrapper,
} from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import EditGroupSection from './EditGroupSection/EditGroupSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';

const TaskView = ({
  completedTasks,
  currentUser,
  isSpecialList,
  markComplete,
  members,
  membersNotInTaskList,
  showMembers = true,
  storeAsCurrentTask,
  taskDrawerActions,
  taskActions,
  taskGroupActions,
  taskGroupList,
  taskList = {},
  taskListMembers,
  tasks, // to do- remove tasks prop
}) => {
  const { openDrawer } = taskDrawerActions;
  const { toggleTaskPriority } = taskActions;
  const { createTaskGroupList } = taskGroupActions;
  const { taskListIdentifier } = taskList;
  const [selectedTab, onSelectTab] = useState('OPEN_TASKS');
  const { groupList } = taskGroupList;

  const quickAddTask = taskName => {
    if (taskName) {
      taskActions.saveTask({
        description: taskName,
        taskListIdentifier: taskList.taskListIdentifier,
      });
    }
  };

  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(task, currentUser.userIdentifier, task.priority);
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const deleteGroup = groupName => {
    // TODO: delete group;
    console.log('Delte group:', groupName);
  };

  return (
    <TaskViewContainer>
      <Toolbar
        isSpecialList={isSpecialList}
        members={members}
        membersNotInTaskList={membersNotInTaskList}
        onSelectTab={onSelectTab}
        printData={{
          tasks,
          completedTasks,
          taskListMembers,
        }}
        selectedTab={selectedTab}
        showMembers={showMembers}
        taskList={taskList}
      />
      {tasks.length > 0 ? (
        <TaskGroupsContainer>
          {groupList?.map(({ groupName, taskGroupIdentifier }) => (
            <TasksGroup
              key={taskGroupIdentifier}
              currentUser={currentUser}
              groupName={groupName}
              markComplete={markComplete}
              openDrawer={openDrawer}
              storeAsCurrentTask={storeAsCurrentTask}
              toggleTaskPriority={toggleSingleTaskPriority}
              editGroupName={() => {}}
              quickAddTask={quickAddTask}
              deleteGroup={deleteGroup}
              tasks={[]} // to do - replace by real data
            />
          ))}
          <EditGroupSection
            onEnterClick={groupName =>
              createTaskGroupList(groupName, taskListIdentifier)
            }
            placeholder={messages.placeholder}
          >
            <AddGroupNameButton />
          </EditGroupSection>
        </TaskGroupsContainer>
      ) : (
        <EmptyListWrapper>
          <MontserratTypography variant="h3" weight="400" color="inherit">
            Create your first task
          </MontserratTypography>
          <Spacing vertical={3} />
          <AddTaskInputWrapper>
            <input
              type="text"
              placeholder="Add task"
              onKeyDown={event =>
                event.keyCode === 13 && quickAddTask(event.target.value)
              }
            />
          </AddTaskInputWrapper>
        </EmptyListWrapper>
      )}
      <NewTaskDrawer
        members={members}
        membersNotInTaskList={membersNotInTaskList}
        taskList={taskList}
      />
    </TaskViewContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  taskGroupActions: bindActionCreators(TaskGroupActions, dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
  taskGroupList: store.taskGroupList,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
