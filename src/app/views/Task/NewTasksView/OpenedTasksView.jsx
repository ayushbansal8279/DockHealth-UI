/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import { TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import GroupNameSection from './GroupNameSection/GroupNameSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';
import EmptyTasksView from './EmptyTasksView/EmptyTasksView';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';
import { onDragEndTask } from './DragDrop.helpers';

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
  reassignTasksToAnotherGroup,
  reassignTask,
  taskListIdentifier,
  tasksCount,
  isFetchingData,
  members,
  updateDueDate,
  defaultGroupName,
  canEditGroups,
  quickAddTaskVisible,
}) => {
  const [tasks, updateTaskGroups] = useState(groupedTasks);
  const [draggedId, setDraggableId] = useState(null);

  useEffect(() => {
    updateTaskGroups(groupedTasks);
  }, [groupedTasks]);

  return (
    <TasksViewLoader isFetchingData={isFetchingData}>
      {tasksCount > 0 ? (
        <TaskGroupsContainer>
          <DragDropContext
            onBeforeCapture={({ draggableId }) => {
              setDraggableId(draggableId);
            }}
            onDragEnd={eventBundle =>
              onDragEndTask({
                eventBundle,
                groupList,
                tasks,
                reorderTasksInGroup,
                taskListIdentifier,
                reassignTasksToAnotherGroup,
                updateTaskGroups,
                setDraggableId,
              })
            }
          >
            {groupList?.map(
              ({ groupName, taskGroupIdentifier, groupType }, i) => (
                <TasksGroup
                  key={i}
                  isDefaultGroup={groupType === TASKGROUP_DEFAULT_TYPE}
                  groupId={taskGroupIdentifier}
                  currentUser={currentUser}
                  groupName={
                    groupType !== TASKGROUP_DEFAULT_TYPE
                      ? groupName
                      : defaultGroupName
                  }
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
                    tasks[
                      groupType !== TASKGROUP_DEFAULT_TYPE
                        ? taskGroupIdentifier
                        : TASKGROUP_DEFAULT_TYPE
                    ] || []
                  }
                  reorderSubtasksForTask={reorderSubtasksForTask}
                  reassignTask={reassignTask}
                  taskListIdentifier={taskListIdentifier}
                  draggedId={draggedId}
                  toggleCompleteTask={toggleCompleteTask}
                  members={members}
                  updateDueDate={updateDueDate}
                  quickAddTaskVisible={quickAddTaskVisible}
                />
              ),
            )}
          </DragDropContext>
          {canEditGroups && (
            <GroupNameSection
              onEnterClick={groupName => createTaskGroupList(groupName)}
              placeholder={messages.placeholder}
              closeOnEnter
            >
              <AddGroupNameButton />
            </GroupNameSection>
          )}
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
