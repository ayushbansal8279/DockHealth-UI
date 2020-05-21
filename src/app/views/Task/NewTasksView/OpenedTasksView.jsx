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
  taskListIdentifier,
  tasksCount,
  isFetchingData,
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
            onDragEnd={eventBundle => {
              setDraggableId(null);

              const { destination, source } = eventBundle;

              const sourceGroup = groupList?.find(
                ({ taskGroupIdentifier, groupType }) =>
                  source.droppableId === taskGroupIdentifier ||
                  source.droppableId === groupType,
              );

              const sourceGroupKey =
                sourceGroup.groupType === TASKGROUP_DEFAULT_TYPE
                  ? sourceGroup.groupType
                  : sourceGroup.taskGroupIdentifier;

              const sourceTasks = tasks[sourceGroupKey];

              const sourceTasksOrder = sourceTasks?.map(
                ({ taskIdentifier }) => taskIdentifier,
              );

              const newSourceTasksOrder = [...sourceTasksOrder];

              if (destination) {
                if (
                  destination?.droppableId === source?.droppableId &&
                  destination?.index !== source?.index
                ) {
                  newSourceTasksOrder.splice(
                    destination.index,
                    0,
                    newSourceTasksOrder.splice(source.index, 1)[0],
                  );

                  const { taskGroupIdentifier } = sourceGroup;

                  reorderTasksInGroup(
                    newSourceTasksOrder,
                    taskGroupIdentifier,
                    taskListIdentifier,
                  );

                  const reorderedTasks = newSourceTasksOrder?.map(identifier =>
                    sourceTasks?.find(
                      ({ taskIdentifier }) => taskIdentifier === identifier,
                    ),
                  );

                  updateTaskGroups({
                    ...tasks,
                    [sourceGroupKey]: reorderedTasks,
                  });
                }

                if (
                  destination?.droppableId !== source?.droppableId &&
                  destination?.index !== source?.index
                ) {
                  const destinationGroup = groupList?.find(
                    ({ taskGroupIdentifier, groupType }) =>
                      destination.droppableId === taskGroupIdentifier ||
                      destination.droppableId === groupType,
                  );

                  const destinationGroupKey =
                    destinationGroup.groupType === TASKGROUP_DEFAULT_TYPE
                      ? destinationGroup.groupType
                      : destinationGroup.taskGroupIdentifier;

                  const destinationTasks = tasks[destinationGroupKey];

                  const destinationTasksOrder = destinationTasks?.map(
                    ({ taskIdentifier }) => taskIdentifier,
                  );

                  const newDestinationTasksOrder = [...destinationTasksOrder];

                  newDestinationTasksOrder.splice(
                    destination.index,
                    0,
                    sourceTasksOrder[source.index],
                  );

                  newSourceTasksOrder.splice(source.index, 1);

                  const { taskGroupIdentifier } = destinationGroup;
                  const sourceTask = sourceTasks[source.index];
                  const { taskIdentifier: sourceTaskIdentifier } = sourceTask;

                  reassignTasksToAnotherGroup(
                    [sourceTaskIdentifier],
                    taskGroupIdentifier,
                    taskListIdentifier,
                  );

                  const reorderedSourceTasks = newSourceTasksOrder?.map(
                    identifier =>
                      sourceTasks?.find(
                        ({ taskIdentifier }) => taskIdentifier === identifier,
                      ),
                  );

                  const newDestinationTasks = [...destinationTasks, sourceTask];

                  const reorderedDestinationTasks = newDestinationTasksOrder?.map(
                    identifier =>
                      newDestinationTasks?.find(
                        ({ taskIdentifier }) => taskIdentifier === identifier,
                      ),
                  );

                  updateTaskGroups({
                    ...tasks,
                    [sourceGroupKey]: reorderedSourceTasks,
                    [destinationGroupKey]: reorderedDestinationTasks,
                  });
                }
              }
            }}
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
                      : 'NEW TASKS'
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
                  taskListIdentifier={taskListIdentifier}
                  draggedId={draggedId}
                  toggleCompleteTask={toggleCompleteTask}
                />
              ),
            )}
          </DragDropContext>
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
