import React from 'react';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';

import { TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import GroupNameSection from './GroupNameSection/GroupNameSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';
import EmptyTasksView from './EmptyTasksView/EmptyTasksView';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';

const OpenedTasksView = ({
  openDrawer,
  createTaskGroupList,
  currentUser,
  toggleCompleteTask,
  storeAsCurrentTask,
  groupedTasks,
  groupList,
  toggleSingleTaskPriority,
  editGroupName,
  quickAddTask,
  openDeleteConfirmationModal,
  changeGroupsOrder,
  reorderTasksInGroup,
  reorderSubtasksForTask,
  taskListIdentifier,
  tasksCount,
  isFetchingData,
}) => {
  return (
    <TasksViewLoader isFetchingData={isFetchingData}>
      {tasksCount > 0 ? (
        <TaskGroupsContainer>
          {groupList?.map(
            ({ groupName, taskGroupIdentifier, groupType }, i) => (
              <TasksGroup
                key={i}
                isDefaultGroup={groupType === TASKGROUP_DEFAULT_TYPE}
                groupId={taskGroupIdentifier}
                currentUser={currentUser}
                groupName={
                  groupType !== TASKGROUP_DEFAULT_TYPE ? groupName : 'NEW TASKS'
                }
                toggleCompleteTask={toggleCompleteTask}
                openDrawer={openDrawer}
                storeAsCurrentTask={storeAsCurrentTask}
                toggleTaskPriority={toggleSingleTaskPriority}
                editGroupName={editGroupName}
                quickAddTask={quickAddTask}
                deleteGroup={openDeleteConfirmationModal}
                moveGroupUp={() => changeGroupsOrder(i, i - 1)}
                moveGroupDown={() => changeGroupsOrder(i, i + 1)}
                isFirstGroup={i === 0}
                isLastGroup={i === groupList?.length - 1}
                tasks={
                  groupedTasks[
                    groupType !== TASKGROUP_DEFAULT_TYPE
                      ? taskGroupIdentifier
                      : TASKGROUP_DEFAULT_TYPE
                  ] || []
                }
                reorderTasksInGroup={reorderTasksInGroup}
                reorderSubtasksForTask={reorderSubtasksForTask}
                taskListIdentifier={taskListIdentifier}
              />
            ),
          )}
          <GroupNameSection
            onEnterClick={groupName => createTaskGroupList(groupName)}
            placeholder={messages.placeholder}
            closeOnEnter
          >
            <AddGroupNameButton />
          </GroupNameSection>
        </TaskGroupsContainer>
      ) : (
        <EmptyTasksView
          quickAddTask={groupName => quickAddTask(groupName, null, true)}
        />
      )}
    </TasksViewLoader>
  );
};

export default OpenedTasksView;
