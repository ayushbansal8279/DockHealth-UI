import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';

export const onDragEndTask = ({
  eventBundle,
  groupList,
  tasks,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup,
  updateTaskGroups,
  setDraggableId,
}) => {
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

      reorderTasksInGroup(newSourceTasksOrder, taskGroupIdentifier);

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

      const destinationTasks = tasks[destinationGroupKey] || [];

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

      // eslint-disable-next-line sonarjs/no-identical-functions
      const reorderedSourceTasks = newSourceTasksOrder?.map(identifier =>
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

      reassignTasksToAnotherGroup([sourceTaskIdentifier], taskGroupIdentifier);
    }
  }
};

export const onDragEndSubtask = ({
  eventBundle,
  subtasksOrder,
  reorderSubtasksForTask,
  groupId,
  parentTaskId,
  orderedSubtasks,
  reorderSubtasksInState,
  setDraggableId,
}) => {
  const { destination, source } = eventBundle;
  setDraggableId(null);

  if (destination && destination?.index !== source?.index) {
    const newSubtasksOrder = [...subtasksOrder];
    newSubtasksOrder.splice(
      destination.index,
      0,
      newSubtasksOrder.splice(source.index, 1)[0],
    );

    reorderSubtasksForTask(newSubtasksOrder, groupId, parentTaskId);

    const reorderedTasks = newSubtasksOrder.map(taskId =>
      orderedSubtasks.find(({ taskIdentifier }) => taskIdentifier === taskId),
    );

    reorderSubtasksInState(reorderedTasks);
  }
};
